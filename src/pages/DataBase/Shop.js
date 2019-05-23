import React, { Component } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva';
import { PAGE_SIZE } from '../constants'
import { Table, Popconfirm, Pagination, Button, Popover, Row, Col,
  Input, Form, Select } from 'antd'
import ShopModal from './ShopModal'
import UploadModal from './uploadModal'
import moment from 'moment';
import fetch from 'dva/fetch';
import styles from './index.less'

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
      type: 'shop/searchAgent',
      payload: {
        "pageName": 1,
        "pageSize": 20000,
        "storeName": value
      }
    })
  }

  timeout = setTimeout(search, 300)
}

@connect(({ shop }) => ({
  shop
}))
@Form.create()
class Shop extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.getShopList()
  }

  mergeHandler = (values) => {
    const { dispatch } = this.props;
    if (Object.keys(values).indexOf('fid') > -1) {
      let newValue;
      const checkVal = this.props.form.getFieldsValue();
      if (checkVal.agentCode !== '' || checkVal.storeName !== '') {
        newValue = { values, checkVal };
      }
      dispatch({
        type: 'shop/modifierShop',
        payload: newValue
      })
    } else {
      dispatch({
        type: 'shop/addShop',
        payload: values
      })
    }
  };

  getShopList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shop/getShopList',
      payload: {
        "pageNum": 1,
        "pageSize": PAGE_SIZE
      }
    })
  };

  pageChangeHandler = (page) => {
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
        dispatch(routerRedux.push({
          pathname: '/database/shop',
          query: { ...values, page }
        }))
      }
    });
  };

  renderTable = (text) => {
    if (text !== null) {
      let value = `${text.substring(0, 7)}...`;
      if (text.length < 9) {
        return (
          <span>{text}</span>
        )
      }
      return (
        <Popover content={text}>
          <a>
            {value}
          </a>
        </Popover>
      )
    }
    return null
  };

  checkHandler = (e) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values, e.target.name);
        const target = e.target.name;
        for (let i in values) {
          if (values[i] === undefined) {
            values[i] = ''
          }
        }
        const { pageNum, pageSize } = this.props.shop;
        const { dispatch } = this.props;
        if (target === "check") {
          dispatch({
            type: 'shop/getAimShop',
            payload: {
              "pageNum": pageNum,
              "pageSize": pageSize,
              ...values
            }
          })
        }
        if (target === "derive") {
          const { agentCode, storeName} = values;
          const access_token = localStorage.getItem('access_token');
          fetch(`/api/store/exportStore?agentCode=${agentCode}&&storeName=${storeName}`, {
            method: 'GET',
            headers:{
              access_token
            },
          })
            .then(function(response) {
              response.arrayBuffer().then(res=> {
                var blob = new Blob([res], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                var objectUrl = URL.createObjectURL(blob);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.download = `门店主数据表_${moment(new Date()).format('YYYY-MM-DD')}.xls`; // 文件名
                a.href = objectUrl;
                a.click();
                document.body.removeChild(a);
              })
            });
        }
      }
    })
  };

  checkShop = () => {
    const shop = this.shop.state.value;
    const { pageNum, pageSize } = this.props.shop;
    const { dispatch } = this.props;
    dispatch({
      type: 'shop/getAimShop',
      payload: {
        "pageNum": pageNum,
        "pageSize": pageSize,
        "storeName": shop
      }
    })
  };

  statusControl = (record) => {
    let newValue;
    const { fid, status } = record;
    const { dispatch } = this.props;
    let type = status === 1 ? 0 : 1;
    let value = {
      type,
      fid
    };
    const checkVal = this.props.form.getFieldsValue();
    if (checkVal.agentCode !== '' || checkVal.storeName !== '') {
      newValue = { value, checkVal };
    } else {
      newValue = value
    }
    dispatch({
      type: 'shop/statusControl',
      payload: newValue
    })
  };

  handleSearch = (value) => {
    const { dispatch } = this.props;
    fetchA(value, dispatch)
  };

  handleChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shop/saveAnotherStr',
      payload: {
        "anotherStr": value
      }
    })
  };

  resetStoreList = () => {
    this.props.form.resetFields();
    this.getShopList()
  };

  render() {
    const { shop } = this.props;
    const { totalCount, pageNum, dataList, AgentList } = shop;
    const { getFieldDecorator } = this.props.form;

    const shopColumns = [
      {
        title: '编码',
        dataIndex: 'storeCode',
        key: 'storeCode'
      },
      {
        title: '名字',
        dataIndex: 'storeName',
        key: 'storeName',
        render: (text) => (
          this.renderTable(text)
        )
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        render: (text) => (
          this.renderTable(text)
        )
      },
      {
        title: '护肤编码',
        dataIndex: 'skinCode',
        key: 'skinCode'
      },
      {
        title: '彩妆编码',
        dataIndex: 'makeupCode',
        key: 'makeupCode'
      },
      {
        title: '省份',
        dataIndex: 'province',
        key: 'province'
      },
      {
        title: '城市',
        dataIndex: 'city',
        key: 'city'
      },
      {
        title: '彩妆代理商',
        dataIndex: 'makeupAgentName',
        key: 'makeupAgentName'
      },
      {
        title: '护肤代理商',
        dataIndex: 'skinAgentName',
        key: 'skinAgentName'
      },
      {
        title: '大区',
        dataIndex: 'area',
        key: 'area'
      },
      {
        title: '地区',
        dataIndex: 'district',
        key: 'district'
      },
      {
        title: '店长编码',
        dataIndex: 'ownerCode',
        key: 'ownerCode'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        fixed: 'right',
        render: (text) => {
          return (
            <span>
             {text === 0 ? `禁用` : `启用`}
           </span>
          )
        }
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        render: (text, record) => {
          return (
            <span className={styles.action}>
              <ShopModal key='modifier' modifier={true} record={record} merge={this.mergeHandler}>
                <a>修改</a>
              </ShopModal>
              <Popconfirm title={record.status === 0 ? `确定要启用该门店吗？` : `确定要禁用该门店吗?`}
                          onConfirm={() => this.statusControl(record)}
              >
                <a href="">{record.status === 0 ? `启用` : `禁用`}</a>
              </Popconfirm>
            </span>
          )
        }
      }
    ];

    return (
      <div className={styles.container}>
        <div className={styles.create}>
          <Form onSubmit={this.checkBa}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={6} sm={24}>
                <FormItem onSubmit={this.checkHandler}>
                  {
                    getFieldDecorator('agentCode')
                    (
                      <Select
                        showSearch
                        placeholder='请填写代理商'
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        onSearch={this.handleSearch}
                        onChange={this.handleChange}
                        notFoundContent={null}
                      >
                        {AgentList.map((item) => (
                          <Option key={item.agentCode}>{item.agentName}</Option>
                        ))}
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem>
                  {
                    getFieldDecorator('storeName')(
                      <Input placeholder="门店名或编码"/>
                    )
                  }
                </FormItem>
              </Col>
              <Col md={2} sm={24}>
                <Button type="primary" style={{ marginBottom: '10px' }}
                        name="check" onClick={this.checkHandler}>查询</Button>
              </Col>
              <Col md={2} sm={24}>
                <Button type="primary" style={{ marginBottom: '10px' }}
                        name="derive" onClick={this.checkHandler}>导出</Button>
              </Col>
              <Col md={2} sm={24}>
                <Button style={{ marginBottom: '10px' }}
                        onClick={this.resetStoreList}>重置</Button>
              </Col>
            </Row>
          </Form>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={3} sm={12} style={{ marginBottom: '10px' }}>
              <ShopModal modifier={false} record={{}} merge={this.mergeHandler}>
                <Button icon="plus" type='primary'>新增</Button>
              </ShopModal>
            </Col>
            <Col md={3} sm={12} style={{ marginBottom: '10px' }}>
              <UploadModal>
                <Button icon="upload" type='primary'>上传</Button>
              </UploadModal>
            </Col>
          </Row>
        </div>
        <div className={styles.tableContainer}>
          <Table
            columns={shopColumns}
            dataSource={dataList}
            rowKey={record => record.key}
            scroll={{ x: 1300 }}
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
      </div>
    )
  }
}

export default Shop
