const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const source = fs.readFileSync(`${__dirname}/app.js`, "utf8");
const code = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
const ids = ["71gr+pnQwaL", "71ViqHSs4bL", "61VH+iCYAVL", "614qWPHiDCL", "71TZLxZy3FL"];
const imageUrl = (id, size = "") => `https://m.media-amazon.com/images/I/${id}${size}.jpg`;
const node = (attrs, video = false) => ({
  getAttribute: (key) => attrs[key] || null,
  closest: () => video ? {} : null,
});
function parser(roots = {}) {
  return class DOMParser {
    parseFromString() {
      return {
        querySelector: (selector) => roots[selector] || null,
        querySelectorAll: () => { throw new Error("whole-page image queries are forbidden"); },
      };
    }
  };
}
const context = vm.createContext({ DOMParser: parser(), MAX_COMPETITOR_REFERENCE_IMAGES: 5 });
vm.runInContext([
  code("function normalizeImageUrl(", "function imageInfoKeywordScore("),
  code("function extractSrcsetUrls(", "function nearbyImageContext("),
  code("function normalizeAmazonProductImageUrl(", "function competitorVisionSupplement("),
].join("\n"), context);

const expected = ids.map((id) => imageUrl(id));
const gallery = ids.map((id) => node({ src: imageUrl(id, "._AC_US40_") }));
gallery.push(node({ src: imageUrl(ids[0], "._AC_SX679_") })); // another size of the same image
gallery.push(node({ src: imageUrl("VideoPoster123") }, true));
context.DOMParser = parser({ "#altImages": { querySelectorAll: () => gallery } });
const unrelated = Array.from({ length: 30 }, (_, index) => imageUrl(`Recommended${index}`));
const html = unrelated.map((url) => `<img src="${url}">`).join("");
assert.deepEqual(Array.from(context.extractAmazonCompetitorImageCandidates(html, 200), (item) => item.url), expected,
  "only the five current-product gallery images survive; page images and video posters do not enter analysis");

context.DOMParser = parser();
const items = ids.map((id) => ({ hiRes: null, large: imageUrl(id, "._AC_"), thumb: imageUrl(id, "._AC_US40_"), main: { [imageUrl(id, "._AC_SX679_")]: [679, 679] } }));
const literal = JSON.stringify(items).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
const savedPageScript = `<script>var data = {'colorImages': {'initial': A.$.parseJSON('${literal}')}};</script>${html}`;
assert.deepEqual(Array.from(context.extractAmazonCompetitorImageCandidates(savedPageScript, 200), (item) => item.url), expected,
  "Amazon's saved-page parseJSON gallery works without executing its script");
const sevenItems = Array.from({ length: 7 }, (_, index) => ({ hiRes: imageUrl(`GalleryImage${index}`) }));
const directJson = JSON.stringify({ colorImages: { initial: sevenItems, otherVariant: [{ hiRes: imageUrl("WrongVariant") }] } });
assert.equal(context.extractAmazonCompetitorImageCandidates(directJson, 200).length, 7, "genuine galleries are not hard-coded to five images");
assert.equal(context.extractAmazonCompetitorImageCandidates(directJson).length, 5, "the separate candidate-reference limit remains supported");
assert.equal(context.extractAmazonCompetitorImageCandidates(html, 200).length, 0, "an unidentified gallery never falls back to all page images");
assert.equal(context.extractAmazonCompetitorImageCandidates('<script>{"colorImages":{"initial":[broken]}}</script>' + html, 200).length, 0);

// An optional real saved page exercises its original embedded gallery data;
// no user page contents are copied into the repository or executed.
if (process.argv[2]) {
  const realPage = fs.readFileSync(process.argv[2], "utf8");
  const actual = context.extractAmazonCompetitorImageCandidates(realPage, 200);
  assert.deepEqual(Array.from(actual, (item) => item.url), expected);
  console.log(`Saved calendar HTML: ${actual.length} current-product gallery images.`);
}
console.log("Competitor gallery scope and image-size deduplication passed.");
