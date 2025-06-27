# 🎵🎬 音视频转换器

一个基于 Electron + React + Ant Design 的现代化桌面音视频转换应用。

## ✨ 特性

- 🎵 **音频转换**: 支持 MP3, WAV, FLAC, AAC, OGG, M4A, WMA, ALAC, OPUS, AMR 等格式
- 🎬 **视频转换**: 支持 MP4, AVI, MKV, MOV, WMV, FLV, WebM, M4V, 3GP, TS 等格式
- 🎨 **现代化界面**: 基于 React + Ant Design 的美观用户界面
- ⚡ **高性能**: 使用 FFmpeg 进行快速转换
- 📦 **开箱即用**: 内置 FFmpeg 二进制文件，无需额外安装
- 🖥️ **跨平台**: 支持 Windows 和 macOS
- 📱 **响应式设计**: 适配不同屏幕尺寸

## 🚀 快速开始

### 开发环境

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 生产构建

```bash
# 构建应用
pnpm build

# 打包为安装程序
pnpm dist
```

## 📁 项目结构

```
audio-transfrom/
├── src/
│   └── renderer/           # React 前端代码
│       ├── components/     # React 组件
│       │   ├── AudioConverter.jsx
│       │   ├── VideoConverter.jsx
│       │   └── Converter.css
│       ├── App.jsx         # 主应用组件
│       ├── App.css         # 应用样式
│       ├── main.jsx        # React 入口
│       ├── index.html      # HTML 模板
│       └── index.css       # 全局样式
├── main.js                 # Electron 主进程
├── preload.js              # 预加载脚本
├── vite.config.js          # Vite 配置
├── package.json            # 项目配置
└── scripts/
    └── download-ffmpeg.js  # FFmpeg 下载脚本
```

## 🛠️ 技术栈

- **前端**: React 18 + Ant Design 5 + Vite
- **桌面**: Electron 28
- **转换**: FFmpeg (fluent-ffmpeg)
- **构建**: electron-builder
- **包管理**: pnpm

## 🎯 功能说明

### 音频转换
- 支持多种音频格式转换
- 自动保存到源文件目录或自定义位置
- 实时转换进度显示

### 视频转换
- 支持多种视频格式转换
- 可配置视频和音频编码器
- 灵活的帧率设置选项
- 实时转换进度显示

## 📦 打包说明

应用会自动下载并打包 FFmpeg 二进制文件，支持：
- **Windows**: NSIS 安装程序 (.exe)
- **macOS**: DMG 镜像文件 (.dmg)

## 🔧 开发说明

### 开发模式
开发模式下会同时启动：
1. Vite 开发服务器 (http://localhost:3000)
2. Electron 应用

### 生产模式
生产模式下会：
1. 构建 React 应用到 `dist-renderer/`
2. 打包 Electron 应用

## 📝 许可证

MIT License

## ✨ 主要功能

### 🎵 音频转换
- **支持格式**：MP3, WAV, FLAC, AAC, OGG, M4A, WMA, ALAC, OPUS, AMR
- **高质量转换**：使用 FFmpeg 引擎，保证转换质量

### 🎬 视频转换
- **支持格式**：MP4, AVI, MKV, MOV, WMV, FLV, WebM, M4V, 3GP, TS
- **编码器选择**：支持 H.264, H.265, VP8, VP9 等视频编码器
- **音频编码**：支持 AAC, MP3, Vorbis, Opus 等音频编码器
- **帧率控制**：
  - 保持原视频帧率（默认）
  - 自定义帧率：24, 25, 30, 50, 60, 120 FPS

### 🔧 高级功能
- **实时进度显示**：转换过程中显示百分比、时间、FPS、处理速度等
- **灵活存储选项**：
  - 自动保存到源文件目录
  - 自定义保存位置
- **现代化界面**：美观的标签页设计，支持音频和视频转换
- **错误处理**：完善的错误提示和状态反馈
- **开箱即用**：内置 FFmpeg，无需单独安装

## 🚀 安装和运行

### 开发环境

```bash
# 安装依赖（会自动下载 FFmpeg）
npm install
# 或者使用 pnpm
pnpm install

# 启动应用
npm start
# 或者使用 pnpm
pnpm start
```

### 打包应用

```bash
# 打包应用（包含 FFmpeg）
npm run build
# 或者使用 pnpm
pnpm run build
```

打包产物在 `dist/` 目录下，包含完整的 FFmpeg 运行时。

## 📦 开箱即用特性

### ✅ 内置 FFmpeg
- 应用会自动下载对应平台的 FFmpeg 静态二进制文件
- 打包后的应用包含完整的 FFmpeg 运行时
- 用户无需单独安装 FFmpeg

### 🔄 自动配置
- 开发环境：使用系统安装的 FFmpeg（如果存在）
- 生产环境：使用打包的 FFmpeg
- 自动检测和配置 FFmpeg 路径

### 📱 跨平台支持
- **macOS**：DMG 安装包
- **Windows**：NSIS 安装程序
- **Linux**：AppImage 格式

## 📖 使用说明

### 音频转换
1. 切换到"音频转换"标签页
2. 点击"选择文件"选择音频文件
3. 选择目标格式
4. 选择存储位置（自动或自定义）
5. 点击"开始转换音频"

### 视频转换
1. 切换到"视频转换"标签页
2. 点击"选择文件"选择视频文件
3. 选择目标格式
4. 选择视频和音频编码器（可选）
5. **设置帧率**：
   - 选择"保持原视频帧率"（推荐）
   - 或选择"自定义帧率"并选择具体帧率值
6. 选择存储位置（自动或自定义）
7. 点击"开始转换视频"

### 存储选项
- **自动保存**：转换后的文件将保存在源文件相同目录
- **自定义位置**：可以指定特定的保存位置

## 🛠️ 技术栈

- **Electron**：跨平台桌面应用框架
- **FFmpeg**：强大的音视频处理引擎（内置）
- **fluent-ffmpeg**：Node.js FFmpeg 包装器
- **现代 Web 技术**：HTML5, CSS3, JavaScript ES6+

## 📁 项目结构

```
audio-transfrom/
├── package.json          # 项目配置和依赖
├── main.js              # Electron主进程
├── index.html           # 主界面
├── renderer.js          # 渲染进程逻辑
├── scripts/             # 构建脚本
│   └── download-ffmpeg.js # FFmpeg下载脚本
├── ffmpeg/              # FFmpeg二进制文件（自动下载）
├── README.md            # 使用说明
└── .gitignore           # Git忽略文件
```

## ⚠️ 注意事项

- 首次安装时会自动下载 FFmpeg（约 50-100MB）
- 打包后的应用大小会增加（包含 FFmpeg 运行时）
- 支持的格式取决于 FFmpeg 的编解码能力
- 视频转换可能需要较长时间，请耐心等待
- 大文件转换时建议使用自定义存储位置

## 🎯 支持的格式

### 音频格式
- **输入/输出**：MP3, WAV, FLAC, AAC, OGG, M4A, WMA, ALAC, OPUS, AMR

### 视频格式
- **输入/输出**：MP4, AVI, MKV, MOV, WMV, FLV, WebM, M4V, 3GP, TS

## 🔄 更新日志

### v1.1.0
- ✅ 开箱即用：内置 FFmpeg 支持
- ✅ 自动下载和配置 FFmpeg
- ✅ 跨平台打包支持
- ✅ 改进的进度显示

### v1.0.0
- ✅ 基础音频转换功能
- ✅ 视频转换功能
- ✅ 实时进度显示
- ✅ 灵活存储选项
- ✅ 现代化界面设计
- ✅ 编码器选择功能 