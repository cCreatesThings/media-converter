import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Progress, message, Card, Space, Typography, Divider, Upload } from 'antd';
import { UploadOutlined, PlayCircleOutlined, InboxOutlined } from '@ant-design/icons';
import './Converter.css';

const { Option } = Select;
const { Text } = Typography;
const { Dragger } = Upload;

const imageFormats = [
  { value: 'jpeg', label: 'JPEG (.jpg/.jpeg)' },
  { value: 'png', label: 'PNG (.png)' },
  { value: 'webp', label: 'WebP (.webp)' },
  { value: 'avif', label: 'AVIF (.avif)' },
  { value: 'tiff', label: 'TIFF (.tiff)' },
  { value: 'gif', label: 'GIF (.gif)' },
  { value: 'bmp', label: 'BMP (.bmp)' },
  { value: 'ico', label: 'ICO (.ico)' },
  { value: 'heif', label: 'HEIF (.heif)' },
];

const ImageConverter = () => {
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [outputPath, setOutputPath] = useState('');
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressVisible, setProgressVisible] = useState(false);

  useEffect(() => {
    setProgress(0);
    setProgressVisible(false);
  }, []);

  const handleFileSelect = async () => {
    try {
      const file = await window.electronAPI?.selectFile('image');
      if (file) {
        setSelectedFile(file);
        message.success('文件选择成功');
      }
    } catch (error) {
      message.error('文件选择失败');
    }
  };

  const handleDragUpload = async (file) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff', '.gif', '.bmp', '.ico', '.heif'];
    let isValidImage = false;
    if (file.name) {
      const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      if (imageExtensions.includes(extension)) {
        isValidImage = true;
      }
    }
    if (!isValidImage) {
      message.error('请上传图片文件！支持格式：JPG、PNG、WEBP、AVIF、TIFF、GIF、BMP、ICO、HEIF');
      return false;
    }
    let filePath = '';
    if (file.path) {
      filePath = file.path;
    } else if (file.name) {
      filePath = file.name;
    }
    if (filePath) {
      setSelectedFile(filePath);
      message.success('图片文件拖拽上传成功');
    } else {
      message.error('无法获取文件路径');
    }
    return false;
  };

  const handleOutputPathSelect = async () => {
    try {
      const format = form.getFieldValue('format') || 'jpeg';
      const path = await window.electronAPI?.selectOutputPath(format);
      if (path) {
        setOutputPath(path);
        message.success('输出路径设置成功');
      }
    } catch (error) {
      message.error('输出路径设置失败');
    }
  };

  const handleFormatChange = (value) => {
    if (outputPath) {
      message.info('格式已更改，请重新选择输出路径');
      setOutputPath('');
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      message.error('请先选择图片文件');
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
      let finalOutputPath = outputPath;
      if (!finalOutputPath) {
        finalOutputPath = await window.electronAPI?.generateOutputPath(selectedFile, format);
      }
      const result = await window.electronAPI?.convertImage({
        inputPath: selectedFile,
        outputPath: finalOutputPath,
        format: format,
      });
      if (result?.success) {
        message.success('图片转换成功！');
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
    <div className="image-converter">
      <Form form={form} layout="vertical" size="large">
        <Card title="文件选择" className="form-card">
          <Form.Item label="图片文件">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                icon={<UploadOutlined />}
                onClick={handleFileSelect}
                style={{ width: '100%', height: 48 }}
              >
                选择图片文件
              </Button>
              <Divider>或者拖拽文件到下方区域</Divider>
              <Dragger
                name="file"
                multiple={false}
                beforeUpload={handleDragUpload}
                showUploadList={false}
                accept=".jpg,.jpeg,.png,.webp,.avif,.tiff,.gif,.bmp,.ico,.heif,image/*"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽图片文件到此区域上传</p>
                <p className="ant-upload-hint">
                  支持 JPG、PNG、WEBP、AVIF、TIFF、GIF、BMP、ICO、HEIF 等格式
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
              {imageFormats.map((format) => (
                <Option key={format.value} value={format.value}>
                  {format.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Card>
        <Card title="存储位置" className="form-card">
          <Form.Item>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button icon={<UploadOutlined />} onClick={handleOutputPathSelect} style={{ width: '100%' }}>
                选择输出路径
              </Button>
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

export default ImageConverter; 