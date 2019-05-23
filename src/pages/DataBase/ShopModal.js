import React from 'react'
import { connect } from 'dva';
import { Modal, Form, Input, Select } from 'antd'
import ModalControl from './modalControl'
import { PAGE_SIZE } from "../constants";

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

// let timeout;
// let currentValue;

@connect(({ agent, shop }) => ({
  agent, shop
}))
@Form.create()
class ShopModal extends ModalControl {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      agentList: [],
      makeupValue: props.record.makeUpAgentCode,
      skinValue: props.record.skinCareAgentCode
    }
  }

  getAllAgentList = (e) => {
    const { dispatch } = this.props;
    if (e) {
      e.stopPropagation()
    }
    this.setState({
      visible: true
    });
    dispatch({
      type: 'agent/getAllTableList'
    });
    dispatch({
      type: 'shop/province' // 获取省份
    })
    dispatch({
      type: 'shop/getArea' // 获取大区
    })
  };

  okHandler = () => {
    const { merge, modifier } = this.props;
    let newValues;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (modifier === true) {
          const { fid } = this.props.record;
          newValues = { ...values, fid };
        } else {
          newValues = values;
        }
        merge(newValues);
        this.hideModalHandler()
      }
    })
  };

  province = (value) => {
    this.props.form.setFieldsValue({
      cityCode: ''
    });
    const { provinceList } = this.props.shop;
    let id = provinceList[parseInt(value) - 1].id;
    const { dispatch } = this.props;
    dispatch({
      type: 'shop/city',
      payload: {
        id
      }
    })
  };

  area = (value) => {
    this.props.form.setFieldsValue({
      areaCode: ''
    });
    const { dispatch, shop } = this.props;
    const { areaList } = shop;
    for (let item of areaList) {
      console.log(item)
      if (item.areaCode === value) {
        dispatch({
          type: 'shop/getDirection',
          payload: {
            'id': item.fid
          }
        })
      }
    }
  }

  render() {
    const { value } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { children, modifier } = this.props;
    const { allList } = this.props.agent;
    const { provinceList, cityList, areaList, directionList } = this.props.shop;
    const {
      storeCode, storeName, address, makeupAgentCode, skinCode, makeupCode, province, city,
      skinAgentCode, area, district
    } = this.props.record;
    const { visible } = this.state;

    // 这里有key值相同的，所有性能有问题
    // const rookieOptions = allList.map((item) => (
    //   <Option key={item.agentCode}>{item.agentName}</Option>
    // ));

    return (
      <div>
        <span onClick={this.getAllAgentList}>
          {children}
        </span>
        <Modal
          title={modifier === true ? '修改门店' : '新增门店'}
          width={700}
          visible={visible}
          bodyStyle={{ padding: '32px 40px 48px' }}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="彩妆代理商"
            >
              {
                getFieldDecorator('makeupAgentCode', {
                  rules: [
                    {
                      required: true,
                      message: '请填写代理商'
                    }
                  ],
                  initialValue: makeupAgentCode
                })(
                  <Select
                    showSearch
                    placeholder="请写入代理商"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {allList.map((item) => (
                      <Option key={item.agentCode}>{item.agentName}</Option>
                    ))}
                  </Select>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="护肤代理商"
            >
              {
                getFieldDecorator('skinAgentCode', {
                  rules: [
                    {
                      required: true,
                      message: '请填写代理商'
                    }
                  ],
                  initialValue: skinAgentCode
                })(
                  <Select
                    showSearch
                    placeholder="请写入代理商"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {allList.map((item) => (
                      <Option key={item.agentCode}>{item.agentName}</Option>
                    ))}
                  </Select>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="门店"
            >
              {
                getFieldDecorator('storeName', {
                  rules: [
                    {
                      required: true,
                      message: '请填写门店名字'
                    }
                  ],
                  initialValue: storeName
                })(<Input placeholder='门店名字' />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="地址"
            >
              {
                getFieldDecorator('address', {
                  initialValue: address
                })(<Input placeholder='门店地址' />)
              }
            </FormItem>


            <FormItem
              {...formItemLayout}
              label="护肤编码"
            >
              {
                getFieldDecorator('skinCode', {
                  initialValue: skinCode
                })(<Input placeholder='护肤编码' />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="彩妆编码"
            >
              {
                getFieldDecorator('colorCode', {
                  initialValue: makeupCode
                })(<Input placeholder='彩妆编码' />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="大区"
            >
              {
                getFieldDecorator('area', {
                  initialValue: area
                })(
                  <Select
                    showSearch
                    placeholder="请写入大区"
                    optionFilterProp="children"
                    onSelect={this.area}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {areaList.map((item) => (
                      <Option key={item.areaCode}>{item.areaName}</Option>
                    ))}
                  </Select>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="地区"
            >
              {
                getFieldDecorator('areaCode', {
                  // initialValue: district
                })(
                  <Select
                    showSearch
                    placeholder="请写入地区"
                    optionFilterProp="children"
                    onSelect={this.area}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {directionList.map((item) => (
                      <Option key={item.areaCode}>{item.areaName}</Option>
                    ))}
                  </Select>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="省份"
            >
              {
                getFieldDecorator('provinceCode', {
                  initialValue: province
                })(
                  <Select
                    showSearch
                    placeholder="请写入省份"
                    optionFilterProp="children"
                    onSelect={this.province}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {provinceList.map((item) => (
                      <Option key={item.province_code}>{item.province_name}</Option>
                    ))}
                  </Select>
                )
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="城市"
            >
              {
                getFieldDecorator('cityCode', {
                  initialValue: city
                })(
                  <Select
                    showSearch
                    placeholder="请写入城市"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {cityList.map((item) => (
                      <Option key={item.city_code}>{item.city_name}</Option>
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

export default ShopModal
