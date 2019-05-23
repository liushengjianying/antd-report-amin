import React from 'react'
import { connect } from 'dva';
import { Modal, Form, Input, Button } from 'antd'
import styles from './ActivityMerge.less'

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

connect((activity) => activity);

@Form.create()
class CreditModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
  }

  showModalHandler = (e) => {
    if (e) {
      e.stopPropagation()
    }
    this.setState({
      visible: true
    })
  };

  hideModalHandler = () => {
    this.setState({
      visible: false
    });
  };

  okHandler = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { merge,record } = this.props;
        const { fid } = record;
        let newValue = {...values, fid};
        merge(newValue);
        this.hideModalHandler()
      }
    })
  };

  render() {
    const { children, record, form } = this.props;
    const { getFieldDecorator } = form;
    const { visible } = this.state;
    const { ownCredit } = record;
    return (
      <div>
        <span onClick={this.showModalHandler}>
          {children}
        </span>
        <Modal
          title='请修改积分'
          visible={visible}
          bodyStyle={{ padding: '32px 40px 48px' }}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="积分"
            >
              {
                getFieldDecorator('credit', {
                  rules: [
                    {
                      required: true,
                      message: '请填写积分'
                    }
                  ],
                  initialValue: ownCredit
                })(<Input placeholder='请填写积分'/>)
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default CreditModal
