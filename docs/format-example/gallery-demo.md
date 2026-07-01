# 相册组件测试

!!! info ""
    
    author: Haohahahaha (Haorui Zhang) && (ChatGPT + DeepSeek-V4-Pro)
    
    mail: 1259203802@qq.com

    date: 2026-07-01

这个页面演示 **Photo Gallery** 组件的基本用法。

## 基础用法

在任意 `!!!` admonition 中放入 `<div class="photo-gallery">`，里面写 `<img>` 即可：

!!! example "示例相册"

    <div class="photo-gallery"
         data-effect="cards"
         data-autoplay="1000">

      <img src="https://picsum.photos/800/600?random=1"
           alt="示例图片 1 - 山脉">

      <img src="https://picsum.photos/800/600?random=2"
           alt="示例图片 2 - 湖泊">

      <img src="https://picsum.photos/800/600?random=3"
           alt="示例图片 3 - 森林">

      <img src="https://picsum.photos/800/600?random=4"
           alt="示例图片 4 - 海滩">

      <img src="https://picsum.photos/800/600?random=5"
           alt="示例图片 5 - 城市夜景">

    </div>

## 实际使用

将图片放到 `docs/[分类]/pics/[文章名]/` 目录下，然后这样写：

```md
!!! note "日本旅行"

    <div class="photo-gallery">

      <img src="/6-scenery/pics/japan/01.jpg"
           alt="东京塔">

      <img src="/6-scenery/pics/japan/02.jpg"
           alt="浅草寺">

      <img src="/6-scenery/pics/japan/03.jpg"
           alt="晴空塔">

      <img src="/6-scenery/pics/japan/04.jpg"
           alt="涉谷十字路口">

    </div>
```


## 可选配置

通过 `data-*` 属性自定义行为：
```
!!! tip "自定义效果"

    <div class="photo-gallery"
         data-effect="cards"
         data-autoplay="1000">

      <img src="https://picsum.photos/800/600?random=6"
           alt="卡片效果展示">

      <img src="https://picsum.photos/800/600?random=7"
           alt="支持鼠标拖拽">

      <img src="https://picsum.photos/800/600?random=8"
           alt="点击进入全屏">

    </div>
```
| 属性 | 说明 | 默认值 |
|------|------|--------|
| `data-effect` | Swiper 切换效果 (`cards` / `coverflow` / `slide`) | `cards` |
| `data-autoplay` | 自动播放间隔 (毫秒)，`false` 禁用 | 禁用 |
| `data-height` | 固定高度 (px) | 自适应 |

## 交互说明

- 🖱️ **拖拽/滑动** 切换图片
- 🃏 **Cards 效果** 层叠展示
- 🖱️ **点击图片** 进入全屏浏览
- ⌨️ **左右方向键** 切换
- 🔍 **滚轮缩放** 全屏模式下
- 📊 底部显示当前图片标题和计数
- 🎬 **支持视频**（见下方视频用法）

### 视频用法

图片和视频可以混用。用 `<video>` 标签代替 `<img>` 即可：

```html
<div class="photo-gallery">

  <img src="/pics/photo1.jpg" alt="照片">

  <video src="/pics/video.mp4" poster="/pics/video-poster.jpg" preload="metadata"></video>

  <img src="/pics/photo2.jpg" alt="另一张照片">

</div>
```

点击视频卡片进入全屏后自动播放，支持进度条和音量控制。

!!! tip "视频推荐加 `poster` 缩略图"

    如果没加 `poster`，浏览器必须等视频数据下载到一定程度才能显示首帧画面。手机上网络不好时，轮播中的视频卡片可能会一直空白。
    
    **建议用 ffmpeg 或 opencv 从视频中提取一帧作为缩略图：**
    
    ```bash
    # 方式一：ffmpeg（推荐）
    ffmpeg -i video.mp4 -ss 00:00:01 -vframes 1 video-poster.jpg
    
    # 方式二：Python opencv
    python -c "
    import cv2
    vid = cv2.VideoCapture('video.mp4')
    vid.set(cv2.CAP_PROP_POS_MSEC, 1000)
    ok, frame = vid.read()
    if ok:
        cv2.imwrite('video-poster.jpg', frame)
    vid.release()
    "
    ```
    
    然后在 `<video>` 标签中引用：
    
    ```html
    <video src="/pics/video.mp4" poster="/pics/video-poster.jpg" preload="metadata"></video>
    ```
    
    `gallery.js` 会自动将 `poster` 属性传递到 Swiper 轮播中的视频元素。

!!! warning "部署须知：视频需要额外一步"

    如果你用视频功能，需要在第一步复制第三方库时加上视频插件：

    ```bash
    # LightGallery 视频插件
    cp node_modules/lightgallery/plugins/video/lg-video.min.js \
       docs/assets/vendor/lightgallery/
    ```

    并在 `mkdocs.yml` 的 `extra_javascript` 中添加一行：

    ```yaml
    extra_javascript:
      - assets/vendor/lightgallery/lg-video.min.js  # ← 加这行
      - assets/js/gallery.js
    ```

---

## 部署教程：把 Photo Gallery 装到任意 MkDocs 仓库

本组件适用于 **MkDocs + Material 主题**，零 Python 依赖，纯前端静态资源。

### 第一步：准备第三方库

在你的 MkDocs 仓库根目录执行：

```bash
npm init -y
npm install swiper lightgallery
```

然后把需要的文件复制到 `docs/assets/` 下：

```bash
mkdir -p docs/assets/{css,js,vendor/{swiper,lightgallery,fonts}}

# Swiper
cp node_modules/swiper/swiper-bundle.min.css docs/assets/vendor/swiper/
cp node_modules/swiper/swiper-bundle.min.js  docs/assets/vendor/swiper/

# LightGallery 核心
cp node_modules/lightgallery/lightgallery.min.js    docs/assets/vendor/lightgallery/
cp node_modules/lightgallery/css/lightgallery-bundle.min.css  docs/assets/vendor/lightgallery/

# LightGallery 插件（按需）
cp node_modules/lightgallery/plugins/zoom/lg-zoom.min.js            docs/assets/vendor/lightgallery/
cp node_modules/lightgallery/plugins/thumbnail/lg-thumbnail.min.js  docs/assets/vendor/lightgallery/
cp node_modules/lightgallery/plugins/fullscreen/lg-fullscreen.min.js docs/assets/vendor/lightgallery/
cp node_modules/lightgallery/plugins/autoplay/lg-autoplay.min.js    docs/assets/vendor/lightgallery/
cp node_modules/lightgallery/plugins/pager/lg-pager.min.js          docs/assets/vendor/lightgallery/
cp node_modules/lightgallery/plugins/video/lg-video.min.js          docs/assets/vendor/lightgallery/

# LightGallery 图标字体（必须，否则全屏按钮空白）
cp node_modules/lightgallery/fonts/lg.{woff2,woff,ttf} docs/assets/vendor/fonts/

# 防止 node_modules 被提交
echo "node_modules/" >> .gitignore
```

### 第二步：获取 gallery.css 和 gallery.js

将本仓库中的两个核心文件复制到你的仓库 `docs/assets/` 下：

| 源文件 | 目标路径 |
|--------|----------|
| `docs/assets/css/gallery.css` | `docs/assets/css/gallery.css` |
| `docs/assets/js/gallery.js` | `docs/assets/js/gallery.js` |

可以从 [GitHub 直接下载](https://github.com/Haohahahaha/chat/tree/master/docs/assets)。

最终目录结构：

```
你的仓库/
├── mkdocs.yml
└── docs/
    └── assets/
        ├── css/
        │   └── gallery.css          ← 核心样式
        ├── js/
        │   └── gallery.js           ← 核心逻辑
        └── vendor/
            ├── swiper/
            │   ├── swiper-bundle.min.css
            │   └── swiper-bundle.min.js
            ├── lightgallery/
            │   ├── lightgallery.min.js
            │   ├── lightgallery-bundle.min.css
            │   ├── lg-zoom.min.js
            │   ├── lg-thumbnail.min.js
            │   ├── lg-fullscreen.min.js
            │   ├── lg-autoplay.min.js
            │   └── lg-pager.min.js
            └── fonts/
                ├── lg.woff2
                ├── lg.woff
                └── lg.ttf
```

### 第三步：配置 mkdocs.yml

在 `mkdocs.yml` 中添加（注意是**顶层**配置，不要缩进到 `theme:` 下）：

```yaml
extra_css:
  - assets/vendor/swiper/swiper-bundle.min.css
  - assets/vendor/lightgallery/lightgallery-bundle.min.css
  - assets/css/gallery.css

extra_javascript:
  - assets/vendor/swiper/swiper-bundle.min.js
  - assets/vendor/lightgallery/lightgallery.min.js
  - assets/vendor/lightgallery/lg-zoom.min.js
  - assets/vendor/lightgallery/lg-thumbnail.min.js
  - assets/vendor/lightgallery/lg-fullscreen.min.js
  - assets/vendor/lightgallery/lg-autoplay.min.js
  - assets/vendor/lightgallery/lg-pager.min.js
  - assets/vendor/lightgallery/lg-video.min.js
  - assets/js/gallery.js
```

### 第四步：在 Markdown 中使用

在任意 `.md` 页面中写：

```markdown
!!! note "相册标题"

    <div class="photo-gallery">

      <img src="/path/to/1.jpg" alt="图片描述">
      <img src="/path/to/2.jpg" alt="图片描述">
      <img src="/path/to/3.jpg" alt="图片描述">

    </div>
```

图片路径是相对于站点根目录的 URL，例如放在 `docs/photos/trip/01.jpg` 的图片就写 `/photos/trip/01.jpg`。

### 可选配置项

| 属性 | 说明 | 默认值 | 示例 |
|------|------|--------|------|
| `data-effect` | 滑动效果 | `cards` | `data-effect="coverflow"` |
| `data-autoplay` | 自动播放间隔(ms)，不设则不启动 | 禁用 | `data-autoplay="3000"` |
| `data-height` | 固定卡片高度(px) | 357 | `data-height="500"` |

### 常见问题

**Q：全屏按钮看不见？**
A：检查 `docs/assets/vendor/fonts/` 下是否有 `lg.woff2`、`lg.woff`、`lg.ttf` 三个字体文件。缺少字体是按钮空白的唯一原因。

**Q：GitHub Actions 部署后没效果？**
A：确认 `extra_css` / `extra_javascript` 在 `mkdocs.yml` 顶层（与 `nav`、`plugins` 同级），而不是嵌套在 `theme:` 下。

**Q：图片不堆叠？**
A：检查 Swiper CSS 是否加载成功（F12 → Network → 搜索 `swiper-bundle`）。

**Q：想升级第三方库版本？**
A：`npm update swiper lightgallery` 然后重新复制文件到 `vendor/` 目录。

### 用 AI Agent 自动部署

如果你用 VS Code / Cursor / Copilot 等 AI Agent，直接把下面这段话发给它：

> 请帮我在这个 MkDocs 仓库中集成 Photo Gallery 相册组件：
> 1. npm install swiper lightgallery
> 
> 2. 从 https://github.com/Haohahahaha/chat 仓库的 docs/assets/ 目录下复制全部文件到本仓库同名路径
> 
> 3. 在 mkdocs.yml 顶层添加 extra_css 和 extra_javascript（共 3 个 CSS + 8 个 JS）
> 
> 4. 按 https://chat.haohaha.cn/format-example/gallery-demo/ 页面底部的部署教程操作

核心文件从本仓库直链下载：

```bash
# 在仓库根目录执行
mkdir -p docs/assets/{css,js}

# gallery.css
wget -O docs/assets/css/gallery.css \
  https://raw.githubusercontent.com/Haohahahaha/chat/master/docs/assets/css/gallery.css

# gallery.js
wget -O docs/assets/js/gallery.js \
  https://raw.githubusercontent.com/Haohahahaha/chat/master/docs/assets/js/gallery.js
```

