import React, { PureComponent } from 'react'
import {
  Upload, message, Button, Icon,
} from 'antd';
import styles from './ImportFile.less'

const props = {
  name: 'file',
  action: '//jsonplaceholder.typicode.com/posts/',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

class ImportFile extends PureComponent {
  render() {
    return (
      <div className={styles.container}>
        <div>
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> 点击上传
            </Button>
          </Upload>
        </div>
        <div className='ant-upload ant-upload-select ant-upload-select-text'>
          <span tabIndex='0' className='ant-upload' role='button'>
            <input type="file" accept style={{display: 'none'}} />
            <Button>
              <Icon type='download' /> 模板下载
            </Button>
          </span>
        </div>
      </div>
    )
  }
}

export default ImportFile
