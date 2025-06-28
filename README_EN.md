
- [中文 (Chinese)](README.md)
- [English](README_EN.md) 

# 🎵🎬 Audio-Video-Image Converter

A modern desktop audio-video conversion application based on Electron + React + Ant Design.

## 🍎 Mac Installation Package Download
[👉 Download media-converter-1.0.0.dmg for macOS](https://github.com/cCreatesThings/media-converter/releases/download/v1.0.0/media-converter-1.0.0.dmg)

## ✨ Features

- 🎵 **Audio Conversion**: Supports MP3, WAV, FLAC, AAC, OGG, M4A, WMA, ALAC, OPUS, AMR and more formats
- 🎬 **Video Conversion**: Supports MP4, AVI, MKV, MOV, WMV, FLV, WebM, M4V, 3GP, TS and more formats
- 🖼️ **Image Conversion**: Supports conversion between multiple mainstream image formats (JPEG, PNG, WEBP, AVIF, TIFF, GIF, BMP, HEIF)
- 🎨 **Modern Interface**: Beautiful user interface based on React + Ant Design
- ⚡ **High Performance**: Fast conversion using FFmpeg
- 📦 **Ready to Use**: Built-in FFmpeg binaries, no additional installation required
- 🖥️ **Cross-Platform**: Supports Windows and macOS
- 📱 **Responsive Design**: Adapts to different screen sizes

## 🚀 Quick Start

### Development Environment

```bash
# Install dependencies (recommended)
npm install
# Start development server
npm run dev
```

### Production Build

```bash
# Build frontend
npm run build
# Package as installer
npm run dist
```

## 📁 Project Structure

```
media-converter/
├── src/
│   └── renderer/           # React frontend code
│       ├── components/     # React components
│       │   ├── AudioConverter.jsx
│       │   ├── VideoConverter.jsx
|       |   ├── ImageConverter.jsx
│       │   └── Converter.css
│       ├── App.jsx         # Main application component
│       ├── App.css         # Application styles
│       ├── main.jsx        # React entry point
│       ├── index.html      # HTML template
│       └── index.css       # Global styles
├── main.js                 # Electron main process
├── preload.js              # Preload script
├── vite.config.js          # Vite configuration
├── package.json            # Project configuration
└── scripts/
    └── download-ffmpeg.js  # FFmpeg download script
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + Ant Design 5 + Vite
- **Desktop**: Electron 28
- **Conversion**: FFmpeg (fluent-ffmpeg)
- **Build**: electron-builder
- **Package Manager**: npm (recommended) / pnpm (not recommended)

## 🎯 Feature Description

### Audio Conversion
- Supports multiple audio format conversions
- Automatically saves to source file directory or custom location
- Real-time conversion progress display

### Video Conversion
- Supports multiple video format conversions
- Configurable video and audio encoders
- Flexible frame rate setting options
- Real-time conversion progress display

### Image Conversion
- Supports conversion between multiple mainstream image formats (JPEG, PNG, WEBP, AVIF, TIFF, GIF, BMP, HEIF)
- Drag and drop or select images, choose target format, one-click conversion
- Real-time conversion progress display

## 📦 Packaging Instructions

The application automatically downloads and packages FFmpeg binary files, supporting:
- **Windows**: NSIS installer (.exe)
- **macOS**: DMG image file (.dmg)

## 🔧 Development Instructions

### Development Mode
In development mode, both will start simultaneously:
1. Vite development server (http://localhost:3000)
2. Electron application

### Production Mode
In production mode:
1. Build React application to `dist-renderer/`
2. Package Electron application

## 📝 License

MIT License

## ✨ Main Features

### 🎵 Audio Conversion
- **Supported Formats**: MP3, WAV, FLAC, AAC, OGG, M4A, WMA, ALAC, OPUS, AMR
- **High-Quality Conversion**: Uses FFmpeg engine to ensure conversion quality

### 🎬 Video Conversion
- **Supported Formats**: MP4, AVI, MKV, MOV, WMV, FLV, WebM, M4V, 3GP, TS
- **Encoder Selection**: Supports H.264, H.265, VP8, VP9 and other video encoders
- **Audio Encoding**: Supports AAC, MP3, Vorbis, Opus and other audio encoders
- **Frame Rate Control**:
  - Maintain original video frame rate (default)
  - Custom frame rate: 24, 25, 30, 50, 60, 120 FPS

### 🔧 Advanced Features
- **Real-time Progress Display**: Shows percentage, time, FPS, processing speed during conversion
- **Flexible Storage Options**:
  - Auto-save to source file directory
  - Custom save location
- **Modern Interface**: Beautiful tab design supporting audio and video conversion
- **Error Handling**: Comprehensive error prompts and status feedback
- **Ready to Use**: Built-in FFmpeg, no separate installation required

### 🖼️ Image Conversion
- Supports conversion between multiple mainstream image formats (JPEG, PNG, WEBP, AVIF, TIFF, GIF, BMP, HEIF)
- Drag and drop or select images, choose target format, one-click conversion
- Real-time conversion progress display

## 🚀 Installation and Running

### Development Environment

```bash
# Install dependencies (recommended)
npm install
# Start application
npm start
```

### Package Application

```bash
# Package application (includes FFmpeg)
npm run build
```

Package artifacts are in the `dist/` directory, containing complete FFmpeg runtime.

## 📦 Ready-to-Use Features

### ✅ Built-in FFmpeg
- Application automatically downloads FFmpeg static binary files for the corresponding platform
- Packaged application includes complete FFmpeg runtime
- Users don't need to install FFmpeg separately

### 🔄 Auto Configuration
- Development environment: Uses system-installed FFmpeg (if exists)
- Production environment: Uses packaged FFmpeg
- Automatically detects and configures FFmpeg path

### 📱 Cross-Platform Support
- **macOS**: DMG installation package
- **Windows**: NSIS installer
- **Linux**: AppImage format

## 📖 Usage Instructions

### Audio Conversion
1. Switch to "Audio Conversion" tab
2. Click "Select File" to choose audio file
3. Select target format
4. Choose storage location (auto or custom)
5. Click "Start Audio Conversion"

### Video Conversion
1. Switch to "Video Conversion" tab
2. Click "Select File" to choose video file
3. Select target format
4. Choose video and audio encoders (optional)
5. **Set Frame Rate**:
   - Select "Maintain original video frame rate" (recommended)
   - Or select "Custom frame rate" and choose specific frame rate value
6. Choose storage location (auto or custom)
7. Click "Start Video Conversion"

### Storage Options
- **Auto Save**: Converted files will be saved in the same directory as source files
- **Custom Location**: Can specify a particular save location

### Image Conversion
1. Switch to "Image Conversion" tab
2. Click "Select File" to choose image file
3. Select target format
4. Choose storage location (auto or custom)
5. Click "Start Image Conversion"

**Supported Image Formats**:
- JPEG (.jpg/.jpeg)
- PNG (.png)
- WEBP (.webp)
- AVIF (.avif)
- TIFF (.tiff)
- GIF (.gif)
- BMP (.bmp)
- HEIF (.heif)

## 🛠️ Tech Stack

- **Electron**: Cross-platform desktop application framework
- **FFmpeg**: Powerful audio-video processing engine (built-in)
- **fluent-ffmpeg**: Node.js FFmpeg wrapper
- **Modern Web Technologies**: HTML5, CSS3, JavaScript ES6+

## 📁 Project Structure

```
audio-transfrom/
├── package.json          # Project configuration and dependencies
├── main.js              # Electron main process
├── index.html           # Main interface
├── renderer.js          # Renderer process logic
├── scripts/             # Build scripts
│   └── download-ffmpeg.js # FFmpeg download script
├── ffmpeg/              # FFmpeg binary files (auto-downloaded)
├── README.md            # Usage instructions
└── .gitignore           # Git ignore file
```

## ⚠️ Notes

- FFmpeg will be automatically downloaded on first installation (about 50-100MB)
- Packaged application size will increase (includes FFmpeg runtime)
- Supported formats depend on FFmpeg's codec capabilities
- Video conversion may take a long time, please be patient
- For large file conversion, custom storage location is recommended

## 🎯 Supported Formats

### Audio Formats
- **Input/Output**: MP3, WAV, FLAC, AAC, OGG, M4A, WMA, ALAC, OPUS, AMR

### Video Formats
- **Input/Output**: MP4, AVI, MKV, MOV, WMV, FLV, WebM, M4V, 3GP, TS

### Image Formats
- **Input/Output**: JPEG, PNG, WEBP, AVIF, TIFF, GIF, BMP, HEIF

## 🔄 Changelog

### v1.1.0
- ✅ Ready to use: Built-in FFmpeg support
- ✅ Auto download and configure FFmpeg
- ✅ Cross-platform packaging support
- ✅ Improved progress display

### v1.0.0
- ✅ Basic audio conversion functionality
- ✅ Video conversion functionality
- ✅ Real-time progress display
- ✅ Flexible storage options
- ✅ Modern interface design
- ✅ Encoder selection functionality

## ⚠️ Recommend Using npm Instead of pnpm

> **Strongly recommend using `npm` for dependency installation and packaging!**
>
> - `pnpm`'s node_modules structure has poor compatibility with Electron packaging tools (such as electron-builder), easily causing missing dependencies (such as `fs-extra`, `fluent-ffmpeg`, etc.) after packaging.
> - Using `npm` ensures all dependencies are correctly packaged into the application, avoiding "Cannot find module" type errors.
>
> **Recommended commands:**
> ```bash
> npm install
> npm run dev   # Development environment
> npm run build # Build frontend
> npm run dist  # Package installer
> ```
>
> If you need to clean dependencies, it's recommended:
> ```bash
> rm -rf node_modules package-lock.json
> npm install
> ```

---

