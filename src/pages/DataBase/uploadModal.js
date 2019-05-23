import React from 'react'
import { connect } from 'dva';
import { Button, Modal, message, Upload, Icon } from 'antd'
import { PAGE_SIZE } from '../constants'

@connect((activity) => activity)
class UploadModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  getPdfURL = () => {
    const { dispatch } = this.props;
    const access_token = localStorage.getItem('access_token');
    const props = {
      name: 'file',
      action: '/api/store/importExcel',
      headers: {
        authorization: 'authorization-text',
        access_token
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
           console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          if (info.file.response.code === 9999) {
            message.error(`${info.file.response.msg}`);
          }
          if (info.file.response.code === 1) {
            message.success(`${info.file.response.msg}`)
          }
          else {
            message.success(`${info.file.name} 上传成功`);
            dispatch({
              type: 'activity/getActivityList',
              payload: {
                "pageNum": 1,
                "pageSize": PAGE_SIZE
              }
            })
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败.`);
        }
      },
    };
    return props;
  };

  showModalHandler = () => {
    this.setState({
      visible: true
    })
  };

  hideModalHandler = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const { children } = this.props;
    const { visible } = this.state;
    return (
      <div>
        <span onClick={this.showModalHandler}>
          {children}
        </span>
        <Modal
          title='上传文档'
          visible={visible}
          bodyStyle={{ padding: '32px 40px 48px' }}
          onOk={this.hideModalHandler}
          onCancel={this.hideModalHandler}
        >
          <Upload {...this.getPdfURL()} key={Math.random()}>
            <Button>
              <Icon type="upload"/> 点击上传
            </Button>
          </Upload>
        </Modal>
      </div>
    )
  }
}

export default UploadModal
