const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 文件选择，支持类型参数
  selectFile: (type) => ipcRenderer.invoke('select-file', { type }),
  
  // 保存文件路径选择
  selectOutputPath: (format) => ipcRenderer.invoke('save-file', { format }),
  
  // 生成输出路径
  generateOutputPath: (inputPath, format) => ipcRenderer.invoke('generate-output-path', { inputPath, format }),
  
  // 音频转换
  convertAudio: (params) => ipcRenderer.invoke('convert-audio', params),
  
  // 视频转换
  convertVideo: (params) => ipcRenderer.invoke('convert-video', params),
  
  // 图片转换
  convertImage: (params) => ipcRenderer.invoke('convert-image', params),
  
  // 监听转换进度
  onProgress: (callback) => {
    ipcRenderer.on('conversion-progress', (event, progress) => {
      callback(progress);
    });
  },
  
  // 移除进度监听
  removeProgressListener: () => {
    ipcRenderer.removeAllListeners('conversion-progress');
  },
}); 