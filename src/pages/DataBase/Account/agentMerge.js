import React from 'react'
import { Modal, Form, Input, Select } from 'antd'
import ModalControl from '../modalControl'

const FormItem = Form.Item;
const Option = Select.Option;

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

@Form.create()
class AgentMerge extends ModalControl {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
  }

  okHandler = () => {
    const { merge, modifier } = this.props;
    let newValues;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (modifier === true) {
          const { fid } = this.props.record;
          newValues = { ...values, fid };
        } else {
          newValues = {...values, type: 1};
        }
        merge(newValues);
        this.hideModalHandler()
      }
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { children, modifier } = this.props;
    const { typeCode, owerName, mobile, gender } = this.props.record;
    const { visible } = this.state;

    return (
      <div>
        <span onClick={this.showModalHandler}>
          {children}
        </span>
        <Modal
          title={modifier === true ? `修改代理商账号(工号${typeCode})` : '新增代理商账号'}
          width={700}
          visible={visible}
          bodyStyle={{ padding: '32px 40px 48px' }}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="姓名"
            >
              {
                getFieldDecorator('owerName', {
                  rules: [
                    {
                      required: true,
                      message: '请填写姓名'
                    }
                  ],
                  initialValue: owerName
                })(<Input placeholder='姓名'/>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="性别"
            >
              {
                getFieldDecorator('gender', {
                  rules: [
                    {
                      required: true,
                      message: '请选择性别'
                    }
                  ],
                  initialValue: gender
                })(
                  <Select placeholder="请选择性别">
                    <Option key='男'>男</Option>
                    <Option key='女'>女</Option>
                  </Select>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="电话"
            >
              {
                getFieldDecorator('mobile', {
                  rules: [
                    {
                      required: true,
                      message: '请填写电话号码'
                    },
                    {
                      pattern: /^\d{11}$/,
                      message: '请输入正确的手机号码'
                    },
                  ],
                  initialValue: mobile
                })(<Input placeholder='电话号码'/>)
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default AgentMerge
