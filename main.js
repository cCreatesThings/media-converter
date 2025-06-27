const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');

// 配置 FFmpeg 路径
function setupFFmpeg() {
  const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_IS_DEV === '1';
  const platform = process.platform;
  let ffmpegBin = '';

  if (isDev) {
    // 开发环境：优先尝试本地 ffmpeg/bin/ffmpeg，否则用系统 ffmpeg
    const localFFmpeg = platform === 'win32'
      ? path.join(__dirname, 'ffmpeg', 'bin', 'ffmpeg.exe')
      : path.join(__dirname, 'ffmpeg', 'bin', 'ffmpeg');
    if (fs.existsSync(localFFmpeg)) {
      ffmpegBin = localFFmpeg;
      ffmpeg.setFfmpegPath(ffmpegBin);
    } else {
    }
  } else {
    // 生产环境：用打包的 ffmpeg
    // electron-builder 打包后资源路径
    const basePath = process.resourcesPath || app.getAppPath();
    const packedFFmpeg = platform === 'win32'
      ? path.join(basePath, 'ffmpeg', 'bin', 'ffmpeg.exe')
      : path.join(basePath, 'ffmpeg', 'bin', 'ffmpeg');
    if (fs.existsSync(packedFFmpeg)) {
      ffmpegBin = packedFFmpeg;
      ffmpeg.setFfmpegPath(ffmpegBin);
    } else {
    }
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'icon.png'),
  });

  // 加载 React 应用
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile('dist-renderer/index.html');
  }
}

app.whenReady().then(() => {
  setupFFmpeg();
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// 音频转换主逻辑
ipcMain.handle('convert-audio', async (event, { inputPath, outputPath, format }) => {
  return new Promise((resolve, reject) => {
    // 验证输入和输出路径
    if (!inputPath || !outputPath) {
      event.sender.send('conversion-progress', {
        percent: 0,
        time: '错误',
        speed: '错误',
        eta: '错误',
        status: 'error',
        error: '输入路径或输出路径为空'
      });
      return resolve({ success: false, error: '输入路径或输出路径为空' });
    }
    
    // 检查输入文件是否存在
    if (!fs.existsSync(inputPath)) {
      event.sender.send('conversion-progress', {
        percent: 0,
        time: '错误',
        speed: '错误',
        eta: '错误',
        status: 'error',
        error: `输入文件不存在: ${inputPath}`
      });
      return resolve({ success: false, error: `输入文件不存在: ${inputPath}` });
    }
    
    // 确保输出目录存在
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      try {
        fs.mkdirpSync(outputDir);
      } catch (err) {
        event.sender.send('conversion-progress', {
          percent: 0,
          time: '错误',
          speed: '错误',
          eta: '错误',
          status: 'error',
          error: `无法创建输出目录: ${outputDir}`
        });
        return resolve({ success: false, error: `无法创建输出目录: ${outputDir}` });
      }
    }
    
    let startTime = Date.now();
    let lastProgressTime = 0;

    // 根据 format 设置容器和编码器
    let command = ffmpeg(inputPath);
    let container = format;
    let audioCodec = null;

    switch (format) {
      case 'm4a':
        container = 'mp4';
        audioCodec = 'aac';
        break;
      case 'wma':
        container = 'asf';
        audioCodec = 'wmav2';
        break;
      case 'alac':
        container = 'mp4';
        audioCodec = 'alac';
        break;
      case 'ogg':
        container = 'ogg';
        audioCodec = 'libvorbis';
        break;
      case 'aac':
        container = 'adts';
        audioCodec = 'aac';
        break;
      case 'opus':
        container = 'opus';
        audioCodec = 'libopus';
        break;
      case 'amr':
        container = 'amr';
        audioCodec = 'libopencore_amrnb';
        break;
      default:
        container = format;
        audioCodec = null;
    }

    if (audioCodec) {
      command = command.audioCodec(audioCodec);
    }

    command
      .toFormat(container)
      .on('start', (commandLine) => {
        event.sender.send('conversion-progress', {
          percent: 0,
          time: '00:00:00',
          speed: '0 Mbps',
          eta: '计算中...',
          status: 'start'
        });
      })
      .on('progress', (progress) => {
        const now = Date.now();
        if (now - lastProgressTime > 500) {
          lastProgressTime = now;
          
          const percent = Math.round(progress.percent || 0);
          const time = progress.timemark || '00:00:00';
          const speed = progress.currentKbps ? `${(progress.currentKbps / 1000).toFixed(1)} Mbps` : '0 Mbps';
          
          let eta = '计算中...';
          if (progress.percent && progress.percent > 0) {
            const elapsed = (now - startTime) / 1000;
            const remaining = (elapsed / progress.percent) * (100 - progress.percent);
            if (remaining > 0 && remaining < 3600) {
              eta = `${Math.round(remaining / 60)}分${Math.round(remaining % 60)}秒`;
            } else if (remaining >= 3600) {
              eta = `${Math.round(remaining / 3600)}小时${Math.round((remaining % 3600) / 60)}分`;
            }
          }
          
          event.sender.send('conversion-progress', {
            percent: percent,
            time: time,
            speed: speed,
            eta: eta,
            status: 'progress'
          });
        }
      })
      .on('end', () => {
        event.sender.send('conversion-progress', {
          percent: 100,
          time: '完成',
          speed: '完成',
          eta: '完成',
          status: 'end'
        });
        resolve({ success: true });
      })
      .on('error', (err) => {
        event.sender.send('conversion-progress', {
          percent: 0,
          time: '错误',
          speed: '错误',
          eta: '错误',
          status: 'error',
          error: err.message
        });
        resolve({ success: false, error: err.message });
      })
      .save(outputPath);
  });
});

// 视频转换主逻辑
ipcMain.handle('convert-video', async (event, { inputPath, outputPath, format, videoCodec, audioCodec, frameRate, customFrameRate }) => {
  return new Promise((resolve, reject) => {
    // 验证输入和输出路径
    if (!inputPath || !outputPath) {
      event.sender.send('conversion-progress', {
        percent: 0,
        time: '错误',
        speed: '错误',
        eta: '错误',
        status: 'error',
        error: '输入路径或输出路径为空'
      });
      return resolve({ success: false, error: '输入路径或输出路径为空' });
    }
    
    // 检查输入文件是否存在
    if (!fs.existsSync(inputPath)) {
      event.sender.send('conversion-progress', {
        percent: 0,
        time: '错误',
        speed: '错误',
        eta: '错误',
        status: 'error',
        error: `输入文件不存在: ${inputPath}`
      });
      return resolve({ success: false, error: `输入文件不存在: ${inputPath}` });
    }
    
    // 确保输出目录存在
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      try {
        fs.mkdirpSync(outputDir);
      } catch (err) {
        event.sender.send('conversion-progress', {
          percent: 0,
          time: '错误',
          speed: '错误',
          eta: '错误',
          status: 'error',
          error: `无法创建输出目录: ${outputDir}`
        });
        return resolve({ success: false, error: `无法创建输出目录: ${outputDir}` });
      }
    }
    
    let startTime = Date.now();
    let lastProgressTime = 0;
    
    let command = ffmpeg(inputPath);
    
    // 设置视频编码器
    if (videoCodec) {
      command = command.videoCodec(videoCodec);
    }
    
    // 设置音频编码器
    if (audioCodec) {
      command = command.audioCodec(audioCodec);
    }
    
    // 设置帧率
    if (customFrameRate && frameRate) {
      command = command.fps(frameRate);
    }
    
    command
      .toFormat(format)
      .on('start', (commandLine) => {
        event.sender.send('conversion-progress', {
          percent: 0,
          time: '00:00:00',
          speed: '0 Mbps',
          eta: '计算中...',
          status: 'start'
        });
      })
      .on('progress', (progress) => {
        const now = Date.now();
        if (now - lastProgressTime > 500) {
          lastProgressTime = now;
          
          const percent = Math.round(progress.percent || 0);
          const time = progress.timemark || '00:00:00';
          const speed = progress.currentKbps ? `${(progress.currentKbps / 1000).toFixed(1)} Mbps` : '0 Mbps';
          
          let eta = '计算中...';
          if (progress.percent && progress.percent > 0) {
            const elapsed = (now - startTime) / 1000;
            const remaining = (elapsed / progress.percent) * (100 - progress.percent);
            if (remaining > 0 && remaining < 3600) {
              eta = `${Math.round(remaining / 60)}分${Math.round(remaining % 60)}秒`;
            } else if (remaining >= 3600) {
              eta = `${Math.round(remaining / 3600)}小时${Math.round((remaining % 3600) / 60)}分`;
            }
          }
          
          event.sender.send('conversion-progress', {
            percent: percent,
            time: time,
            speed: speed,
            eta: eta,
            status: 'progress'
          });
        }
      })
      .on('end', () => {
        event.sender.send('conversion-progress', {
          percent: 100,
          time: '完成',
          speed: '完成',
          eta: '完成',
          status: 'end'
        });
        resolve({ success: true });
      })
      .on('error', (err) => {
        event.sender.send('conversion-progress', {
          percent: 0,
          time: '错误',
          speed: '错误',
          eta: '错误',
          status: 'error',
          error: err.message
        });
        resolve({ success: false, error: err.message });
      })
      .save(outputPath);
  });
});

// 选择文件对话框
ipcMain.handle('select-file', async (event, { type }) => {
  let filters = [];
  if (type === 'audio') {
    filters = [
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'alac', 'opus', 'amr'] },
      { name: 'All Files', extensions: ['*'] }
    ];
  } else if (type === 'video') {
    filters = [
      { name: 'Video Files', extensions: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v', '3gp', 'ts'] },
      { name: 'All Files', extensions: ['*'] }
    ];
  } else {
    filters = [
      { name: 'All Files', extensions: ['*'] }
    ];
  }
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters,
  });
  if (canceled) return null;
  return filePaths[0];
});

// 选择保存位置对话框
ipcMain.handle('save-file', async (event, { format }) => {
  // 根据格式设置默认文件名和过滤器
  let defaultPath = '';
  let filters = [];
  
  if (format) {
    // 音频格式
    const audioFormats = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'alac', 'opus', 'amr'];
    // 视频格式
    const videoFormats = ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v', '3gp', 'ts'];
    
    if (audioFormats.includes(format)) {
      defaultPath = `output.${format}`;
      filters = [
        { name: 'Audio Files', extensions: audioFormats },
        { name: 'All Files', extensions: ['*'] }
      ];
    } else if (videoFormats.includes(format)) {
      defaultPath = `output.${format}`;
      filters = [
        { name: 'Video Files', extensions: videoFormats },
        { name: 'All Files', extensions: ['*'] }
      ];
    } else {
      defaultPath = `output.${format}`;
      filters = [
        { name: 'All Files', extensions: ['*'] }
      ];
    }
  } else {
    // 如果没有指定格式，提供所有格式选项
    defaultPath = 'output';
    filters = [
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'alac', 'opus', 'amr'] },
      { name: 'Video Files', extensions: ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', 'm4v', '3gp', 'ts'] },
      { name: 'All Files', extensions: ['*'] }
    ];
  }

  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath,
    filters,
  });
  if (canceled) return null;
  return filePath;
});

// 选择保存目录对话框
ipcMain.handle('select-directory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (canceled) return null;
  return filePaths[0];
});

// 生成输出路径
ipcMain.handle('generate-output-path', async (event, { inputPath, format }) => {
  if (!inputPath || !format) {
    return null;
  }
  
  const path = require('path');
  const dir = path.dirname(inputPath);
  const name = path.basename(inputPath, path.extname(inputPath));
  const outputPath = path.join(dir, `${name}_converted.${format}`);
  
  return outputPath;
});

// 图片转换主逻辑
ipcMain.handle('convert-image', async (event, { inputPath, outputPath, format }) => {
  try {
    let sharpFormat = format === 'jpg' ? 'jpeg' : format;
    await sharp(inputPath)
      .toFormat(sharpFormat)
      .toFile(outputPath);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}); 