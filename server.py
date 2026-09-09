#!/usr/bin/env python3
"""Local static server and same-origin use-scene research proxy."""

from __future__ import annotations

import html
import base64
import getpass
import ipaddress
import json
import os
import re
import socket
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
MAX_REQUEST_BYTES = 48 * 1024 * 1024
MAX_IMAGE_PROMPT_CHARS = 30_000
MAX_IMAGE_REFERENCES = 6
MAX_PROXY_BYTES = 12 * 1024 * 1024
MAX_DIMENSION_IMAGE_URLS = 12
MAX_REFERENCE_MAP_IMAGE_URLS = 40
MAX_VISION_IMAGE_BYTES = 2 * 1024 * 1024
SCENE_CACHE_TTL_SECONDS = 60 * 60
SCENE_CACHE: dict[str, tuple[float, dict[str, object]]] = {}
SELLING_POINT_CACHE: dict[str, tuple[float, dict[str, object]]] = {}
PRODUCT_DIMENSION_CACHE: dict[str, tuple[float, dict[str, object]]] = {}
PRODUCT_ANALYSIS_CACHE: dict[str, tuple[float, dict[str, object]]] = {}
REFERENCE_IMAGE_MAP_CACHE: dict[str, tuple[float, dict[str, object]]] = {}
# Coding Plan has its own OpenAI-compatible base URL. Using /api/v3 here
# bypasses the plan quota and bills the regular Ark account instead.
ARK_RESPONSES_URL = "https://ark.cn-beijing.volces.com/api/coding/v3/responses"
DEFAULT_ARK_MODEL = "doubao-seed-2.0-lite"
DEFAULT_GRSAI_BASE_URL = "https://grsai.dakka.com.cn"
GRSAI_MODELS = {"gpt-image-2", "gpt-image-2-vip"}
GRSAI_SQUARE_SIZES = {
    "gpt-image-2": {"1024x1024"},
    "gpt-image-2-vip": {"1024x1024", "2048x2048", "2880x2880"},
}
GRSAI_TASK_ID_PATTERN = re.compile(r"^[A-Za-z0-9_-]{6,160}$")
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
)
PROXY_HOST_SUFFIXES = (
    "alicdn.com",
    "tmall.com",
    "1688.com",
    "taobao.com",
    # Saved Amazon competitor HTML uses this CDN for its five gallery images.
    # Candidate thumbnails are rendered through /api/source-proxy, so the CDN
    # must be explicitly allowed here as well as in the HTML extractor.
    "media-amazon.com",
    "images-amazon.com",
)


def grsai_base_url() -> str:
    value = os.environ.get("GRSAI_BASE_URL", DEFAULT_GRSAI_BASE_URL).strip().rstrip("/")
    try:
        parsed = urllib.parse.urlsplit(value)
    except ValueError:
        return DEFAULT_GRSAI_BASE_URL
    host = (parsed.hostname or "").lower()
    if (
        parsed.scheme != "https"
        or host not in {"grsaiapi.com", "grsai.dakka.com.cn"}
        or parsed.path not in {"", "/"}
        or parsed.query
        or parsed.fragment
        or parsed.username
        or parsed.password
    ):
        return DEFAULT_GRSAI_BASE_URL
    return value


def image_reference_url(value: object) -> str:
    raw = str(value or "").strip()
    data_match = re.fullmatch(r"data:image/(jpeg|png|webp);base64,([A-Za-z0-9+/=\r\n]+)", raw, flags=re.I)
    if data_match:
        encoded = data_match.group(2)
        if len(encoded) > 8_000_000:
            return ""
        try:
            decoded = base64.b64decode(encoded, validate=True)
        except (ValueError, base64.binascii.Error):
            return ""
        return raw if 0 < len(decoded) <= 6 * 1024 * 1024 else ""
    url = clean_text(raw, 2000)
    try:
        parsed = urllib.parse.urlsplit(url)
    except ValueError:
        return ""
    return url if parsed.scheme in {"http", "https"} and parsed.netloc else ""


def allowed_proxy_url(value: str) -> bool:
    try:
        parsed = urllib.parse.urlsplit(value)
    except ValueError:
        return False
    host = (parsed.hostname or "").lower()
    return parsed.scheme in {"http", "https"} and any(
        host == suffix or host.endswith(f".{suffix}") for suffix in PROXY_HOST_SUFFIXES
    )


def allowed_public_image_url(value: str) -> bool:
    try:
        parsed = urllib.parse.urlsplit(value)
        host = parsed.hostname or ""
        port = parsed.port
    except ValueError:
        return False
    if parsed.scheme not in {"http", "https"} or not host or parsed.username or parsed.password:
        return False
    if port not in {None, 80, 443}:
        return False
    try:
        addresses = {item[4][0] for item in socket.getaddrinfo(host, port or (443 if parsed.scheme == "https" else 80), type=socket.SOCK_STREAM)}
    except socket.gaierror:
        return False
    return bool(addresses) and all(ipaddress.ip_address(address).is_global for address in addresses)

# These labels are returned only when the downloaded search evidence contains
# the corresponding phrases. They are evidence extractors, not fallback scenes.
SCENE_EVIDENCE_RULES = (
    ("Construction site hazard marking", (r"construction sites?", r"construction zones?")),
    ("Warehouse aisle and floor marking", (r"warehouses?", r"aisle marking", r"floor marking")),
    ("Industrial facility safety marking", (r"industrial facilit(?:y|ies)", r"factory floors?", r"industrial work areas?")),
    ("Road work and traffic control", (r"road work", r"road construction", r"traffic control", r"road administration")),
    ("Restricted area access control", (r"restricted areas?", r"restrict access", r"hazardous areas?")),
    ("Public space safety marking", (r"public spaces?", r"crowd control")),
    ("Utility and underground line marking", (r"utility projects?", r"underground utilities", r"buried lines?")),
    ("Home daily use", (r"home use", r"at home", r"household use")),
    ("Office workplace use", (r"office use", r"workplaces?", r"office setting")),
    ("Professional studio use", (r"professional studios?", r"studio use")),
    ("Kitchen food preparation", (r"kitchen preparation", r"food preparation", r"home kitchen")),
    ("Cafe and coffee bar", (r"coffee shops?", r"coffee bars?", r"caf[eé]s?", r"barista")),
    ("Gym strength training", (r"gym training", r"strength training", r"fitness training")),
    ("Physical therapy session", (r"physical therapy", r"rehabilitation session")),
    ("Yoga or Pilates studio", (r"yoga studio", r"pilates studio", r"pilates class")),
    ("Florist bouquet wrapping", (r"florist", r"bouquet wrapping", r"flower wrapping")),
    ("Gift packaging table", (r"gift packaging", r"gift wrapping")),
    ("Wedding floral preparation", (r"wedding floral", r"wedding flowers?", r"event floral")),
    ("Bathroom after-shower use", (r"after shower", r"bathroom use", r"shower slippers?")),
    ("Poolside use", (r"poolside", r"swimming pool")),
    ("Beach vacation", (r"beach vacation", r"beach use", r"on the beach")),
    ("Hotel and spa stay", (r"hotel and spa", r"spa use", r"hotel slippers?")),
    ("Rainy city commute", (r"rainy commute", r"city commute", r"commuting in the rain")),
    ("Sunny outdoor shade", (r"sun shade", r"sun protection", r"outdoor shade")),
    ("Camping and outdoor travel", (r"camping", r"outdoor travel", r"travel use")),
)


def clean_text(value: object, limit: int = 180) -> str:
    text = re.sub(r"\s+", " ", str(value or "")).strip()
    return text[:limit]


def strip_search_markup(source: str) -> str:
    source = re.sub(r"<script\b[^>]*>.*?</script>", " ", source, flags=re.I | re.S)
    source = re.sub(r"<style\b[^>]*>.*?</style>", " ", source, flags=re.I | re.S)
    source = re.sub(r"<[^>]+>", " ", source)
    return re.sub(r"\s+", " ", html.unescape(source)).strip()


def fetch_search_evidence(query: str) -> tuple[list[str], str, list[str]]:
    errors: list[str] = []
    evidence_blocks: list[str] = []
    useful_sources: list[str] = []
    encoded = urllib.parse.urlencode({"q": f"{query} common uses applications environments", "source": "web"})
    urls = (
        ("Brave Search", f"https://search.brave.com/search?{encoded}"),
        ("Bing", f"https://www.bing.com/search?{encoded}&cc=us&setlang=en-US&ensearch=1"),
    )
    for source_name, url in urls:
        request = urllib.request.Request(
            url,
            headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml"},
        )
        try:
            with urllib.request.urlopen(request, timeout=12) as response:
                body = response.read(600_000).decode("utf-8", errors="replace")
            evidence = strip_search_markup(body)
            if len(evidence) < 200:
                errors.append(f"{source_name}: empty response")
                continue
            if extract_scenes(evidence):
                useful_sources.append(source_name)
                evidence_blocks.append(evidence)
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, socket.timeout) as error:
            errors.append(f"{source_name}: {error}")
    return useful_sources, " ".join(evidence_blocks), errors


def extract_scenes(evidence: str, limit: int = 5) -> list[str]:
    lower = evidence.lower()
    scenes: list[str] = []
    for label, patterns in SCENE_EVIDENCE_RULES:
        if any(re.search(pattern, lower, flags=re.I) for pattern in patterns):
            scenes.append(label)
        if len(scenes) >= limit:
            break
    return scenes


def response_output_text(payload: dict[str, object]) -> str:
    text_parts: list[str] = []
    for item in payload.get("output", []) if isinstance(payload.get("output"), list) else []:
        if not isinstance(item, dict) or item.get("type") != "message":
            continue
        content = item.get("content", [])
        if not isinstance(content, list):
            continue
        for part in content:
            if isinstance(part, dict) and part.get("type") == "output_text" and part.get("text"):
                text_parts.append(str(part["text"]))
    return "\n".join(text_parts).strip()


def parse_json_object(text: str) -> dict[str, object]:
    clean = text.strip()
    clean = re.sub(r"^```(?:json)?\s*", "", clean, flags=re.I)
    clean = re.sub(r"\s*```$", "", clean)
    try:
        parsed = json.loads(clean)
        return parsed if isinstance(parsed, dict) else {}
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", clean, flags=re.S)
        if not match:
            return {}
        try:
            parsed = json.loads(match.group(0))
            return parsed if isinstance(parsed, dict) else {}
        except json.JSONDecodeError:
            return {}


def source_image_data_url(url: str) -> tuple[str, str]:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "image/avif,image/webp,image/png,image/jpeg,*/*",
            "Referer": "https://detail.1688.com/",
        },
    )
    with urllib.request.urlopen(request, timeout=15) as response:
        content_type = response.headers.get_content_type()
        body = response.read(MAX_VISION_IMAGE_BYTES + 1)
    if len(body) > MAX_VISION_IMAGE_BYTES:
        raise ValueError("source image too large")
    if content_type not in {"image/jpeg", "image/png", "image/webp"}:
        if body.startswith(b"\xff\xd8\xff"):
            content_type = "image/jpeg"
        elif body.startswith(b"\x89PNG\r\n\x1a\n"):
            content_type = "image/png"
        elif body.startswith(b"RIFF") and body[8:12] == b"WEBP":
            content_type = "image/webp"
        else:
            raise ValueError(f"unsupported image type {content_type}")
    encoded = base64.b64encode(body).decode("ascii")
    return f"data:{content_type};base64,{encoded}", content_type


def vision_content_for_images(image_urls: list[str], limit: int = MAX_DIMENSION_IMAGE_URLS) -> tuple[list[dict[str, object]], list[str]]:
    content: list[dict[str, object]] = []
    errors: list[str] = []
    for index, url in enumerate(image_urls[:limit], 1):
        content.append({"type": "input_text", "text": f"Image {index} source_url: {url}"})
        try:
            data_url, _ = source_image_data_url(url)
            content.append({"type": "input_image", "image_url": data_url})
        except (ValueError, urllib.error.URLError, urllib.error.HTTPError, TimeoutError, socket.timeout) as error:
            content.append({"type": "input_image", "image_url": url})
            errors.append(f"Image {index} local fetch failed; used remote URL: {clean_text(error, 160)}")
    return content, errors


def evidence_image_url(value: object, image_urls: list[str]) -> str:
    image_url = clean_text(value, 500)
    if allowed_proxy_url(image_url):
        return image_url
    source = image_url.casefold()
    for index, url in enumerate(image_urls, 1):
        if source in {f"image {index}", f"image_{index}", f"#{index}", str(index)}:
            return url
    match = re.search(r"(?:image|#)\s*[_-]?(\d+)", source, flags=re.I)
    if match:
        index = int(match.group(1)) - 1
        if 0 <= index < len(image_urls):
            return image_urls[index]
    return image_urls[0] if len(image_urls) == 1 else ""


def reference_image_group(image_type: str) -> str:
    value = clean_text(image_type, 80).lower().replace("-", "_").replace(" ", "_")
    if re.search(r"caliper|ruler|measurement_tool|tool_measurement|raw_measurement", value):
        return "measurement_tool"
    if re.search(r"parameter|measurement|dimension|size|spec", value):
        return "parameter"
    if re.search(r"detail|close|macro|material|texture|construction|structure", value):
        return "detail"
    if re.search(r"feature|benefit|demo|demonstration|function|proof", value):
        return "feature"
    if re.search(r"life|scene|use|application|environment", value):
        return "lifestyle"
    if re.search(r"angle|multi|side|front|back|top", value):
        return "angle"
    if re.search(r"comparison|variant|option|color", value):
        return "option"
    if re.search(r"hero|overview|product|white|main", value):
        return "hero"
    return "other"


def diversified_reference_urls(assignments: list[dict[str, str]], limit: int = 20) -> list[str]:
    quotas = {
        "hero": 4,
        "detail": 4,
        "feature": 3,
        "lifestyle": 3,
        "angle": 3,
        "option": 2,
        "parameter": 3,
        "measurement_tool": 0,
        "other": 2,
    }
    order = ["parameter", "detail", "feature", "hero", "lifestyle", "angle", "option", "other", "measurement_tool"]
    groups: dict[str, list[dict[str, str]]] = {key: [] for key in order}
    seen: set[str] = set()
    for index, item in enumerate(assignments):
        url = item.get("url", "")
        if not url or url in seen:
            continue
        seen.add(url)
        group = reference_image_group(item.get("image_type", ""))
        groups.setdefault(group, []).append({**item, "group": group, "order": str(index)})

    def is_alternate_color(item: dict[str, str]) -> bool:
        value = " ".join((str(item.get("sku_match", "")), str(item.get("reason", "")))).lower()
        return bool(re.search(
            r"same[_\s-]*product[_\s-]*alternate[_\s-]*color|alternate[_\s-]*color|"
            r"color[_\s-]*variant|different[_\s-]*color|同款异色",
            value,
        ))

    def priority(item: dict[str, str]) -> tuple[int, int, int, int]:
        exact = 1 if "exact" in str(item.get("sku_match", "")).lower() else 0
        high_value = 1 if str(item.get("reference_value", "")).lower() == "high" else 0
        high_confidence = 1 if str(item.get("confidence", "")).lower() == "high" else 0
        return exact, high_value, high_confidence, -int(item.get("order", "0"))

    for items in groups.values():
        items.sort(key=priority, reverse=True)

    selected: list[str] = []
    selected_set: set[str] = set()

    def add(url: str) -> None:
        if url and url not in selected_set and len(selected) < limit:
            selected.append(url)
            selected_set.add(url)

    primary_by_group = {
        group: [item for item in groups.get(group, []) if not is_alternate_color(item)]
        for group in order
    }
    for group in order:
        for item in primary_by_group[group][:1]:
            add(item["url"])

    for group in order:
        for item in primary_by_group[group][1:quotas.get(group, 2)]:
            add(item["url"])

    for group in order:
        for item in groups.get(group, []):
            if not is_alternate_color(item) and group != "measurement_tool":
                add(item["url"])

    alternate_items = [
        item
        for group in ["parameter", "detail", "feature", "angle", "option", "other"]
        for item in groups.get(group, [])
        if is_alternate_color(item)
    ]
    for item in sorted(alternate_items, key=priority, reverse=True)[:2]:
        add(item["url"])

    return selected


def expanded_dimension_values(label: str, value: str, evidence: str) -> list[tuple[str, str]]:
    clean = " ".join(part for part in (value, evidence) if part)
    unit_match = re.search(r"(mm|cm|in|m|ft|yd)", clean, flags=re.I)
    unit = unit_match.group(1) if unit_match else ""
    spec_match = re.search(
        r"([0-9]+(?:\.[0-9]+)?)\s*[x×*]\s*([0-9]+(?:\.[0-9]+)?)(?:\s*[x×*]\s*([0-9]+(?:\.[0-9]+)?))?\s*(?:[（(]?\s*(mm|cm|in|m|ft|yd)\s*[）)]?)?",
        clean,
        flags=re.I,
    )
    if spec_match and (unit or spec_match.group(4)):
        spec_unit = spec_match.group(4) or unit
        labels = ["Length", "Width", "Thickness" if spec_match.group(3) else "Height"]
        return [
            (labels[index], f"{number} {spec_unit}")
            for index, number in enumerate(spec_match.groups()[:3])
            if number
        ]
    normalized_label = clean_text(label, 40).title()
    normalized_label = {
        "Overall Projection": "Projection Depth",
        "Wall Projection": "Projection Depth",
        "Projection": "Projection Depth",
        "Suction Cup Diameter": "Base Diameter",
        "Backplate Diameter": "Base Diameter",
        "Knob Diameter": "Front Diameter",
    }.get(normalized_label, normalized_label)
    normalized_value = clean_text(value, 40)
    is_measurement_label = normalized_label in {
        "Length", "Width", "Thickness", "Height", "Depth", "Projection Depth",
        "Base Diameter", "Front Diameter", "Diameter", "Weight", "Capacity",
    } or bool(re.fullmatch(
        r"(?:[A-Za-z][A-Za-z -]{0,24}\s)?(?:Length|Width|Thickness|Height|Depth|Diameter|Projection)|Visible Dimension [1-9]",
        normalized_label,
    ))
    if is_measurement_label and re.fullmatch(
        r"[0-9]+(?:\.[0-9]+)?\s*(?:mm|cm|in|m|ft|yd|g|kg|lb|oz|ml|l)",
        normalized_value,
        flags=re.I,
    ):
        return [(normalized_label, normalized_value)]
    return []


def fetch_ark_scenes(
    identity: str,
    api_key: str,
    model: str,
) -> tuple[list[str], list[str], list[str], str, list[str]]:
    prompt = f"""You are a cross-border ecommerce product researcher.

Original product facts (may contain Chinese):
{identity}

Complete these steps in order:
1. Translate and normalize the product into one precise English product keyword phrase actually used by cross-border buyers and sellers on Amazon.com, Alibaba.com, Google Shopping, Walmart, eBay, industrial supplier sites, or manufacturer catalogs. Do not translate word-for-word when the marketplace term is different. Exclude brand noise, model numbers, pack counts, and promotional language unless essential to product identity.
2. Use that English product keyword as the core of every web search. Add relevant material, structure, specification, detail features, and selling points only to disambiguate the exact product. Selling points help identify the product but are not use scenes by themselves.
3. Search cross-border ecommerce listings plus credible manufacturer, retailer, distributor, or industry sources for explicitly stated applications, environments, or occasions.
4. Convert only directly evidenced uses into concise English scene phrases.

You MUST call web search. Prefer English-language cross-border commerce and industry sources. Do not base scenes only on Chinese search results.

Return JSON only in this exact shape:
{{"english_product_keyword":"Marketplace-standard English product keyword","search_queries":["English query actually searched"],"scenes":[{{"scene":"Concise English scene phrase","evidence_url":"https://...","evidence_quote":"Short supporting phrase from the source"}}]}}

Rules:
- The English product keyword must identify the exact product type, not a broad category.
- Return 1 to 4 English search queries that all contain the English product keyword.
- Return 3 to 5 distinct scenes only when each scene has direct web evidence.
- Each scene must be 2 to 8 English words and describe a visible use environment or occasion.
- The URL and quote must directly support that specific scene.
- Do not infer from product category, do not use generic fallback scenes, and do not invent contexts.
- If reliable evidence is absent, still return the English keyword and queries, but return "scenes":[].
"""
    request_payload = {
        "model": model,
        "input": prompt,
        "tools": [{"type": "web_search"}],
    }
    body = json.dumps(request_payload, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(
        ARK_RESPONSES_URL,
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            response_payload = json.loads(response.read(2_000_000).decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = ""
        try:
            error_payload = json.loads(error.read(200_000).decode("utf-8", errors="replace"))
            detail = clean_text(error_payload.get("error", {}).get("message", ""), 240)
        except (json.JSONDecodeError, AttributeError):
            detail = ""
        return [], [], [f"Doubao API HTTP {error.code}{': ' + detail if detail else ''}"], "", []
    except (urllib.error.URLError, TimeoutError, socket.timeout, json.JSONDecodeError) as error:
        return [], [], [f"Doubao API: {error}"], "", []

    parsed = parse_json_object(response_output_text(response_payload))
    english_product_keyword = clean_text(parsed.get("english_product_keyword"), 120)
    if (
        not re.fullmatch(r"[\x00-\x7F]{4,120}", english_product_keyword)
        or len(re.findall(r"[A-Za-z]+", english_product_keyword)) < 2
    ):
        return [], [], ["Doubao web search did not return a valid cross-border English product keyword"], "", []
    raw_queries = parsed.get("search_queries", [])
    search_queries = []
    if isinstance(raw_queries, list):
        search_queries = [
            query for query in (clean_text(item, 220) for item in raw_queries)
            if query and re.fullmatch(r"[\x00-\x7F]{4,220}", query)
        ][:4]
    raw_scenes = parsed.get("scenes", [])
    if not isinstance(raw_scenes, list):
        return [], [], ["Doubao API returned an invalid scenes payload"], english_product_keyword, search_queries

    scenes: list[str] = []
    evidence_urls: list[str] = []
    seen: set[str] = set()
    for item in raw_scenes:
        if not isinstance(item, dict):
            continue
        scene = clean_text(item.get("scene"), 70)
        evidence_url = clean_text(item.get("evidence_url"), 500)
        evidence_quote = clean_text(item.get("evidence_quote"), 300)
        if not re.fullmatch(r"[\x00-\x7F]{6,70}", scene):
            continue
        if len(re.findall(r"[A-Za-z]+", scene)) < 2:
            continue
        if not re.match(r"^https?://", evidence_url) or len(evidence_quote) < 6:
            continue
        key = scene.casefold()
        if key in seen:
            continue
        seen.add(key)
        scenes.append(scene)
        evidence_urls.append(evidence_url)
        if len(scenes) >= 5:
            break
    if len(scenes) < 3:
        return [], [], ["Doubao web search found fewer than 3 fully evidenced scenes"], english_product_keyword, search_queries
    return scenes, list(dict.fromkeys(evidence_urls)), [], english_product_keyword, search_queries


def fetch_ark_selling_points(
    identity: str,
    api_key: str,
    model: str,
) -> tuple[list[str], list[str], list[str], str, list[str]]:
    prompt = f"""You are a cross-border ecommerce product researcher.

Verified product facts (may contain Chinese):
{identity}

The supplier source did not contain usable selling points. Complete these steps:
1. Normalize the exact product into a marketplace-standard English keyword phrase.
2. Search Amazon.com, Alibaba.com, Google Shopping, Walmart, eBay, manufacturer, distributor, or credible industry sources using that exact English product keyword plus verified material, structure, and specification details.
3. Find concrete product properties or benefits explicitly stated for this exact product type, such as functional performance, material behavior, construction, durability, finish, or decorative function.
4. Return only claims directly supported by a source page. Do not turn use scenes into selling points and do not infer unsupported performance.

You MUST call web search. Return JSON only:
{{"english_product_keyword":"Marketplace-standard English product keyword","search_queries":["English query actually searched"],"selling_points":[{{"claim":"Concise English selling point","evidence_url":"https://...","evidence_quote":"Short supporting phrase from the source"}}]}}

Rules:
- Return 1 to 4 distinct selling points only when each has direct web evidence.
- Arrange the claims as two coherent image groups with at most two claims per group: items 1-2 explain the distinctive mechanism and installation/use convenience; items 3-4 explain verified performance plus compatibility, durability, environment resistance, or reuse.
- Merge synonymous claims instead of spending multiple slots on the same benefit. “Quick installation”, “easy installation”, and “no-drill installation” are one idea; “strong suction”, “stable hold”, and “does not fall” are one idea.
- Each claim must be 3 to 12 English words and describe a product property or benefit, not a scene.
- The URL and quote must directly support that claim.
- Exclude price, shipping, promotions, generic praise, unverifiable superlatives, and unsupported safety claims.
- If reliable evidence is absent, return "selling_points":[].
"""
    request_payload = {
        "model": model,
        "input": prompt,
        "tools": [{"type": "web_search"}],
    }
    request = urllib.request.Request(
        ARK_RESPONSES_URL,
        data=json.dumps(request_payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            response_payload = json.loads(response.read(2_000_000).decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = ""
        try:
            error_payload = json.loads(error.read(200_000).decode("utf-8", errors="replace"))
            detail = clean_text(error_payload.get("error", {}).get("message", ""), 240)
        except (json.JSONDecodeError, AttributeError):
            detail = ""
        return [], [], [f"Doubao API HTTP {error.code}{': ' + detail if detail else ''}"], "", []
    except (urllib.error.URLError, TimeoutError, socket.timeout, json.JSONDecodeError) as error:
        return [], [], [f"Doubao API: {error}"], "", []

    parsed = parse_json_object(response_output_text(response_payload))
    english_product_keyword = clean_text(parsed.get("english_product_keyword"), 120)
    if (
        not re.fullmatch(r"[\x00-\x7F]{4,120}", english_product_keyword)
        or len(re.findall(r"[A-Za-z]+", english_product_keyword)) < 2
    ):
        return [], [], ["Doubao web search did not return a valid product keyword"], "", []
    raw_queries = parsed.get("search_queries", [])
    search_queries = []
    if isinstance(raw_queries, list):
        search_queries = [
            query for query in (clean_text(item, 220) for item in raw_queries)
            if query and re.fullmatch(r"[\x00-\x7F]{4,220}", query)
        ][:4]
    raw_points = parsed.get("selling_points", [])
    if not isinstance(raw_points, list):
        return [], [], ["Doubao API returned an invalid selling-points payload"], english_product_keyword, search_queries

    points: list[str] = []
    evidence_urls: list[str] = []
    seen: set[str] = set()
    for item in raw_points:
        if not isinstance(item, dict):
            continue
        claim = clean_text(item.get("claim"), 120)
        evidence_url = clean_text(item.get("evidence_url"), 500)
        evidence_quote = clean_text(item.get("evidence_quote"), 300)
        word_count = len(re.findall(r"[A-Za-z]+", claim))
        if not re.fullmatch(r"[\x00-\x7F]{6,120}", claim) or not 3 <= word_count <= 12:
            continue
        if not re.match(r"^https?://", evidence_url) or len(evidence_quote) < 6:
            continue
        key = claim.casefold()
        if key in seen:
            continue
        seen.add(key)
        points.append(claim)
        evidence_urls.append(evidence_url)
        if len(points) >= 4:
            break
    return points, list(dict.fromkeys(evidence_urls)), ([] if points else ["No fully evidenced selling points found"]), english_product_keyword, search_queries


def fetch_ark_product_dimensions(
    identity: str,
    image_urls: list[str],
    api_key: str,
    model: str,
) -> tuple[list[str], list[str], list[str]]:
    content: list[dict[str, object]] = [{
        "type": "input_text",
        "text": f"""You are extracting product measurement evidence for an Amazon parameter image.

Verified product context:
{identity}

Read the attached supplier product images and return only dimensions that are visibly stated for the product itself in its fully expanded/open state.

Return JSON only:
{{"dimensions":[{{"label":"Length","value":"1100 mm","evidence":"规格 1100*25*1(mm)","image_url":"https://..."}}]}}

Rules:
- Use only dimensions visibly printed in the images.
- Never use package, shipping, carton, box, bag, folded storage, rolled storage, or logistics dimensions.
- For tape, grip tape, overgrip, handle wrap, adhesive tape, or similar roll products, map the flat unfolded product as Length, Width, and Thickness.
- Preserve every clearly printed product measurement and every separate arrow value in a parameter/reference image; common structured fields are not a maximum list. If an arrow's meaning is visually clear, use a concise English label such as Base Diameter, Front Diameter, Stem Depth, or Overall Projection. If the value is unquestionably a product measurement but the exact part name is unclear, retain it as Visible Dimension 1, Visible Dimension 2, etc. rather than dropping the value.
- For a wall hook, suction hook, wall hanger, or similar mounted product, preserve all separately shown diameters and depth/projection measurements. Chinese “总出墙/总出墙高度/出墙高度” means the installed product's Overall Projection from the wall; do not omit it or relabel it as package height.
- If a three-part spec is shown, map it as Length x Width x Thickness unless the image explicitly says otherwise.
- Return every clearly visible product measurement, up to 8 dimensions. Keep separately printed component measurements as separate items. If no clear product dimension evidence is visible, return "dimensions":[].
""",
    }]
    for url in image_urls[:MAX_DIMENSION_IMAGE_URLS]:
        content.append({"type": "input_image", "image_url": url})
    request_payload = {
        "model": model,
        "input": [{"role": "user", "content": content}],
    }
    request = urllib.request.Request(
        ARK_RESPONSES_URL,
        data=json.dumps(request_payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            response_payload = json.loads(response.read(2_000_000).decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = ""
        try:
            error_payload = json.loads(error.read(200_000).decode("utf-8", errors="replace"))
            detail = clean_text(error_payload.get("error", {}).get("message", ""), 240)
        except (json.JSONDecodeError, AttributeError):
            detail = ""
        return [], [], [f"Doubao API HTTP {error.code}{': ' + detail if detail else ''}"]
    except (urllib.error.URLError, TimeoutError, socket.timeout, json.JSONDecodeError) as error:
        return [], [], [f"Doubao API: {error}"]

    parsed = parse_json_object(response_output_text(response_payload))
    raw_dimensions = parsed.get("dimensions", [])
    if not isinstance(raw_dimensions, list):
        return [], [], ["Doubao API returned an invalid dimensions payload"]

    dimensions: list[str] = []
    evidence_urls: list[str] = []
    seen: set[str] = set()
    for item in raw_dimensions:
        if not isinstance(item, dict):
            continue
        label = clean_text(item.get("label"), 40).title()
        value = clean_text(item.get("value"), 40)
        evidence = clean_text(item.get("evidence"), 120)
        image_url = clean_text(item.get("image_url"), 500)
        expanded_values = expanded_dimension_values(label, value, evidence)
        if not re.fullmatch(r"[0-9]+(?:\.[0-9]+)?\s*(?:mm|cm|in|m|ft|yd|g|kg|lb|oz|ml|l)", value, flags=re.I):
            continue
        if not evidence or not allowed_proxy_url(image_url) or not expanded_values:
            continue
        for expanded_label, expanded_value in expanded_values:
            key = f"{expanded_label}:{expanded_value}".casefold()
            if key in seen:
                continue
            seen.add(key)
            dimensions.append(f"{expanded_label}: {expanded_value}")
            evidence_urls.append(image_url)
            if len(dimensions) >= 8:
                break
        if len(dimensions) >= 8:
            break
    return dimensions, list(dict.fromkeys(evidence_urls)), ([] if dimensions else ["No visible product dimensions found"])


def fetch_ark_product_analysis(
    identity: str,
    local_evidence: str,
    image_urls: list[str],
    api_key: str,
    model: str,
) -> dict[str, object]:
    content: list[dict[str, object]] = [{
        "type": "input_text",
        "text": f"""You are the final product-fact organizer for a cross-border ecommerce image workflow.

Analyze the attached 1688 supplier images together with the locally extracted text. The images are the primary truth source. The local OCR text is supporting evidence and may contain OCR mistakes. Current Amazon/listing values are context only and must never override a clearly visible supplier fact.

Current product context:
{identity}

Locally extracted supplier text:
{local_evidence}

Return JSON only in this exact shape:
{{"product_name":{{"value":"Perforated ribbed racket overgrip","evidence":"双色打孔龙骨手胶","image_ref":"Image 1"}},"attributes":[{{"field":"Material","value":"Sweat-absorbing PU + EVA cushioning strip","evidence":"材质：吸汗PU+EVA减震条","image_ref":"Image 1"}}],"dimensions":[{{"label":"Length","value":"1100 mm","evidence":"规格 1100*25*1(mm)","image_ref":"Image 1"}}],"selling_points":[{{"claim":"Sweat-absorbing perforated grip","evidence":"吸汗 透气 防滑","image_ref":"Image 2"}}],"use_scenes":[{{"scene":"Badminton racket handle wrapping","evidence":"适用范围：羽毛球拍","image_ref":"Image 3"}}]}}

Rules:
- Use only facts visibly stated or unmistakably shown in the attached images for this exact product.
- Use the locally extracted text to recover words that are hard to read, but accept them only when consistent with an attached image.
- Translate extracted values and selling points into concise marketplace English, while copying a short original image phrase into evidence.
- product_name.value must be a concise 2-5 word English ASCII marketplace keyword phrase naming only the base product type shown in the selected supplier images. Never return Chinese in product_name.value. Exclude brand, material, color, size, pack count, quantity words such as multiple/multi, child-SKU option text, model number, and promotional language. Do not stack synonyms such as holder/storage/organizer; choose one clear product head noun. Variant attributes belong in separate fields, never in product_name.value.
- Allowed attribute fields: Material, Color, Technology, Structure, DetailFeatures, Fit, ProductCount, InstallationSteps.
- Use InstallationSteps only when an attached image explicitly shows an ordered or numbered installation/use method. Return verified actions in order, separated by " > "; do not infer missing steps.
- Material must name only explicitly visible material or composition. Do not guess a material from appearance.
- Technology, Structure, DetailFeatures, and Fit must be explicit in an image; do not convert generic category knowledge into facts.
- Dimensions must describe the product itself in its fully expanded/open state. Never use package, shipping, carton, box, bag, folded storage, rolled storage, or logistics dimensions.
- For tape, grip tape, overgrip, handle wrap, or similar roll products, map a three-part specification as Length x Width x Thickness unless the image explicitly labels it otherwise.
- Preserve every clearly printed product measurement and separate arrow value in a parameter/reference image; the common structured fields are not a maximum list. Use a concise visual part label when clear, otherwise keep the value as Visible Dimension 1, Visible Dimension 2, etc. rather than dropping it.
- For a wall hook, suction hook, wall hanger, or similar mounted product, preserve all separately shown diameters and depth/projection measurements. Chinese “总出墙/总出墙高度/出墙高度” is the overall installed Projection Depth measured outward from the wall. It is a product dimension, not packaging, and must be returned when visibly printed.
- Selling points must be product properties or benefits visibly supported by the image, not use scenes, promotions, generic praise, or invented performance.
- Organize selling points into exactly two coherent image groups, with at most two concise claims per group. Return the flat selling_points array in group order: items 1-2 are Group 1 and items 3-4 are Group 2.
- Group 1 explains the product's distinctive mechanism plus installation/use convenience. Group 2 explains verified performance plus compatibility, durability, environment resistance, or reuse.
- Merge closely related phrases instead of repeating synonyms. “Quick installation”, “easy installation”, and “no-drill installation” occupy one claim; “strong suction”, “stable hold”, and “does not fall” occupy one claim.
- For a suction wall hook with direct image evidence, prefer Group 1 = vacuum twist-lock suction + quick no-drill installation; Group 2 = strong waterproof load-bearing hold + removable multi-surface reuse. Omit any part that lacks direct image evidence.
- Use scenes must be explicit applications or suitable objects shown or written in an image. Do not invent generic lifestyle scenes.
- Every returned item must identify its supporting image as Image 1, Image 2, etc. in image_ref. If an item lacks direct image evidence, omit it.
- Prefer the most informative, product-specific facts. Return at most 7 attributes, 8 dimensions, 4 selling points, and 5 use scenes. Empty values and arrays are preferred to guessing.
""",
    }]
    image_content, image_fetch_errors = vision_content_for_images(image_urls)
    content.extend(image_content)
    request_payload = {
        "model": model,
        "input": [{"role": "user", "content": content}],
    }
    request = urllib.request.Request(
        ARK_RESPONSES_URL,
        data=json.dumps(request_payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=90) as response:
            response_payload = json.loads(response.read(2_000_000).decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = ""
        try:
            error_payload = json.loads(error.read(200_000).decode("utf-8", errors="replace"))
            detail = clean_text(error_payload.get("error", {}).get("message", ""), 240)
        except (json.JSONDecodeError, AttributeError):
            detail = ""
        return {"product_name": {}, "attributes": [], "dimensions": [], "selling_points": [], "use_scenes": [], "evidence_urls": [], "errors": [f"Doubao API HTTP {error.code}{': ' + detail if detail else ''}", *image_fetch_errors]}
    except (urllib.error.URLError, TimeoutError, socket.timeout, json.JSONDecodeError) as error:
        return {"product_name": {}, "attributes": [], "dimensions": [], "selling_points": [], "use_scenes": [], "evidence_urls": [], "errors": [f"Doubao API: {error}", *image_fetch_errors]}

    parsed = parse_json_object(response_output_text(response_payload))
    product_name: dict[str, str] = {}
    attributes: list[dict[str, str]] = []
    dimensions: list[str] = []
    selling_points: list[dict[str, str]] = []
    use_scenes: list[dict[str, str]] = []
    evidence_urls: list[str] = []
    seen: set[str] = set()
    allowed_fields = {"Material", "Color", "Technology", "Structure", "Detailfeatures", "Fit", "Productcount", "Installationsteps"}

    raw_name = parsed.get("product_name", {})
    if isinstance(raw_name, dict):
        value = clean_text(raw_name.get("value"), 120)
        evidence = clean_text(raw_name.get("evidence"), 160)
        image_url = evidence_image_url(raw_name.get("image_ref") or raw_name.get("image_url"), image_urls)
        if value and evidence and image_url and re.fullmatch(r"[\x00-\x7F]{4,120}", value):
            product_name = {"value": value, "evidence": evidence, "image_url": image_url}
            evidence_urls.append(image_url)

    raw_attributes = parsed.get("attributes", [])
    if isinstance(raw_attributes, list):
        for item in raw_attributes:
            if not isinstance(item, dict):
                continue
            field = clean_text(item.get("field"), 40).title().replace(" ", "")
            value = clean_text(item.get("value"), 160)
            evidence = clean_text(item.get("evidence"), 160)
            image_url = evidence_image_url(item.get("image_ref") or item.get("image_url"), image_urls)
            if field not in allowed_fields or len(value) < 2 or not evidence or not image_url:
                continue
            normalized_field = {"Detailfeatures": "DetailFeatures", "Productcount": "ProductCount", "Installationsteps": "InstallationSteps"}.get(field, field)
            key = f"attribute:{normalized_field}:{value}".casefold()
            if key in seen:
                continue
            seen.add(key)
            attributes.append({"field": normalized_field, "value": value, "evidence": evidence, "image_url": image_url})
            evidence_urls.append(image_url)
            if len(attributes) >= 7:
                break

    raw_dimensions = parsed.get("dimensions", [])
    if isinstance(raw_dimensions, list):
        for item in raw_dimensions:
            if not isinstance(item, dict):
                continue
            label = clean_text(item.get("label"), 40).title()
            value = clean_text(item.get("value"), 40)
            evidence = clean_text(item.get("evidence"), 160)
            image_url = evidence_image_url(item.get("image_ref") or item.get("image_url"), image_urls)
            expanded_values = expanded_dimension_values(label, value, evidence)
            if not evidence or not image_url or not expanded_values:
                continue
            for expanded_label, expanded_value in expanded_values:
                key = f"dimension:{expanded_label}:{expanded_value}".casefold()
                if key in seen:
                    continue
                seen.add(key)
                dimensions.append(f"{expanded_label}: {expanded_value}")
                evidence_urls.append(image_url)
                if len(dimensions) >= 8:
                    break
            if len(dimensions) >= 8:
                break

    raw_points = parsed.get("selling_points", [])
    if isinstance(raw_points, list):
        for item in raw_points:
            if not isinstance(item, dict):
                continue
            claim = clean_text(item.get("claim"), 120)
            evidence = clean_text(item.get("evidence"), 160)
            image_url = evidence_image_url(item.get("image_ref") or item.get("image_url"), image_urls)
            word_count = len(re.findall(r"[A-Za-z]+", claim))
            if not re.fullmatch(r"[\x00-\x7F]{6,120}", claim) or not 2 <= word_count <= 12:
                continue
            if not evidence or not image_url:
                continue
            key = f"selling-point:{claim}".casefold()
            if key in seen:
                continue
            seen.add(key)
            selling_points.append({"claim": claim, "evidence": evidence, "image_url": image_url})
            evidence_urls.append(image_url)
            if len(selling_points) >= 4:
                break

    raw_scenes = parsed.get("use_scenes", [])
    if isinstance(raw_scenes, list):
        for item in raw_scenes:
            if not isinstance(item, dict):
                continue
            scene = clean_text(item.get("scene"), 100)
            evidence = clean_text(item.get("evidence"), 160)
            image_url = evidence_image_url(item.get("image_ref") or item.get("image_url"), image_urls)
            word_count = len(re.findall(r"[A-Za-z]+", scene))
            if not re.fullmatch(r"[\x00-\x7F]{4,100}", scene) or not 2 <= word_count <= 10:
                continue
            if not evidence or not image_url:
                continue
            key = f"scene:{scene}".casefold()
            if key in seen:
                continue
            seen.add(key)
            use_scenes.append({"scene": scene, "evidence": evidence, "image_url": image_url})
            evidence_urls.append(image_url)
            if len(use_scenes) >= 5:
                break

    has_evidence = bool(product_name or attributes or dimensions or selling_points or use_scenes)
    errors = image_fetch_errors
    if not has_evidence:
        errors = [*errors, "No directly evidenced product information found in the supplied images"]
    return {
        "product_name": product_name,
        "attributes": attributes,
        "dimensions": dimensions,
        "selling_points": selling_points,
        "use_scenes": use_scenes,
        "evidence_urls": list(dict.fromkeys(evidence_urls)),
        "errors": errors,
    }


def fetch_ark_reference_image_mapping(
    skus: list[dict[str, str]],
    image_urls: list[str],
    api_key: str,
    model: str,
) -> dict[str, object]:
    sku_lines = "\n".join(
        f"- SKU {item['id']}: product={item.get('product_name', '')}; option={item.get('option', '')}; "
        f"color={item.get('color', '')}; pack={item.get('pack', '')}; structure={item.get('structure', '')}"
        for item in skus
    )
    content: list[dict[str, object]] = [{
        "type": "input_text",
        "text": f"""You are a strict SKU-to-reference-image classifier for ecommerce image generation.

Candidate SKUs:
{sku_lines}

First determine which supplier product family and visible variant matches each SKU: product type, visible color/spec, pack/count, material, and construction. Then assign useful task-specific image-generation references for that confirmed product family. Do not assign a useful-looking image before the product identity match is clear.

Return JSON only:
{{"assignments":[{{"image_ref":"Image 1","sku_ids":["SKU-ID"],"sku_match":"exact","image_type":"hero_product","reference_value":"high","best_for":["main_product","multi_angle"],"confidence":"high","reason":"clear product overview with exact construction"}}],"unmatched":[{{"image_ref":"Image 2","image_type":"document","reason":"certificate, report, paperwork, accessory, or product identity conflict"}}]}}

Hard rules:
- Product identity and SKU variant must match first. Never map an accessory, dispenser, holder, case, bundle, refill, or other product type to a different product type.
- Treat an explicitly supplied SKU color/spec/count as a hard product-truth constraint even when it is not part of the variation theme. Use sku_match "exact" only when the requested variant is visibly present. Use sku_match "same_product_alternate_color" for a different single-color version of the same construction.
- Prefer exact-color images. Across one SKU, keep no more than two same-product alternate-color images, and only when each contributes unique structure, detail, feature, option, parameter, or multi-angle evidence missing from exact-color images. Never classify an alternate-color-only image as hero or lifestyle, and never keep several images merely to show the color range.
- A designed all-color option chart may be high value when it visibly includes the requested color and clearly identifies the same product. Keep at most one such chart. It is not an alternate-color-only image.
- Product-information posters are high-value references when they explain distinct facts such as magnetic holding/load demonstration, dimensions/specifications, color options, material/construction, or exploded/assembly structure. Keep these information-rich panels ahead of repeated plain product photos, even when the panel also shows multiple colors.
- Never use color similarity to override a product-identity conflict. A dispenser, holder, accessory, bundle, or different bag construction is not the same product merely because its color matches.
- Order assignments by usefulness for image generation. Prefer high-value visual references in this mix: clean product overview/hero images, parameter or measurement images, material/detail close-ups, real use/lifestyle scenes, feature demonstration images, and useful multi-angle views.
- A caliper/ruler photo is measurement evidence, not a good image-generation reference. Mark it as image_type "measurement_tool" and reference_value "low" unless it is the only available proof of a required dimension. Prefer designed parameter charts, product-information posters, detail panels, comparison/option rows, and clear whole-product photos over caliper/ruler photos.
- Set best_for using any of these values when appropriate: main_product, human_use, multi_scene, multi_angle, product_explanation, selling_point, summary. A parameter/measurement image is best_for product_explanation and summary; a lifestyle/use image is best_for human_use and multi_scene; a clean whole-product image is best_for main_product and multi_angle; a feature demonstration or detail close-up is best_for selling_point and product_explanation.
- Give low value or unmatched to near-duplicate caliper/ruler measurement photos, near-duplicate plain color swatches, tiny/cropped fragments, shipping/package-only photos, factory/service photos, pure decorative banners, and images where the product is too small to guide generation.
- If multiple images show similar content, keep the clearest and most information-rich one first rather than returning many duplicates.
- Certificates, certification reports, laboratory reports, test-result documents, invoices, spec sheets, text-only charts, and screenshots of paperwork are evidence documents, not visual product references. Always put them in unmatched even when they mention the current product.
- When pack count, roll count, set composition, size, or model is visibly stated, it must not conflict with the SKU.
- A mixed-variant comparison image may map to multiple SKUs only if every mapped SKU is visibly represented and the product type is identical.
- A generic close-up may map to multiple SKUs only when no visible attribute conflicts with those SKUs.
- Supplier branding or Chinese text is irrelevant, but do not infer hidden variants from it.
- Use only high or medium confidence assignments. If uncertain, put the image in unmatched. False matches are worse than missing matches.
- Reference images are numbered in attachment order as Image 1, Image 2, etc.
""",
    }]
    image_content, image_fetch_errors = vision_content_for_images(image_urls, MAX_REFERENCE_MAP_IMAGE_URLS)
    content.extend(image_content)
    request_payload = {"model": model, "input": [{"role": "user", "content": content}]}
    request = urllib.request.Request(
        ARK_RESPONSES_URL,
        data=json.dumps(request_payload, ensure_ascii=False).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            response_payload = json.loads(response.read(2_000_000).decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = ""
        try:
            error_payload = json.loads(error.read(200_000).decode("utf-8", errors="replace"))
            detail = clean_text(error_payload.get("error", {}).get("message", ""), 240)
        except (json.JSONDecodeError, AttributeError):
            pass
        return {"mappings": {}, "unmatched": image_urls, "errors": [f"Doubao API HTTP {error.code}{': ' + detail if detail else ''}", *image_fetch_errors]}
    except (urllib.error.URLError, TimeoutError, socket.timeout, json.JSONDecodeError) as error:
        return {"mappings": {}, "unmatched": image_urls, "errors": [f"Doubao API: {error}", *image_fetch_errors]}

    parsed = parse_json_object(response_output_text(response_payload))
    known_skus = {item["id"] for item in skus}
    assignment_items_by_sku: dict[str, list[dict[str, str]]] = {sku_id: [] for sku_id in known_skus}
    assigned_urls: set[str] = set()
    assignments = parsed.get("assignments", [])
    if isinstance(assignments, list):
        for item in assignments:
            if not isinstance(item, dict) or clean_text(item.get("confidence"), 20).lower() not in {"high", "medium"}:
                continue
            if clean_text(item.get("reference_value"), 20).lower() in {"low", "none", "unusable"}:
                continue
            image_type = clean_text(item.get("image_type"), 40).lower().replace("-", "_").replace(" ", "_")
            if image_type in {"document", "certificate", "report", "paperwork", "invoice", "spec_sheet", "text_chart", "factory", "service", "banner", "package_only"}:
                continue
            image_url = evidence_image_url(item.get("image_ref"), image_urls)
            sku_ids = item.get("sku_ids", [])
            if not image_url or not isinstance(sku_ids, list):
                continue
            valid_skus = [clean_text(sku_id, 160) for sku_id in sku_ids if clean_text(sku_id, 160) in known_skus]
            if not valid_skus:
                continue
            best_for = item.get("best_for", [])
            if not isinstance(best_for, list):
                best_for = []
            normalized_item = {
                "url": image_url,
                "image_type": image_type,
                "reference_value": clean_text(item.get("reference_value"), 20).lower() or "medium",
                "confidence": clean_text(item.get("confidence"), 20).lower(),
                "sku_match": clean_text(item.get("sku_match"), 40).lower() or "matched",
                "best_for": [
                    clean_text(value, 40).lower().replace("-", "_").replace(" ", "_")
                    for value in best_for
                    if clean_text(value, 40)
                ],
                "reason": clean_text(item.get("reason"), 220),
            }
            for sku_id in valid_skus:
                assignment_items_by_sku[sku_id].append(normalized_item)
            assigned_urls.add(image_url)
    mappings = {
        sku_id: diversified_reference_urls(items, 20)
        for sku_id, items in assignment_items_by_sku.items()
    }
    reference_meta: dict[str, list[dict[str, str]]] = {}
    for sku_id, items in assignment_items_by_sku.items():
        allowed_urls = set(mappings.get(sku_id, []))
        seen_urls: set[str] = set()
        reference_meta[sku_id] = []
        for item in items:
            url = item.get("url", "")
            if url in allowed_urls and url not in seen_urls:
                reference_meta[sku_id].append(item)
                seen_urls.add(url)
    return {
        "mappings": mappings,
        "referenceMeta": reference_meta,
        "unmatched": [url for url in image_urls if url not in assigned_urls],
        "errors": image_fetch_errors,
        "provider": "doubao",
    }


class PromptToolHandler(SimpleHTTPRequestHandler):
    server_version = "PromptTool/1.0"

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self) -> None:
        parsed = urllib.parse.urlsplit(self.path)
        if parsed.path == "/api/image-task":
            values = urllib.parse.parse_qs(parsed.query)
            self._handle_image_task((values.get("id") or [""])[0])
            return
        if parsed.path == "/api/download-image":
            values = urllib.parse.parse_qs(parsed.query)
            self._handle_image_download((values.get("url") or [""])[0])
            return
        if parsed.path != "/api/source-proxy":
            super().do_GET()
            return
        values = urllib.parse.parse_qs(parsed.query)
        url = (values.get("url") or [""])[0]
        if not allowed_proxy_url(url):
            self.send_error(400, "Unsupported source URL")
            return
        request = urllib.request.Request(
            url,
            headers={"User-Agent": USER_AGENT, "Accept": "text/html,image/avif,image/webp,image/png,image/jpeg,*/*"},
        )
        try:
            with urllib.request.urlopen(request, timeout=20) as response:
                if not allowed_proxy_url(response.geturl()):
                    self.send_error(403, "Blocked redirect")
                    return
                body = response.read(MAX_PROXY_BYTES + 1)
                content_type = response.headers.get_content_type()
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, socket.timeout) as error:
            self.send_error(502, f"Source fetch failed: {error}")
            return
        if len(body) > MAX_PROXY_BYTES:
            self.send_error(413, "Source response too large")
            return
        if not (content_type.startswith("image/") or content_type in {"text/html", "text/plain", "application/javascript"}):
            self.send_error(415, "Unsupported source type")
            return
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _handle_image_download(self, url: str) -> None:
        if not allowed_public_image_url(url):
            self.send_error(400, "Unsupported image URL")
            return
        request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "image/avif,image/webp,image/png,image/jpeg,*/*"})
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                if not allowed_public_image_url(response.geturl()):
                    self.send_error(403, "Blocked redirect")
                    return
                body = response.read(MAX_PROXY_BYTES + 1)
                content_type = response.headers.get_content_type()
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, socket.timeout) as error:
            self.send_error(502, f"Image download failed: {error}")
            return
        if len(body) > MAX_PROXY_BYTES:
            self.send_error(413, "Image is too large")
            return
        if not content_type.startswith("image/"):
            self.send_error(415, "URL did not return an image")
            return
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self) -> None:
        request_path = urllib.parse.urlsplit(self.path).path
        if request_path not in {"/api/use-scenes", "/api/selling-points", "/api/product-dimensions", "/api/product-analysis", "/api/reference-image-map", "/api/generate-image"}:
            self.send_error(404, "Not Found")
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_REQUEST_BYTES:
            self.send_error(400, "Invalid request size")
            return
        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self.send_error(400, "Invalid JSON")
            return
        if not isinstance(payload, dict):
            self.send_error(400, "JSON body must be an object")
            return

        if request_path == "/api/generate-image":
            self._handle_image_generation(payload)
            return

        if request_path == "/api/selling-points":
            self._handle_selling_points(payload)
            return
        if request_path == "/api/product-dimensions":
            self._handle_product_dimensions(payload)
            return
        if request_path == "/api/product-analysis":
            self._handle_product_analysis(payload)
            return
        if request_path == "/api/reference-image-map":
            self._handle_reference_image_map(payload)
            return

        product_name = clean_text(payload.get("productName"))
        selected_spec = clean_text(payload.get("selectedSpec"))
        product_facts = (
            ("Product name", product_name),
            ("Selected specification", selected_spec),
            ("Material", clean_text(payload.get("material"))),
            ("Structure / craft", clean_text(payload.get("structure"))),
            ("Detail features", clean_text(payload.get("detailParameter"))),
            ("Selling point 1", clean_text(payload.get("feature1"))),
            ("Selling point 2", clean_text(payload.get("feature2"))),
            ("Selling point 3", clean_text(payload.get("feature3"))),
        )
        identity = "\n".join(f"{label}: {value}" for label, value in product_facts if value)
        local_evidence = re.sub(r"\s+", " ", str(payload.get("localEvidence") or "")).strip()[:12000]
        if len(identity) < 2:
            self._send_json({"query": "", "sources": [], "scenes": [], "message": "没有参考场景信息"})
            return

        search_identity = " ".join(part for part in (product_name, selected_spec) if part) or identity
        source_fingerprint = clean_text(payload.get("sourceFingerprint"), 200)
        cache_key = json.dumps({"identity": identity, "sourceFingerprint": source_fingerprint}, ensure_ascii=False).casefold()
        cached = SCENE_CACHE.get(cache_key)
        if cached and time.time() - cached[0] < SCENE_CACHE_TTL_SECONDS:
            self._send_json(cached[1])
            return
        ark_api_key = os.environ.get("ARK_API_KEY", "").strip()
        ark_model = os.environ.get("ARK_MODEL", DEFAULT_ARK_MODEL).strip() or DEFAULT_ARK_MODEL
        if ark_api_key:
            if not ark_api_key.startswith("ark-"):
                scenes, evidence_urls = [], []
                errors = ["ARK_API_KEY 格式错误：应只包含以 ark- 开头的密钥内容，不要包含 Bearer、变量名、引号或整段命令"]
                english_product_keyword, search_queries = "", []
            else:
                scenes, evidence_urls, errors, english_product_keyword, search_queries = fetch_ark_scenes(
                    identity, ark_api_key, ark_model
                )
            sources = ["Doubao Web Search"] if scenes else []
        else:
            scenes, evidence_urls = [], []
            errors = ["ARK_API_KEY unavailable or invalid"]
            english_product_keyword, search_queries = "", []
            sources = []
        result = {
            "query": search_queries[0] if search_queries else f"{search_identity} common uses applications environments",
            "english_product_keyword": english_product_keyword,
            "search_queries": search_queries,
            "sources": sources if scenes else [],
            "scenes": scenes,
            "message": "" if scenes else "没有参考场景信息",
            "errors": errors,
            "evidence_urls": evidence_urls,
            "provider": "doubao",
        }
        if scenes:
            SCENE_CACHE[cache_key] = (time.time(), result)
        self._send_json(result)

    def _handle_selling_points(self, payload: dict[str, object]) -> None:
        product_facts = (
            ("Product name", clean_text(payload.get("productName"))),
            ("Selected specification", clean_text(payload.get("selectedSpec"))),
            ("Material", clean_text(payload.get("material"))),
            ("Structure / craft", clean_text(payload.get("structure"))),
            ("Detail features", clean_text(payload.get("detailParameter"))),
        )
        identity = "\n".join(f"{label}: {value}" for label, value in product_facts if value)
        if len(identity) < 2:
            self._send_json({"selling_points": [], "message": "没有参考卖点信息"})
            return
        source_fingerprint = clean_text(payload.get("sourceFingerprint"), 200)
        cache_key = json.dumps({"identity": identity, "sourceFingerprint": source_fingerprint}, ensure_ascii=False).casefold()
        cached = SELLING_POINT_CACHE.get(cache_key)
        if cached and time.time() - cached[0] < SCENE_CACHE_TTL_SECONDS:
            self._send_json(cached[1])
            return
        api_key = os.environ.get("ARK_API_KEY", "").strip()
        model = os.environ.get("ARK_MODEL", DEFAULT_ARK_MODEL).strip() or DEFAULT_ARK_MODEL
        if not api_key.startswith("ark-"):
            result = {"selling_points": [], "sources": [], "message": "没有参考卖点信息", "errors": ["ARK_API_KEY unavailable or invalid"]}
            self._send_json(result)
            return
        points, evidence_urls, errors, english_keyword, search_queries = fetch_ark_selling_points(identity, api_key, model)
        result = {
            "english_product_keyword": english_keyword,
            "search_queries": search_queries,
            "sources": ["Doubao Web Search"] if points else [],
            "selling_points": points,
            "evidence_urls": evidence_urls,
            "message": "" if points else "没有参考卖点信息",
            "errors": errors,
            "provider": "doubao",
        }
        if points:
            SELLING_POINT_CACHE[cache_key] = (time.time(), result)
        self._send_json(result)

    def _handle_product_dimensions(self, payload: dict[str, object]) -> None:
        raw_urls = payload.get("imageUrls", [])
        image_urls = [clean_text(url, 500) for url in raw_urls] if isinstance(raw_urls, list) else []
        image_urls = [
            url for url in dict.fromkeys(image_urls)
            if allowed_proxy_url(url)
        ][:MAX_DIMENSION_IMAGE_URLS]
        product_facts = (
            ("Product name", clean_text(payload.get("productName"))),
            ("Selected specification", clean_text(payload.get("selectedSpec"))),
            ("Material", clean_text(payload.get("material"))),
            ("Structure / craft", clean_text(payload.get("structure"))),
            ("Detail features", clean_text(payload.get("detailParameter"))),
        )
        identity = "\n".join(f"{label}: {value}" for label, value in product_facts if value)
        if len(identity) < 2 or not image_urls:
            self._send_json({"dimensions": [], "message": "没有参考尺寸信息"})
            return
        cache_key = json.dumps({"identity": identity, "imageUrls": image_urls}, ensure_ascii=False).casefold()
        cached = PRODUCT_DIMENSION_CACHE.get(cache_key)
        if cached and time.time() - cached[0] < SCENE_CACHE_TTL_SECONDS:
            self._send_json(cached[1])
            return
        api_key = os.environ.get("ARK_API_KEY", "").strip()
        model = os.environ.get("ARK_MODEL", DEFAULT_ARK_MODEL).strip() or DEFAULT_ARK_MODEL
        if not api_key.startswith("ark-"):
            self._send_json({"dimensions": [], "sources": [], "message": "没有参考尺寸信息", "errors": ["ARK_API_KEY unavailable or invalid"]})
            return
        dimensions, evidence_urls, errors = fetch_ark_product_dimensions(identity, image_urls, api_key, model)
        result = {
            "dimensions": dimensions,
            "sources": ["Doubao Vision"] if dimensions else [],
            "evidence_urls": evidence_urls,
            "message": "" if dimensions else "没有参考尺寸信息",
            "errors": errors,
            "provider": "doubao",
        }
        if dimensions:
            PRODUCT_DIMENSION_CACHE[cache_key] = (time.time(), result)
        self._send_json(result)

    def _handle_product_analysis(self, payload: dict[str, object]) -> None:
        raw_urls = payload.get("imageUrls", [])
        image_urls = [clean_text(url, 500) for url in raw_urls] if isinstance(raw_urls, list) else []
        image_urls = [
            url for url in dict.fromkeys(image_urls)
            if allowed_proxy_url(url)
        ][:MAX_DIMENSION_IMAGE_URLS]
        product_facts = (
            ("Product name", clean_text(payload.get("productName"))),
            ("Selected specification", clean_text(payload.get("selectedSpec"))),
            ("Locally extracted material", clean_text(payload.get("material"))),
            ("Locally extracted structure / craft", clean_text(payload.get("structure"))),
            ("Locally extracted detail features", clean_text(payload.get("detailParameter"))),
        )
        identity = "\n".join(f"{label}: {value}" for label, value in product_facts if value)
        local_evidence = str(payload.get("localEvidence") or "").strip()[:12_000]
        if len(identity) < 2 and local_evidence:
            identity = "Supplier product shown in the attached 1688 images"
        if len(identity) < 2 or not image_urls:
            self._send_json({"product_name": {}, "attributes": [], "dimensions": [], "selling_points": [], "use_scenes": [], "sources": [], "message": "没有可识别的商品详情图信息"})
            return
        cache_key = json.dumps({"schemaVersion": "base-product-name-v2", "identity": identity, "localEvidence": local_evidence, "imageUrls": image_urls}, ensure_ascii=False).casefold()
        cached = PRODUCT_ANALYSIS_CACHE.get(cache_key)
        if cached and time.time() - cached[0] < SCENE_CACHE_TTL_SECONDS:
            self._send_json(cached[1])
            return
        api_key = os.environ.get("ARK_API_KEY", "").strip()
        model = os.environ.get("ARK_MODEL", DEFAULT_ARK_MODEL).strip() or DEFAULT_ARK_MODEL
        if not api_key.startswith("ark-"):
            self._send_json({
                "product_name": {},
                "attributes": [],
                "dimensions": [],
                "selling_points": [],
                "use_scenes": [],
                "sources": [],
                "message": "豆包识图未启用：请配置 ARK_API_KEY 后重新启动服务",
                "errors": ["ARK_API_KEY unavailable or invalid"],
            })
            return
        result = fetch_ark_product_analysis(identity, local_evidence, image_urls, api_key, model)
        has_evidence = bool(
            result.get("product_name")
            or result.get("attributes")
            or result.get("dimensions")
            or result.get("selling_points")
            or result.get("use_scenes")
        )
        result.update({
            "sources": ["Doubao Vision"] if has_evidence else [],
            "message": "" if has_evidence else "没有从当前商品图片中识别到可确认的补充信息",
            "provider": "doubao",
        })
        if has_evidence:
            PRODUCT_ANALYSIS_CACHE[cache_key] = (time.time(), result)
        self._send_json(result)

    def _handle_reference_image_map(self, payload: dict[str, object]) -> None:
        raw_skus = payload.get("skus", [])
        raw_urls = payload.get("imageUrls", [])
        if not isinstance(raw_skus, list) or not isinstance(raw_urls, list):
            self._send_json({"mappings": {}, "unmatched": [], "errors": ["Invalid SKU or image list"]}, 400)
            return
        skus: list[dict[str, str]] = []
        for item in raw_skus[:50]:
            if not isinstance(item, dict):
                continue
            sku_id = clean_text(item.get("id"), 160)
            if not sku_id:
                continue
            skus.append({
                "id": sku_id,
                "product_name": clean_text(item.get("productName"), 180),
                "option": clean_text(item.get("option"), 180),
                "color": clean_text(item.get("color"), 80),
                "pack": clean_text(item.get("pack"), 100),
                "structure": clean_text(item.get("structure"), 180),
            })
        image_urls = [clean_text(url, 500) for url in raw_urls]
        image_urls = [url for url in dict.fromkeys(image_urls) if allowed_proxy_url(url)][:MAX_REFERENCE_MAP_IMAGE_URLS]
        if not skus or not image_urls:
            self._send_json({"mappings": {}, "unmatched": image_urls, "errors": ["No SKU or reference image candidates"]})
            return
        api_key = os.environ.get("ARK_API_KEY", "").strip()
        model = os.environ.get("ARK_MODEL", DEFAULT_ARK_MODEL).strip() or DEFAULT_ARK_MODEL
        if not api_key.startswith("ark-"):
            self._send_json({"mappings": {}, "unmatched": image_urls, "errors": ["ARK_API_KEY unavailable or invalid"]}, 503)
            return
        cache_key = json.dumps({"schemaVersion": "reference-map-v4", "skus": skus, "imageUrls": image_urls, "model": model}, ensure_ascii=False).casefold()
        cached = REFERENCE_IMAGE_MAP_CACHE.get(cache_key)
        if cached and time.time() - cached[0] < SCENE_CACHE_TTL_SECONDS:
            self._send_json(cached[1])
            return
        result = fetch_ark_reference_image_mapping(skus, image_urls, api_key, model)
        if result.get("mappings"):
            REFERENCE_IMAGE_MAP_CACHE[cache_key] = (time.time(), result)
        self._send_json(result)

    def _grsai_request(self, path: str, body: dict[str, object] | None = None) -> tuple[dict[str, object] | None, int]:
        api_key = os.environ.get("GRSAI_API_KEY", "").strip()
        if not api_key.startswith("sk-"):
            return {"status": "failed", "error": "Grsai 生图未启用：请配置 GRSAI_API_KEY 后重新启动服务"}, 503
        data = json.dumps(body, ensure_ascii=False).encode("utf-8") if body is not None else None
        headers = {"Authorization": f"Bearer {api_key}", "Accept": "application/json"}
        if data is not None:
            headers["Content-Type"] = "application/json"
        request = urllib.request.Request(
            f"{grsai_base_url()}{path}",
            data=data,
            headers=headers,
            method="POST" if data is not None else "GET",
        )
        try:
            with urllib.request.urlopen(request, timeout=90) as response:
                raw = response.read(2 * 1024 * 1024).decode("utf-8", errors="replace")
            response_payload = json.loads(raw)
            if not isinstance(response_payload, dict):
                raise ValueError("response is not a JSON object")
            return response_payload, 200
        except urllib.error.HTTPError as error:
            raw = error.read(256_000).decode("utf-8", errors="replace")
            try:
                response_payload = json.loads(raw)
            except json.JSONDecodeError:
                response_payload = {"status": "failed", "error": clean_text(raw, 500) or str(error)}
            if not isinstance(response_payload, dict):
                response_payload = {"status": "failed", "error": str(error)}
            response_payload.setdefault("status", "failed")
            response_payload.setdefault("error", response_payload.get("message") or str(error))
            return response_payload, error.code if 400 <= error.code < 500 else 502
        except (urllib.error.URLError, TimeoutError, socket.timeout, ValueError, json.JSONDecodeError) as error:
            return {"status": "failed", "error": f"Grsai 请求失败：{error}"}, 502

    def _handle_image_generation(self, payload: dict[str, object]) -> None:
        model = clean_text(payload.get("model"), 80)
        prompt = str(payload.get("prompt") or "").strip()
        aspect_ratio = clean_text(payload.get("aspectRatio") or payload.get("size"), 40)
        if model not in GRSAI_MODELS:
            self._send_json({"status": "failed", "error": "不支持的生图模型"}, 400)
            return
        if not prompt or len(prompt) > MAX_IMAGE_PROMPT_CHARS:
            self._send_json({"status": "failed", "error": "提示词为空或过长"}, 400)
            return
        if aspect_ratio not in GRSAI_SQUARE_SIZES[model]:
            self._send_json({"status": "failed", "error": "当前模型不支持该图片尺寸"}, 400)
            return
        raw_images = payload.get("images", [])
        if not isinstance(raw_images, list) or len(raw_images) > MAX_IMAGE_REFERENCES:
            self._send_json({"status": "failed", "error": "参考图格式错误或数量过多"}, 400)
            return
        images = [url for url in (image_reference_url(item) for item in raw_images) if url]
        if len(images) != len(raw_images):
            self._send_json({"status": "failed", "error": "参考图必须是有效的 HTTP/HTTPS 链接或 JPG/PNG/WebP Base64 图片"}, 400)
            return
        request_body: dict[str, object] = {
            "model": model,
            "prompt": prompt,
            "aspectRatio": aspect_ratio,
            "replyType": "async",
        }
        if images:
            request_body["images"] = images
        result, status = self._grsai_request("/v1/api/generate", request_body)
        self._send_json(result or {"status": "failed", "error": "Grsai 未返回结果"}, status)

    def _handle_image_task(self, task_id: str) -> None:
        task_id = task_id.strip()
        if not GRSAI_TASK_ID_PATTERN.fullmatch(task_id):
            self._send_json({"status": "failed", "error": "无效的生图任务 ID"}, 400)
            return
        query = urllib.parse.urlencode({"id": task_id})
        result, status = self._grsai_request(f"/v1/api/result?{query}")
        self._send_json(result or {"status": "failed", "error": "Grsai 未返回结果"}, status)

    def _send_json(self, payload: dict[str, object], status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main() -> None:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    api_key = os.environ.get("ARK_API_KEY", "").strip()
    if (not api_key or not api_key.startswith("ark-")) and sys.stdin.isatty():
        if api_key:
            print("ARK_API_KEY 格式无效，请重新输入。", file=sys.stderr, flush=True)
        api_key = getpass.getpass("请输入火山方舟 API Key（输入不会显示，直接回车可仅使用本地分析）：").strip()
        if api_key:
            os.environ["ARK_API_KEY"] = api_key
    if api_key and not api_key.startswith("ark-"):
        print("ARK_API_KEY 格式无效，豆包路线将不可用；本地分析路线仍可使用。", file=sys.stderr, flush=True)
        os.environ.pop("ARK_API_KEY", None)
    elif not api_key:
        print("未配置 ARK_API_KEY：本地分析可用，豆包识图和联网补充暂不可用。", flush=True)
    else:
        active_model = os.environ.get("ARK_MODEL", DEFAULT_ARK_MODEL).strip() or DEFAULT_ARK_MODEL
        print(f"豆包配置：Coding Plan / {active_model}", flush=True)
        print(f"豆包接口：{ARK_RESPONSES_URL}", flush=True)
    grsai_key = os.environ.get("GRSAI_API_KEY", "").strip()
    if (not grsai_key or not grsai_key.startswith("sk-")) and sys.stdin.isatty():
        if grsai_key:
            print("GRSAI_API_KEY 格式无效，请重新输入。", file=sys.stderr, flush=True)
        grsai_key = getpass.getpass("请输入 Grsai API Key（输入不会显示，直接回车可暂不启用生图）：").strip()
        if grsai_key:
            os.environ["GRSAI_API_KEY"] = grsai_key
    if grsai_key and not grsai_key.startswith("sk-"):
        print("GRSAI_API_KEY 格式无效，生图功能将不可用。", file=sys.stderr, flush=True)
        os.environ.pop("GRSAI_API_KEY", None)
    elif not grsai_key:
        print("未配置 GRSAI_API_KEY：提示词生成可用，生图功能暂不可用。", flush=True)
    handler = partial(PromptToolHandler, directory=str(ROOT))
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    print(f"Prompt Tool running at http://127.0.0.1:{port}/index.html", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
