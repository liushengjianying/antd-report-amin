import React from 'react'
import { connect } from 'dva';
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

let timeout;

function fetch(value, dispatch) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }

  function search() {
    dispatch({
      type: 'store/searchShop',
      payload: {
        "pageName": 1,
        "pageSize": 20000,
        "storeName": value
      }
    })
  }

  timeout = setTimeout(search, 300)
}

@connect(({ ba, store }) => ({ ba, store }))
@Form.create()
class BaMerge extends ModalControl {
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
          console.log(this.props.record)
          newValues = { ...values, fid };
        } else {
          newValues = {...values, type: 4};
        }
        merge(newValues);
        this.hideModalHandler()
      }
    })
  };

  handleSearch = (value) => {
    const { dispatch } = this.props;
    fetch(value, dispatch)
  };

  handleChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/saveAnotherStr',
      payload: {
        "anotherStr": value
      }
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { children, modifier, store } = this.props;
    const { typeCode, owerName, mobile, gender } = this.props.record;
    const { visible } = this.state;
    const { storeList, anotherStr } = store;
    const options = storeList.map((item) => (
      <Option key={item.storeCode}>{item.storeName}</Option>
    ));

    return (
      <div>
        <span onClick={this.showModalHandler}>
          {children}
        </span>
        <Modal
          title={modifier === true ? `修改BA账号(工号${typeCode})` : `新增BA账号`}
          width={700}
          visible={visible}
          bodyStyle={{ padding: '32px 40px 48px' }}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            {modifier === false ? (
              <div>
                <FormItem
                  {...formItemLayout}
                  label="BA编码"
                >
                  {
                    getFieldDecorator('typeCode', {
                      rules: [
                        {
                          required: true,
                          message: '请填写BA编码'
                        }
                      ],
                      initialValue: typeCode
                    })(<Input placeholder='BA编码'/>)
                  }
                </FormItem>
              </div>
            ) : null}
            <FormItem
              {...formItemLayout}
              label="姓名"
            >
              {
                getFieldDecorator('owerName', {
                  rules: [
                    {
                      required: true,
                      message: '请填写BA姓名'
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
                })(<Input  placeholder='电话号码'/>)
              }
            </FormItem>
            {modifier === false ? (
              <FormItem
                {...formItemLayout}
                label="门店"
              >
                {
                  getFieldDecorator('storeCode', {
                    rules: [
                      {
                        required: true,
                        message: '请填写门店'
                      }
                    ]
                  })
                  (
                    <Select
                      showSearch
                      value={anotherStr}
                      placeholder='请填写商店名'
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      onSearch={this.handleSearch}
                      onChange={this.handleChange}
                      notFoundContent={null}
                    >
                      {options}
                    </Select>
                  )
                }
              </FormItem>
            ) : null }
          </Form>
        </Modal>
      </div>
    )
  }
}

export default BaMerge
