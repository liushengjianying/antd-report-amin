import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva';
import { Modal, Form, Table, Popconfirm, Row, Col, Select, Button } from 'antd'
import ModalControl from '../modalControl'
import styles from '../index.less'
import { PAGE_SIZE } from "../../constants";

const FormItem = Form.Item;
const Option = Select.Option;

let timeout;

function fetchA(value, dispatch) {
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

function set(a, b, c) {
  c({
    type: a,
    payload: b
  })
}

@connect(({ manager, store }) => ({ manager, store }))
@Form.create()
class ManagerStore extends ModalControl {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      targetKeys: [],
      AllList: [],
      codeStr: '',
      value: ''
    }
  }

  getStoreByType = (e) => {
    this.showModalHandler(e);
    const { dispatch, record, agentType, storeType } = this.props;
    const { typeCode } = record;
    if (storeType === true) {
      dispatch({
        type: 'store/getStoreByType',
        payload: {
          typeCode
        }
      });
    }
    if (agentType === true) {
      dispatch({
        type: 'store/getAgentByType',
        payload: {
          typeCode
        }
      })
    }
  };


  handleSearch = (value) => {
    const { dispatch } = this.props;
    if (value.length >= 2) {
      fetchA(value, dispatch)
    }
  };

  handleChange = (value) => {
    this.setState({
      value
    })
  };

  addStore = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err && values.storeCode !== undefined) {
        const { dispatch } = this.props;
        const { pageNum } = this.props.manager;
        // dispatch({
        //   type: 'store/addStoreCode',
        //   payload: values
        // });
        await set('store/addStoreCode', values, dispatch);
        // await set('manager/getManagerAccountList', payload, dispatch);
      }
    })
  };

  delete = (index) => {
    const { dispatch } = this.props;
    const { pageNum } = this.props.manager;
    dispatch({
      type: 'store/delStoreCode',
      payload: {
        index
      }
    });
  };

  okHandler = () => {
    const { dispatch } = this.props;
    const { record, ManagerName } = this.props;
    const { pageNum } = this.props.manager;
    dispatch({
      type: 'store/submitStore',
      payload: {
        'typeCode': record.typeCode,
        'type': 3
      }
    });
    this.setState({
      visible: false
    });
    let payload = {
      "pageNum": pageNum,
      "pageSize": PAGE_SIZE,
      "type": 3,
      "ownerName": ManagerName
    };
    set('manager/getManagerAccountList', payload, dispatch);
  };

  render() {
    const { children, store } = this.props;
    const { bindList, storeArray } = store;
    const { visible } = this.state;
    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: '门店编码',
        dataIndex: 'storeCode',
        key: 'storeCode'
      },
      {
        title: '门店名',
        dataIndex: 'storeName',
        key: 'storeName'
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => {
          return (
            <Popconfirm title='确定删除该门店吗?'
                        onConfirm={() => this.delete(index)}
            >
              <a href="">删除</a>
            </Popconfirm>
          )
        }
      }
    ];

    return (
      <div>
        <span onClick={this.getStoreByType}>
          {children}
        </span>
        <Modal
          title="请绑定店长到门店"
          width={800}
          visible={visible}
          bodyStyle={{ padding: '32px 40px 48px' }}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
        >
          <div className={styles.create}>
            <Form onSubmit={this.addStore}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <FormItem>
                    {
                      getFieldDecorator('storeCode')
                      (
                        <Select
                          showSearch
                          value={this.state.value}
                          placeholder='请填写门店后新增'
                          defaultActiveFirstOption={false}
                          showArrow={false}
                          filterOption={false}
                          onSearch={this.handleSearch}
                          onChange={this.handleChange}
                          notFoundContent={null}
                        >
                          {storeArray.map((item) => (
                            <Option key={item.storeCode}>{`${item.storeName}(${item.storeCode})`}</Option>
                          ))}
                        </Select>
                      )
                    }
                  </FormItem>
                </Col>
                <Col md={2} sm={24}>
                  <Button type="primary" style={{ marginBottom: '10px' }}
                          name="check" onClick={this.addStore}>新增</Button>
                </Col>
              </Row>
            </Form>
          </div>
          <div>
            <Table
              columns={columns}
              dataSource={bindList}
              pagination={false}
            />
          </div>
        </Modal>
      </div>
    )
  }
}

export default ManagerStore
