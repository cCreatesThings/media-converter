import React, { useState, useEffect } from 'react';
import { Layout, Card, Typography, Space, Divider, Input, Tooltip } from 'antd';
import { AudioOutlined, VideoCameraOutlined,PictureFilled} from '@ant-design/icons';
import AudioConverter from './components/AudioConverter';
import VideoConverter from './components/VideoConverter';
import ImageConverter from './components/ImageConverter';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  const [activeTab, setActiveTab] = useState('audio');
  const [bgColor, setBgColor] = useState('#181c2a');

  // 设置背景色变量
  const handleBgColorChange = (e) => {
    setBgColor(e.target.value);
    document.documentElement.style.setProperty('--app-bg', e.target.value);
  };

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space align="center">
            <AudioOutlined className="header-icon" />
            <Title level={3} style={{ color: 'white', margin: 0 }}>
              音视频转换器
            </Title>
          </Space>
          <Tooltip title="自定义背景色">
            <Input
              type="color"
              value={bgColor}
              onChange={handleBgColorChange}
              style={{ width: 40, height: 32, border: 'none', background: 'none', cursor: 'pointer', marginLeft: 16 }}
            />
          </Tooltip>
        </div>
      </Header>

      <Content className="app-content">
        <div className="content-wrapper">
          <Card className="main-card">
            <div className="tab-container">
              <div className="tab-buttons">
                <button
                  className={`tab-button ${activeTab === 'audio' ? 'active' : ''}`}
                  onClick={() => setActiveTab('audio')}
                >
                  <AudioOutlined />
                  音频转换
                </button>
                <button
                  className={`tab-button ${activeTab === 'video' ? 'active' : ''}`}
                  onClick={() => setActiveTab('video')}
                >
                  <VideoCameraOutlined />
                  视频转换
                </button>
                <button
                  className={`tab-button ${activeTab === 'image' ? 'active' : ''}`}
                  onClick={() => setActiveTab('image')}
                >
                  <PictureFilled />
                  Image转换
                </button>
              </div>

              <Divider />

              <div className="tab-content">
                {activeTab === 'audio' ? <AudioConverter /> :activeTab === 'video'?  <VideoConverter />: <ImageConverter />}
              </div>
            </div>
          </Card>
        </div>
      </Content>

      <Footer className="app-footer">
        <div className="footer-content">
          <Typography.Text type="secondary" style={{ color: '#fff' }}>
            © {new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')} 音视频转换器 - 基于 Electron + React + Ant Design 构建 Powered By Mr.L
          </Typography.Text>
        </div>
      </Footer>
    </Layout>
  );
}

export default App;
