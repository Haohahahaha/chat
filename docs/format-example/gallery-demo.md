# 相册组件测试

这个页面演示 **Photo Gallery** 组件的基本用法。

## 基础用法

在任意 `!!!` admonition 中放入 `<div class="photo-gallery">`，里面写 `<img>` 即可：

!!! example "示例相册"

    <div class="photo-gallery">

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
