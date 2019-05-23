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
      type: 'store/searchStore',
      payload: {
        "searchStr": value
      }
    })
  }

  timeout = setTimeout(search, 300)
}

@connect((store) => store)
@Form.create()
class BaStore extends ModalControl {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: '',
      data: []
    }
  }

  getAllShop = (e) => {
    this.showModalHandler(e);
  };

  okHandler = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { bindStore, record } = this.props;
        const { fid } = record;
        let newVal = {...values, fid};
        bindStore(newVal);
        this.hideModalHandler();
      }
    });
  };

  handleSearch = (value) => {
    const { dispatch } = this.props;
    fetch(value, dispatch)
  };

  handleChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/saveStr',
      payload: {
       "str": value
      }
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { children, record, store } = this.props;
    const { storeNameList } = record;
    const { storeArray, anotherStr } = store;
    const { visible } = this.state;
    const options = storeArray.map((item) => (
      <Option key={item.storeCode}>{`${item.storeName}(${item.storeCode})`}</Option>
    ));

    return (
      <div>
        <span onClick={this.getAllShop}>
          {children}
        </span>
        <Modal
          title={storeNameList !== null ?  `请绑定BA到门店(当前门店：${storeNameList})` : null}
          width={700}
          visible={visible}
          bodyStyle={{ padding: '32px 40px 48px' }}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="门店"
            >
              {
                getFieldDecorator('storeCode', {
                  rules: [
                    {
                      required: true,
                      message: '请填写商店名'
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
          </Form>
        </Modal>
      </div>
    )
  }
}

export default BaStore
