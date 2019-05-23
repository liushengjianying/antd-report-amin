import React from 'react'
import { connect } from 'dva';
import { Input, Button, Table, Row, Col, Modal, Popconfirm, Pagination, Form, Select } from 'antd'
import { PAGE_SIZE } from "../constants";
import styles from './Activity.less'
import { routerRedux } from "dva/router";

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
      type: 'activity/searchShop',
      payload: {
        "searchStr": value
      }
    })
  }

  timeout = setTimeout(search, 300)
}

@connect(({ activity }) => ({ activity }))
@Form.create()
class StoreTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      addVisible: false
    }
  }

  pageChangeHandler = (page) => {
    const { dispatch, storeRecord } = this.props;
    const { fid } = storeRecord;
    const actstoreName = this.actstoreName.state.value;
    dispatch(routerRedux.push({
      pathname: '/credits/activity',
      query: { 'storePage': page, "prodisId": fid, actstoreName }
    }))
  };

  getStoreList = () => {
    const { dispatch, storeRecord } = this.props;
    const { fid } = storeRecord;
    dispatch({
      type: 'activity/getStoreList',
      payload: {
        "pageNum": 1,
        "pageSize": PAGE_SIZE,
        "prodisId": fid
      }
    })
  };

  addStore = () => {
    this.setState({
      addVisible: true,
      visible: false,
    })
  };

  hideStoreHandler = (e) => {
    if (e) {
      e.stopPropagation()
    }
    this.setState({
      addVisible: false,
      visible: true
    });
  };

  showStoreTable = (e) => {
    if (e) {
      e.stopPropagation()
    }
    this.setState({
      visible: true
    });
    this.getStoreList()
  };

  hideModalHandler = () => {
    this.setState({
      visible: false
    });
  };

  checkStore = () => {
    const { dispatch } = this.props;
    const actstoreName = this.actstoreName.state.value;
    let prodisId = this.props.storeRecord.fid;
    if (actstoreName !== '') {
      dispatch({
        type: 'activity/getAimStore',
        payload: {
          "pageNum": 1,
          "pageSize": 8,
          "searchStr": actstoreName,
          "prodisId": prodisId
        }
      })
    }
  };

  resetStoreList = () => {
    this.actstoreName.state.value = '';
    this.getStoreList()
  };

  statusControl = (record) => {
    const { fid, status } = record;
    const { dispatch } = this.props;
    let prodisId = this.props.storeRecord.fid;
    let type = status === 1 ? 0 : 1;
    dispatch({
      type: 'activity/storeStatusControl',
      payload: {
        type,
        fid,
        prodisId
      }
    })
  };

  handleSearch = (value) => {
    if(value.toString().trim().length < 1){
      return
    }
    const { dispatch } = this.props;
    fetch(value, dispatch)
  };

  handleChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/saveAnotherStr',
      payload: {
        "anotherStr": value
      }
    })
  };

  addStoreHandler = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {dispatch} = this.props
        const { fid } = this.props.storeRecord;
        let value = {...values, fid};
        dispatch({
          type: 'activity/addStore',
          payload: value
        })
      }
    })
    this.hideStoreHandler()
  };

  render() {
    const { stores, storeList, anotherStr } = this.props.activity;
    const { getFieldDecorator } = this.props.form;
    const { totalCount, pageNum, dataList } = stores;
    const { children } = this.props;
    const { visible, addVisible } = this.state;
    const options = storeList.map((item) => (
      <Option key={item.storeCode}>{`${item.storeName}(${item.storeCode})`}</Option>
    ));
    const goodsColumns = [
      {
        title: '门店编码',
        dataIndex: 'storeCode',
        key: 'storeCode',
      },
      {
        title: '门店名',
        dataIndex: 'storeName',
        key: 'storeName'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          return (
            <Popconfirm title={record.status === 1 ? `确定要下线该门店吗？` : `确定要上线该门店吗?`}
                        onConfirm={() => this.statusControl(record)}
            >
              <a href="">{text === 0 ? `下线` : `上线`}</a>
            </Popconfirm>
          )
        }
      }
    ];
    return (
      <div className={styles.tableContainer}>
        <span onClick={this.showStoreTable}>
          {children}
        </span>
        <Modal
          title='请选择门店'
          visible={visible}
          width={800}
          key='a'
          bodyStyle={{ paddingBottom: '60px' }}
          onCancel={this.hideModalHandler}
          onOk={this.hideModalHandler}
        >
          <div className={styles.create}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={3} sm={12} style={{ marginBottom: '10px' }}>
                <Button type="primary" onClick={this.addStore}>
                  新增
                </Button>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={12} style={{ marginBottom: '10px' }}>
                <Input placeholder="查询" ref={ref => this.actstoreName = ref}/>
              </Col>
              <Col md={12} sm={12} style={{ marginBottom: '10px' }}>
              <span className={styles.submitButtons}>
                <Button type="primary" onClick={this.checkStore}>查询</Button>
                <Button onClick={this.resetStoreList}>重置</Button>
              </span>
              </Col>
            </Row>
          </div>
          <div className={styles.tableContainer}>
            <Table
              className={styles.tableStyle}
              columns={goodsColumns}
              dataSource={dataList}
              pagination={false}
            />
            <Pagination
              className={styles.pagination}
              total={totalCount}
              current={pageNum}
              pageSize={PAGE_SIZE}
              onChange={this.pageChangeHandler}
            />
          </div>
        </Modal>
        <Modal
          title='请选择门店'
          visible={addVisible}
          key='abc'
          width={800}
          bodyStyle={{ paddingBottom: '60px' }}
          onCancel={this.hideStoreHandler}
          onOk={this.addStoreHandler}
        >
          <Form horizontal="true" onSubmit={this.addStoreHandler}>
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
                })(
                  <Select
                    showSearch
                    placeholder='请填写门店名'
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

export default StoreTable
