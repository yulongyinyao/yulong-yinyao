# 字体子集

站点使用两款字体：

- `AaGuDian`：标题、导航、按钮等展示文字，源文件 `tools/fonts/AaGuDianKeBenSongYouMoBan.zip`
- `ShanHaiJi`：正文、摘要、说说、项目说明，源文件 `tools/fonts/ShanHaiJiGuSongKe-JianFan.zip`

完整字库体积过大，GitHub Pages 在国内加载很慢，所以只保留站点实际用到的字符，并输出为 WOFF2。

## 什么时候重新生成

新增文章、说说、项目，或修改站点文案后，如果出现了子集里没有的汉字，浏览器会回退到系统宋体。执行一次：

```bash
pnpm fonts:subset
```

脚本会：

1. 扫描 `src/**`、`config/**` 和后台页面里的全部文字；
2. 加上 ASCII 和常用中文标点；
3. 从 `tools/fonts/` 的 zip 中取出 TTF；
4. 生成 `src/assets/fonts/*.woff2`。

然后正常构建、提交、部署即可。

## 换字体源

默认读取 `tools/fonts/`。也可以指定其他目录：

```bash
FONT_SOURCE_DIR="E:/美化用素材" pnpm fonts:subset
```

目录内需要保留这两个 zip 的原始文件名。

## 取舍

- 当前子集只覆盖现有内容；新内容里的生僻字在重新生成前会回退系统宋体。
- 想覆盖所有汉字，可以改脚本，把字符集换成完整字库；代价是首屏字体体积会大很多。
- 生成后的字体在 `src/assets/fonts/`，构建时会自动带上站点 base 路径。
