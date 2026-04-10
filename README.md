# Kisei's Playlist

一个纯静态的歌单展示页，适合直接托管到 GitHub Pages 或 Cloudflare Pages。

## 目录

- `index.html`: 部署入口，页面样式和前端逻辑都在这里。
- `data/site-content.json`: 页面简介、统计区和歌曲列表的数据源。
- `.nojekyll`: 让 GitHub Pages 直接发布静态文件。
- `functions/api/live-cover.js`: 返回直播间封面元数据。
- `functions/api/live-cover-image.js`: 代理直播封面图片，避免浏览器直接请求 B 站图片时被 referer 限制拦截。
- `merged_correct_version_fixed.html`: 原始设计稿快照，当前保留作参考。

## 本地预览

这个页面会通过 `fetch` 读取 `json`，所以不要直接双击打开 `html` 文件。

如果你只是想看静态页面，可以使用任意静态服务器，例如：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

如果你用的是 VS Code，也可以直接用 Live Server 一类的本地静态服务。

注意：仓库里现在包含了 Cloudflare Pages Function `functions/api/live-cover.js`。如果你只是用 `python -m http.server`，这个函数不会执行，所以 live 图片接口在本地静态服务里会显示为不可用。

如果要连同 Function 一起本地测试，先安装依赖：

```bash
npm install
```

然后运行：

```bash
npm run dev
```

`wrangler pages dev` 会读取 [wrangler.jsonc](d:/Desktop/gitLib/Kisei-s-Playlist/wrangler.jsonc)，同时提供静态资源和 `functions/` 里的接口。

## 部署

### GitHub Pages

- 直接把仓库推到 GitHub。
- 选择仓库根目录作为发布源即可。
- 不需要构建命令。

### Cloudflare Pages

- 连接这个仓库。
- Build command 留空。
- Output directory 设为项目根目录，也就是 `index.html` 所在的位置。
- Pages Functions 会自动读取 `functions/` 目录里的接口代码。
- 如果用 Wrangler 直接上传，可以先 `npm install`，再执行 `npm run deploy`。

## 更新内容

后续维护时，优先编辑 `data/site-content.json`：

- 修改 `site` 下的字段可以更新页面简介文案、搜索提示、统计标题等内容。
- 修改 `site.liveEntry.roomId` 可以更新右侧 live 图片卡片对应的 B 站直播间房间号，页面会通过 `/api/live-cover` 获取封面。
- 修改 `songs` 数组可以增删歌曲。
- 语言筛选按钮和统计数字会根据 JSON 自动更新。
