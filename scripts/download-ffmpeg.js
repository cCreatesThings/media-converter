const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

async function downloadFFmpeg() {
  const platform = os.platform();
  const arch = os.arch();
  
  console.log(`检测到平台: ${platform} ${arch}`);
  
  // 检查是否已经存在
  const ffmpegDir = path.join(__dirname, '..', 'ffmpeg');
  const ffmpegBin = path.join(ffmpegDir, 'bin', 'ffmpeg');
  if (await fs.pathExists(ffmpegBin)) {
    console.log('FFmpeg 已存在，跳过下载');
    return;
  }
  
  console.log('开始下载 FFmpeg...');
  
  try {
    // 创建临时目录
    const tempDir = path.join(__dirname, '..', 'temp');
    await fs.ensureDir(tempDir);
    
    let downloadUrl = '';
    let fileName = '';
    
    // 根据平台选择下载链接
    if (platform === 'darwin') {
      downloadUrl = 'https://evermeet.cx/ffmpeg/getrelease/zip';
      fileName = 'ffmpeg.zip';
    } else if (platform === 'win32') {
      downloadUrl = 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip';
      fileName = 'ffmpeg.zip';
    } else if (platform === 'linux') {
      downloadUrl = 'https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz';
      fileName = 'ffmpeg.tar.xz';
    } else {
      throw new Error(`不支持的平台: ${platform}`);
    }
    
    const filePath = path.join(tempDir, fileName);
    
    // 使用 curl 下载（更可靠）
    console.log(`下载地址: ${downloadUrl}`);
    execSync(`curl -L -o "${filePath}" "${downloadUrl}"`, { stdio: 'inherit' });
    
    console.log('下载完成，正在解压...');
    
    // 解压文件
    if (platform === 'darwin' || platform === 'win32') {
      execSync(`unzip -q "${filePath}" -d "${tempDir}"`, { stdio: 'inherit' });
    } else {
      execSync(`tar -xf "${filePath}" -C "${tempDir}"`, { stdio: 'inherit' });
    }
    
    // 查找 ffmpeg 可执行文件
    const files = await fs.readdir(tempDir);
    let ffmpegSourceDir = null;
    
    for (const file of files) {
      if (file.includes('ffmpeg') && !file.endsWith('.zip') && !file.endsWith('.tar.xz')) {
        ffmpegSourceDir = path.join(tempDir, file);
        break;
      }
    }
    
    if (!ffmpegSourceDir) {
      throw new Error('未找到 FFmpeg 文件');
    }
    
    // 复制到目标目录
    await fs.copy(ffmpegSourceDir, ffmpegDir);
    
    // 设置执行权限（Unix 系统）
    if (platform !== 'win32') {
      const ffmpegBin = path.join(ffmpegDir, 'bin', 'ffmpeg');
      if (await fs.pathExists(ffmpegBin)) {
        await fs.chmod(ffmpegBin, '755');
      }
    }
    
    // 清理临时文件
    await fs.remove(tempDir);
    
    console.log('FFmpeg 安装完成！');
    
  } catch (error) {
    console.error('下载 FFmpeg 失败:', error.message);
    console.log('请手动下载 FFmpeg 并放置在 ffmpeg 目录中');
    console.log('或者使用系统包管理器安装 FFmpeg');
  }
}

downloadFFmpeg(); 