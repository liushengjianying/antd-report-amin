import React from 'react'
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

@Form.create()
class GoodsModal extends ModalControl {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      originalType: props.record.proType,
      trueType: '',
      selectValue: '',
      goodsType: [{ name: 1, value: '彩妆' }, { name: 2, value: '护肤' }]
    }
  }

  getGoodsType = (e) => {
    if (e) {
      e.stopPropagation()
    }
    this.setState({
      visible: true
    });
    const { originalType } = this.state;
    switch (originalType) {
      case 1:
        this.setState({
          selectValue: '彩妆'
        });
        break;
      case 2:
        this.setState({
          selectValue: '护肤'
        });
        break;
      default:
        return null
    }
  };

  setType = (type) => {
    this.setState({
      trueType: type
    })
  };

  okHandler = () => {
    const { merge, modifier } = this.props;
    const { originalType, trueType } = this.state;
    let newValues;
    let finalType;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        trueType === '' ? finalType = originalType : finalType = trueType;
        // 修改操作多一个fid字段
        if (modifier === true) {
          const { fid } = this.props.record;
          newValues = { ...values, fid, proType: parseInt(finalType) };
        } else {
          newValues = { ...values, proType: parseInt(finalType) };
        }
        merge(newValues);
        this.hideModalHandler()
      }
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { children, modifier } = this.props;
    const { sapCode, proName } = this.props.record;
    const { visible, selectValue, goodsType } = this.state;

    return (
      <div>
        <span onClick={this.getGoodsType}>
          {children}
        </span>
        <Modal
          title={modifier === true ? '修改商品' : '新增商品'}
          width={700}
          visible={visible}
          bodyStyle={{ padding: '32px 40px 48px' }}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
        >
          <Form horizontal="true" hideRequiredMark={true} onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="编码"
            >
              {
                getFieldDecorator('sapCode', {
                  rules: [
                    {
                      required: true,
                      message: '请填写商品编码'
                    }
                  ],
                  initialValue: sapCode
                })(<Input placeholder='商品编码'/>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品名"
            >
              {
                getFieldDecorator('proName', {
                  rules: [
                    {
                      required: true,
                      message: '请填写商品名'
                    }
                  ],
                  initialValue: proName
                })(<Input placeholder='商品名'/>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="类型"
            >
              {
                getFieldDecorator('proType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择商品类型'
                    }
                  ],
                  initialValue: selectValue
                })(
                  <Select
                    placeholder="请写入商品类型"
                    onChange={this.setType}
                  >
                    {goodsType.map((item) => (
                      <Option key={item.name}>{item.value}</Option>
                    ))}
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

export default GoodsModal

