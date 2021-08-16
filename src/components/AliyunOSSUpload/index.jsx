import React from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {ossConfig} from '@/services/common';

export default class AliyunOSSUpload extends React.Component {
  state = {
    OSSData: {},
  };

  //组件挂载完成后，进行初始化，获取oss配置
  async componentDidMount() {
    await this.init();
  }

  //初始化，获取oss上传签名
  init = async () => {
    try {
      const OSSData = await ossConfig();

      this.setState({
        OSSData,
      });
    } catch (error) {
      message.error(error);
    }
  };

  //文件上传过程中触发的回调函数，直达上传完成
  onChange = ({ file }) => {
    if(file.status === 'done') {
      if(this.props.setConverKey){
        this.props.setConverKey(file.key)
      }

      //上传完成之后，如果需要url，那么返回url给父组件
      if(this.props.insertImage){
        this.props.insertImage(file.url)
      }
        message.success('上传成功')
    }
  };


  //额外的上传参数
  getExtraData = file => {
    const { OSSData } = this.state;

    return {
      key: file.key,
      OSSAccessKeyId: OSSData.accessid,
      policy: OSSData.policy,
      Signature: OSSData.signature,
    };
  };

  //选择文件之后，上传文件之前，执行回调
  beforeUpload = async file => {
    const { OSSData } = this.state;
    const expire = OSSData.expire * 1000;

    if (expire < Date.now()) {
      await this.init();
    }

    const dir = 'react/'

    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    file.key = OSSData.dir + dir + filename;
    file.url = OSSData.host + OSSData.dir +dir + filename;

    return file;
  };

  render() {
    const { value, accept, showUploadList } = this.props;
    const props = {
      accept: accept || '',
      name: 'file',
      fileList: value,
      action: this.state.OSSData.host,
      onChange: this.onChange,
      data: this.getExtraData,
      beforeUpload: this.beforeUpload,
      listType: "picture",
      maxCount: 1,
      showUploadList
    };
    return (
      <Upload {...props}>
        {this.props.children}
      </Upload>
    );
  }
}


