# 通用参数规格生图提示词模版

用于生成参数规格类电商图。  
核心原则：文字要保留，但不要堆文字；用短文字 + 小图标 / 小插图 / 箭头一起表达信息重点。

图组顺序：

1. 单款参数 + 场景主图
2. 生活场景图
3A. 多场景使用图
3B. 产品使用方法图
4. 尺寸 / 容量参数图
5. 多规格可选图
6. 功能 / 卖点图
7. 细节放大图
8. 总卖点图

---

## 1. 填充字段

```text
【产品名称】=
【当前SKU/主规格】=
【规格列表】=
【包装数量】=
【容量/适用杯量】=
【材质】=
【颜色】=
【结构/工艺】=
【尺寸1】=
【尺寸2】=
【尺寸3】=
【重量/容量】=
【适配对象】=
【使用场景】=
【卖点1】=
【卖点2】=
```

---

## 2. 全局规则

```text
Rules: 1:1 Amazon image. Match the reference product shape, material, color, and proportions. Combine concise readable text with small icons, simple illustrations, and arrows to communicate key information; avoid long paragraphs and repeated information. No invented specs, brands, logos, watermarks, or extra accessories.
Negative: No invented specs, wrong shape, wrong material, extra accessories, logos, watermark, unreadable text, cluttered layout, blurry product, or exaggerated effects.
```

---

## 3. 图片模块

### 1. 单款参数 + 场景主图

```text
Image 1 Hero: premium clean product hero for 【产品名称】. One large product centered/slightly low, 65%-80% of image, bright white/light gray or simple 【使用场景】 background. Text: none, or one tiny 【当前SKU/主规格】 label only.
```

### 2. 生活场景图

```text
Image 2 Lifestyle: realistic use photo in 【使用场景】. Show the product clearly in use with 【适配对象】; natural scale, soft real lighting. Text: none, or one tiny spec label only.
```

### 3A. 多场景使用图

```text
Image 3A Multi-scene: 3-4 equal panels showing different real use scenes. Each panel uses a short readable label plus a small symbol/icon; no dimensions or long captions.
```

### 3B. 产品使用方法图

```text
Image 3B How-to: 2x2 step grid with four realistic action panels. Use number badges 1-4, small step icons, and one short readable caption per step.
```

### 4. 尺寸 / 容量参数图

```text
Image 4 Size/Capacity: size/capacity reference infographic. Top layout must keep the fixed parameter style: large title “Size Reference”, short subtitle with 【当前SKU/主规格】, and a dark rounded spec capsule showing packaging quantity only: 【包装数量】. Do not put packaging quantity in the title or subtitle. Do not include product name or spec name inside the capsule. Large product is the focus in the main area. Show capacity as a clear main text callout paired with a small cup/container icon: 【容量/适用杯量】. Use clean arrows/dashed guides only for verified dimensions: 【尺寸1】 / 【尺寸2】 / 【尺寸3】 / 【重量/容量】. Use clean arrows and simple mini illustrations where helpful.

Optional bottom icons: use up to 3 small auxiliary symbols/mini illustrations for 【材质】 / 【结构/工艺】 / 【卖点1】 / 【卖点2】. Do not repeat capacity, SKU/spec name, or packaging quantity in the bottom strip.
```

### 5. 多规格可选图

```text
Image 5 Options: visual comparison. 3-5 horizontal product columns with consistent angle and scale. Each column: product image, short option label, and a small supporting icon if helpful. Only show verified options: 【规格列表】.
```

### 6. 功能 / 卖点图

```text
Image 6 Feature: one visual selling point for 【卖点1】. Product large; use one short headline plus 2-3 short icon-supported labels: 【卖点2】 / 【材质】 / 【结构/工艺】.
```

### 7. 细节放大图

```text
Image 7 Detail: macro close-up of material/structure detail: 【材质】 / 【结构/工艺】. Use 2-3 short labels paired with small line icons.
```

### 8. 总卖点图

```text
Image 8 Summary: key-points summary poster, similar to a premium Amazon final selling-points image. Top: large bold product/spec title 【当前SKU/主规格】, but do not put packaging quantity in the title. If packaging quantity exists, show it once as a gold pill badge near the title: 【包装数量】. Show capacity once as a clear small callout near the title or product hero, paired with a cup/container icon: 【容量/适用杯量】. Center: large realistic product stack/main product as the hero. Left side: 2-3 circular detail insets with short labels for 【材质】 / 【结构/工艺】 / 【卖点1】. Right side: one circular use-scene inset showing 【适配对象】 or 【使用场景】. Bottom: dark/brown horizontal icon bar with 2-4 short icon-supported key points using only remaining non-repeated verified selling points. Do not repeat any left-side detail inset information in the bottom bar. Do not repeat packaging quantity, capacity, or the main spec in the bottom bar. If there are not enough unique verified points, use fewer bottom icons instead of repeating information.
```

---

## 4. 使用方式

每张图生成时只组合：

```text
对应图片模块
Rules
Negative
Reference: Use clean Amazon listing composition, or use competitor reference only for composition rhythm. Do not copy claims, text, brand, or unverified parameters.
```
