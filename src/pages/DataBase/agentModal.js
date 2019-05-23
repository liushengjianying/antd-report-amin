import React from 'react'
import { connect } from 'dva';
import { Modal, Form, Input, Select } from 'antd'
import ModalControl from './modalControl'

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

@connect((area) => area)
@Form.create()
class AgentModal extends ModalControl {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
  }

  getAreaList = (e) => {
    const { dispatch } = this.props;
    if (e) {
      e.stopPropagation()
    }
    this.setState({
      visible: true
    });
    dispatch({
      type: 'area/getAreaList'
    })
  };

  areaHandleChange = (value) => {
    console.log(value);
  };

  okHandler = () => {
    const { merge, modifier } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (modifier === true) {
          const { fid } = this.props.record;
          let newValues = { ...values, fid };
          merge(newValues);
        } else {
          merge(values);
        }
        this.hideModalHandler()
      }
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { children, modifier } = this.props;
    const { areaList } = this.props.area;
    const { agentCode, agentName, areaCode } = this.props.record;
    const { visible } = this.state;

    return (
      <div>
        <span onClick={this.getAreaList}>
          {children}
        </span>
        <Modal
          title={modifier === true ? '修改代理商' : '新增代理商'}
          width={700}
          visible={visible}
          bodyStyle={{ padding: '32px 40px 48px' }}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="代理商"
            >
              {
                getFieldDecorator('agentName', {
                  rules: [
                    {
                      required: true,
                      message: '请填写代理商名字'
                    }
                  ],
                  initialValue: agentName
                })(<Input placeholder='代理商名字'/>)
              }
            </FormItem>
            {/* {modifier === false ? (
              <FormItem
                {...formItemLayout}
                label="编码"
              >
                {
                  getFieldDecorator('agentCode', {
                    rules: [
                      {
                        required: true,
                        message: '请填写代理商编码'
                      }
                    ],
                    initialValue: agentCode
                  })(<Input placeholder='代理商编码'/>)
                }
              </FormItem>
            ) : null} */}
            <FormItem
              {...formItemLayout}
              label="大区"
            >
              {
                getFieldDecorator('areaCode', {
                  rules: [
                    {
                      required: true,
                      message: '请填写代理商大区'
                    }
                  ],
                  initialValue: areaCode
                })(
                  <Select
                    showSearch
                    placeholder="请选择大区"
                    optionFilterProp="children"
                    onChange={this.areaHandleChange}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {areaList ? areaList.map((item) => {
                      return (
                        <Option key={item.areaCode}>{item.areaName}</Option>
                      )
                    }) : null}
                  </Select>
                )
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default AgentModal
