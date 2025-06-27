import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  Progress,
  message,
  Card,
  Space,
  Typography,
  Radio,
  Divider,
} from 'antd';
import {
  UploadOutlined,
  PlayCircleOutlined,
  FolderOpenOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import './Converter.css';

const { Option } = Select;
const { Text } = Typography;
const { Dragger } = Upload;

const AudioConverter = () => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [outputPath, setOutputPath] = useState('');
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressVisible, setProgressVisible] = useState(false);
  const [eta, setEta] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [speed, setSpeed] = useState('');

  // 监听转换进度
  useEffect(() => {
    const handleProgress = (progressData) => {
      console.log('收到进度数据:', progressData);
      setProgress(progressData.percent || 0);
      setCurrentTime(progressData.time || '');
      setSpeed(progressData.speed || '');
      setEta(progressData.eta || '');
      
      // 根据状态更新UI
      if (progressData.status === 'start') {
        message.info('开始转换...');
      } else if (progressData.status === 'end') {
        message.success('转换完成！');
      } else if (progressData.status === 'error') {
        message.error(`转换失败: ${progressData.error || '未知错误'}`);
      }
    };

    window.electronAPI?.onProgress(handleProgress);

    return () => {
      window.electronAPI?.removeProgressListener();
    };
  }, []);

  const audioFormats = [
    { value: 'mp3', label: 'MP3' },
    { value: 'wav', label: 'WAV' },
    { value: 'flac', label: 'FLAC' },
    { value: 'aac', label: 'AAC' },
    { value: 'ogg', label: 'OGG' },
    { value: 'm4a', label: 'M4A' },
    { value: 'wma', label: 'WMA' },
    { value: 'alac', label: 'ALAC' },
    { value: 'opus', label: 'OPUS' },
    { value: 'amr', label: 'AMR' },
  ];

  const handleFileSelect = async () => {
    try {
      const file = await window.electronAPI?.selectFile('audio');
      if (file) {
        setSelectedFile(file);
        message.success('文件选择成功');
      }
    } catch (error) {
      message.error('文件选择失败');
    }
  };

  const handleDragUpload = async (file) => {
    // 检查文件对象的结构
    console.log('拖拽文件对象:', file);
    
    // 验证文件类型
    const audioTypes = [
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/flac', 'audio/aac',
      'audio/ogg', 'audio/m4a', 'audio/wma', 'audio/alac', 'audio/opus', 'audio/amr'
    ];
    
    const audioExtensions = [
      '.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma', '.alac', '.opus', '.amr'
    ];
    
    // 检查文件类型
    let isValidAudio = false;
    
    // 检查 MIME 类型
    if (file.type && audioTypes.includes(file.type)) {
      isValidAudio = true;
    }
    
    // 检查文件扩展名
    if (!isValidAudio && file.name) {
      const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      if (audioExtensions.includes(extension)) {
        isValidAudio = true;
      }
    }
    
    if (!isValidAudio) {
      message.error('请上传音频文件！支持格式：MP3、WAV、FLAC、AAC、OGG、M4A、WMA、ALAC、OPUS、AMR');
      return false;
    }
    
    // 尝试获取文件路径
    let filePath = '';
    if (file.path) {
      filePath = file.path;
    } else if (file.name) {
      // 如果是浏览器环境，可能需要使用 FileReader
      filePath = file.name;
    }
    
    if (filePath) {
      setSelectedFile(filePath);
      message.success('音频文件拖拽上传成功');
    } else {
      message.error('无法获取文件路径');
    }
    
    return false; // 阻止默认上传行为
  };

  const handleOutputPathSelect = async () => {
    try {
      const format = form.getFieldValue('format') || 'mp3';
      const path = await window.electronAPI?.selectOutputPath(format);
      if (path) {
        setOutputPath(path);
        message.success('输出路径设置成功');
      }
    } catch (error) {
      message.error('输出路径设置失败');
    }
  };

  // 监听格式变化，如果已经设置了自定义路径，需要更新
  const handleFormatChange = (value) => {
    if (outputPath) {
      // 如果已经设置了自定义路径，提示用户重新选择
      message.info('格式已更改，请重新选择输出路径');
      setOutputPath('');
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      message.error('请先选择音频文件');
      return;
    }

    const format = form.getFieldValue('format');
    if (!format) {
      message.error('请选择输出格式');
      return;
    }

    setConverting(true);
    setProgressVisible(true);
    setProgress(0);
    setEta('');
    setCurrentTime('');
    setSpeed('');

    try {
      // 确定输出路径
      let finalOutputPath = outputPath;
      if (!finalOutputPath) {
        // 自动保存到源文件目录
        finalOutputPath = await window.electronAPI?.generateOutputPath(selectedFile, format);
      }

      // 这里需要调用 Electron 的 IPC 来执行转换
      const result = await window.electronAPI?.convertAudio({
        inputPath: selectedFile,
        outputPath: finalOutputPath,
        format: format,
      });

      if (result?.success) {
        message.success('音频转换成功！');
        setProgress(100);
      } else {
        message.error(`转换失败: ${result?.error || '未知错误'}`);
      }
    } catch (error) {
      message.error('转换过程中发生错误');
    } finally {
      setConverting(false);
      setTimeout(() => setProgressVisible(false), 2000);
    }
  };

  return (
    <div className="audio-converter">
      <Form form={form} layout="vertical" size="large">
        <Card title="文件选择" className="form-card">
          <Form.Item label="音频文件">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                icon={<UploadOutlined />}
                onClick={handleFileSelect}
                style={{ width: '100%', height: 48 }}
              >
                选择音频文件
              </Button>
              
              <Divider>或者拖拽文件到下方区域</Divider>
              
              <Dragger
                name="file"
                multiple={false}
                beforeUpload={handleDragUpload}
                showUploadList={false}
                accept=".mp3,.wav,.flac,.aac,.ogg,.m4a,.wma,.alac,.opus,.amr,audio/*"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽音频文件到此区域上传</p>
                <p className="ant-upload-hint">
                  支持单个音频文件，支持 MP3、WAV、FLAC、AAC 等格式
                </p>
              </Dragger>
              
              {selectedFile && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  已选择: <span style={{color:'#88bc62'}}>{selectedFile}</span>
                </Text>
              )}
            </Space>
          </Form.Item>
        </Card>

        <Card title="转换设置" className="form-card">
          <Form.Item
            name="format"
            label="输出格式"
            rules={[{ required: true, message: '请选择输出格式' }]}
          >
            <Select placeholder="选择输出格式" size="large" onChange={handleFormatChange}>
              {audioFormats.map((format) => (
                <Option key={format.value} value={format.value}>
                  {format.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="存储位置">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio.Group
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    handleOutputPathSelect();
                  } else {
                    setOutputPath('');
                  }
                }}
                defaultValue="auto"
              >
                <Space direction="vertical">
                  <Radio value="auto">自动保存到源文件目录</Radio>
                  <Radio value="custom">自定义保存位置</Radio>
                </Space>
              </Radio.Group>
              {outputPath && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  输出路径: {outputPath}
                </Text>
              )}
            </Space>
          </Form.Item>
        </Card>

        <Card className="form-card">
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleConvert}
            loading={converting}
            disabled={!selectedFile}
            size="large"
            style={{ width: '100%', height: 48 }}
          >
            {converting ? '转换中...' : '开始转换'}
          </Button>
        </Card>
      </Form>

      {progressVisible && (
        <Card title="转换进度" className="form-card">
          <Progress
            percent={progress}
            status={progress === 100 ? 'success' : 'active'}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            format={(percent) => `${percent}%`}
          />
          <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
            {currentTime && currentTime !== '00:00:00' && (
              <Text type="secondary">当前时间: {currentTime}</Text>
            )}
            {speed && speed !== '0 Mbps' && (
              <Text type="secondary">转换速度: <span style={{color:'#88bc62'}}></span>{speed}</Text>
            )}
            {eta && eta !== '计算中...' && (
              <Text type="secondary">预计剩余时间: <span style={{color:'#88bc62'}}>{eta}</span></Text>
            )}
            {progress === 0 && (
              <Text type="secondary">正在初始化转换...</Text>
            )}
            {progress > 0 && progress < 100 && (
              <Text type="secondary">转换进行中...</Text>
            )}
            {progress === 100 && (
              <Text type="success">转换完成！</Text>
            )}
          </Space>
        </Card>
      )}
    </div>
  );
};

export default AudioConverter; 