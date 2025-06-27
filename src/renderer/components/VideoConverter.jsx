import React, { useState, useEffect } from 'react';
import {
  Form,
  Select,
  Button,
  Progress,
  message,
  Card,
  Space,
  Typography,
  Radio,
  Row,
  Col,
  Divider,
  Upload,
} from 'antd';
import {
  UploadOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import './Converter.css';

const { Option } = Select;
const { Text } = Typography;
const { Dragger } = Upload;

const VideoConverter = () => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [outputPath, setOutputPath] = useState('');
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressVisible, setProgressVisible] = useState(false);
  const [eta, setEta] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [speed, setSpeed] = useState('');

  const videoFormats = [
    { value: 'mp4', label: 'MP4' },
    { value: 'avi', label: 'AVI' },
    { value: 'mkv', label: 'MKV' },
    { value: 'mov', label: 'MOV' },
    { value: 'wmv', label: 'WMV' },
    { value: 'flv', label: 'FLV' },
    { value: 'webm', label: 'WebM' },
    { value: 'm4v', label: 'M4V' },
    { value: '3gp', label: '3GP' },
    { value: 'ts', label: 'TS' },
  ];

  const videoCodecs = [
    { value: 'libx264', label: 'H.264' },
    { value: 'libx265', label: 'H.265' },
    { value: 'libvpx', label: 'VP8' },
    { value: 'libvpx-vp9', label: 'VP9' },
    { value: 'mpeg4', label: 'MPEG-4' },
  ];

  const audioCodecs = [
    { value: 'aac', label: 'AAC' },
    { value: 'mp3', label: 'MP3' },
    { value: 'libvorbis', label: 'Vorbis' },
    { value: 'libopus', label: 'Opus' },
  ];

  const frameRates = [
    { value: 'original', label: '保持原视频帧率' },
    { value: '24', label: '24 FPS (电影标准)' },
    { value: '25', label: '25 FPS (PAL标准)' },
    { value: '30', label: '30 FPS (NTSC标准)' },
    { value: '50', label: '50 FPS (PAL高帧率)' },
    { value: '60', label: '60 FPS (高帧率)' },
    { value: '120', label: '120 FPS (超高帧率)' },
  ];

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

  const handleFileSelect = async () => {
    try {
      const file = await window.electronAPI?.selectFile('video');
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
    const videoTypes = [
      'video/mp4', 'video/avi', 'video/mkv', 'video/mov', 'video/wmv',
      'video/flv', 'video/webm', 'video/m4v', 'video/3gp', 'video/ts'
    ];
    
    const videoExtensions = [
      '.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp', '.ts'
    ];
    
    // 检查文件类型
    let isValidVideo = false;
    
    // 检查 MIME 类型
    if (file.type && videoTypes.includes(file.type)) {
      isValidVideo = true;
    }
    
    // 检查文件扩展名
    if (!isValidVideo && file.name) {
      const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      if (videoExtensions.includes(extension)) {
        isValidVideo = true;
      }
    }
    
    if (!isValidVideo) {
      message.error('请上传视频文件！支持格式：MP4、AVI、MKV、MOV、WMV、FLV、WebM、M4V、3GP、TS');
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
      message.success('视频文件拖拽上传成功');
    } else {
      message.error('无法获取文件路径');
    }
    
    return false; // 阻止默认上传行为
  };

  const handleOutputPathSelect = async () => {
    try {
      const format = form.getFieldValue('format') || 'mp4';
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
      message.error('请先选择视频文件');
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

    try {
      const formData = form.getFieldsValue();
      
      // 确定输出路径
      let finalOutputPath = outputPath;
      if (!finalOutputPath) {
        // 自动保存到源文件目录
        finalOutputPath = await window.electronAPI?.generateOutputPath(selectedFile, format);
      }

      const result = await window.electronAPI?.convertVideo({
        inputPath: selectedFile,
        outputPath: finalOutputPath,
        format: format,
        videoCodec: formData.videoCodec || '',
        audioCodec: formData.audioCodec || '',
        frameRate: formData.frameRate === 'original' ? null : formData.frameRate,
        customFrameRate: formData.frameRate !== 'original',
      });

      if (result?.success) {
        message.success('视频转换成功！');
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
    <div className="video-converter">
      <Form form={form} layout="vertical" size="large">
        <Card title="文件选择" className="form-card">
          <Form.Item label="视频文件">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                icon={<UploadOutlined />}
                onClick={handleFileSelect}
                style={{ width: '100%', height: 48 }}
              >
                选择视频文件
              </Button>
              
              <Divider>或者拖拽文件到下方区域</Divider>
              
              <Dragger
                name="file"
                multiple={false}
                beforeUpload={handleDragUpload}
                showUploadList={false}
                accept=".mp4,.avi,.mkv,.mov,.wmv,.flv,.webm,.m4v,.3gp,.ts,video/*"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽视频文件到此区域上传</p>
                <p className="ant-upload-hint">
                  支持单个视频文件，支持 MP4、AVI、MKV、MOV 等格式
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
              {videoFormats.map((format) => (
                <Option key={format.value} value={format.value}>
                  {format.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider orientation="left">
            <Space>
              <SettingOutlined />
              编码器设置
            </Space>
          </Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="videoCodec" label="视频编码器" initialValue="">
                <Select placeholder="选择视频编码器">
                <Option value={''}>自动选择</Option>
                  {videoCodecs.map((codec) => (
                    <Option key={codec.value} value={codec.value}>
                      {codec.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="audioCodec" label="音频编码器" initialValue="">
                <Select placeholder="选择音频编码器">
                <Option value={''}>自动选择</Option>
                  {audioCodecs.map((codec) => (
                    <Option key={codec.value} value={codec.value}>
                      {codec.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="frameRate" label="帧率设置" initialValue="original">
            <Radio.Group>
              <Space direction="vertical">
                {frameRates.map((rate) => (
                  <Radio key={rate.value} value={rate.value}>
                    {rate.label}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Form.Item>
        </Card>

        <Card title="存储位置" className="form-card">
          <Form.Item>
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

export default VideoConverter; 