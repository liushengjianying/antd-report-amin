import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva';
import { PAGE_SIZE } from '../../constants'
import { Table, Popconfirm, Pagination, Button, Input, Row, Col, Form, Select, Popover } from 'antd'
import UploadModal from './uploadModal'
import BaMerge from './baMerge'
import BaStore from './baStore'
import moment from 'moment';
import fetch from 'dva/fetch';
import styles from '../index.less'

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
class BaAccount extends React.PureComponent {
  componentDidMount() {
    this.getBaAccountList()
  }

  getBaAccountList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ba/getBaAccountList',
      payload: {
        "pageNum": 1,
        "pageSize": PAGE_SIZE,
        "type": 4
      }
    })
  };

  pageChangeHandler = (page) => {
    console.log('page', page);
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch(routerRedux.push({
          pathname: '/database/account/ba',
          query: { ...values, page }
        }))
      }
    });
  };

  mergeHandler = (values) => {
    const { dispatch } = this.props;
    if (Object.keys(values).indexOf('fid') > -1) {
      const checkVal = this.props.form.getFieldsValue();
      let newValue;
      if (checkVal.storeCode !== '' || checkVal.ownerName !== '') {
        newValue = { values, checkVal };
      }
      dispatch({
        type: 'ba/modifierBa',
        payload: newValue
      })
    } else {
      dispatch({
        type: 'ba/addBa',
        payload: values
      })
    }
  };

  bindStoreHandler = (values) => {
    const checkVal = this.props.form.getFieldsValue();
    let newValue;
    if (checkVal.storeCode !== '' || checkVal.ownerName !== '') {
      newValue = { ...values, checkVal };
    } else {
      newValue = values
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'ba/bindBa',
      payload: newValue
    })
  };

  statusControl = (record) => {
    let newValue;
    const { fid } = record;
    const { dispatch } = this.props;
    let value = {
      "type": 1,
      fid
    };
    const checkVal = this.props.form.getFieldsValue();
    if (checkVal.storeCode !== '' || checkVal.ownerName !== '') {
      newValue = { value, checkVal };
    } else {
      newValue = value
    }
    dispatch({
      type: 'ba/statusControl',
      payload: newValue
    })
  };

  baUpgrade = (record) => {
    let newValue;
    const { fid } = record;
    const { dispatch } = this.props;
    const checkVal = this.props.form.getFieldsValue();
    if (checkVal.storeCode !== '' || checkVal.ownerName !== '') {
      newValue = { fid, checkVal };
    } else {
      newValue = { fid }
    }
    dispatch({
      type: 'ba/baUpgrade',
      payload: newValue
    })
  };

  checkBa = (e) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(Object.values(values), values, e.target.name);
        for (let i in values) {
          if (values[i] === undefined) {
            values[i] = ''
          }
        }
        const target = e.target.name;
        const { pageNum, pageSize } = this.props.ba;
        const { dispatch } = this.props;
        if (target === "check") {
          dispatch({
            type: 'ba/getAimBa',
            payload: {
              "pageNum": pageNum,
              "pageSize": pageSize,
              "type": 4,
              ...values
            }
          })
        }
        if (target === "derive") {
          const { storeCode, ownerName} = values;
          const access_token = localStorage.getItem('access_token');
          fetch(`/api/owner/exportBa?storeCode=${storeCode}&&ownerName=${ownerName}`, {
            method: 'GET',
            headers:{
              access_token
            }
          })
            .then(function(response) {
            response.arrayBuffer().then(res=> {
              var blob = new Blob([res], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
              var objectUrl = URL.createObjectURL(blob);
              var a = document.createElement("a");
              document.body.appendChild(a);
              a.style = "display: none";
              a.download = `BA人员信息_${moment(new Date()).format('YYYY-MM-DD')}.xls`; // 文件名
              a.href = objectUrl;
              a.click();
              document.body.removeChild(a);
            })
          });
          // dispatch({
          //   type: 'ba/derive',
          //   payload: values,
          //   callback: (response) => {
          //     // 这块是下载的重点
          //     const blob = new Blob([response], { type: 'application/vnd.ms-excel' });// 创建blob对象
          //     const aLink = document.createElement('a');// 创建a链接
          //     const href = window.URL.createObjectURL(blob);
          //     aLink.href = href;
          //     aLink.style.display = 'none';
          //     aLink.download = `BA人员信息_${moment(new Date()).format('YYYY-MM-DD')}.xls`; // 文件名
          //     document.body.appendChild(aLink);
          //     aLink.click();
          //     document.body.removeChild(aLink);// 点击完成后记得删除创建的链接
          //   }
          // })
        }
      }
    })
  };

  resetBaList = () => {
    this.props.form.resetFields();
    this.getBaAccountList()
  };

  renderStatus = (text, record) => {
    const { status } = record;
    if (status === 1 || status === 0 || status === 4) {
      return (
        <Popconfirm title='确定要禁用该账号吗?'
                    onConfirm={() => this.statusControl(record)}
        >
          <a href="">禁用</a>
        </Popconfirm>
      )
    }

    return null
  };

  renderStore = (text) => {
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

  handleSearch = (value) => {
    const { dispatch } = this.props;
    fetchA(value, dispatch)
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
    const { ba, store } = this.props;
    const { totalCount, pageNum, dataList } = ba;
    const { getFieldDecorator } = this.props.form;
    const { storeList } = store;
    // const options = storeList.map((item) => (
    //   <Option key={item.storeCode}>{item.storeName}</Option>
    // ));

    const baColumns = [
      {
        title: 'BA编码',
        dataIndex: 'typeCode',
        key: 'typeCode'
      },
      {
        title: '门店编码',
        dataIndex: 'storeCode',
        key: 'storeCode'
      },
      {
        title: '门店名',
        dataIndex: 'storeNameList',
        key: 'storeNameList',
        render: (text) => (
          this.renderStore(text)
        )
      },
      {
        title: '名字',
        dataIndex: 'owerName',
        key: 'owerName',
      },
      {
        title: '电话',
        dataIndex: 'mobile',
        key: 'mobile'
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
          if (text === 0 || text === 1 || text === 4) {
            return (
              <span>启用</span>
            )
          }
          return (
            <span>禁用</span>
          )
        }
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          return (
            <span className={styles.action}>
                <BaMerge modifier={true} record={record} merge={this.mergeHandler}>
                  <a>修改</a>
                </BaMerge>
              <Popconfirm title='确定要让该BA成为店长吗？'
                          onConfirm={() => this.baUpgrade(record)}
              >
                    <a href="">BA升级</a>
                </Popconfirm>
                <BaStore record={record} bindStore={this.bindStoreHandler}>
                  <a>换绑</a>
                </BaStore>
              {this.renderStatus(text, record)}
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
                <FormItem>
                  {
                    getFieldDecorator('storeCode')
                    (
                      <Select
                        showSearch
                        placeholder='请填写商店名'
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        onSearch={this.handleSearch}
                        onChange={this.handleChange}
                        notFoundContent={null}
                      >
                        {storeList.map((item) => (
                          <Option key={item.storeCode}>{`${item.storeName}(${item.storeCode})`}</Option>
                        ))}
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
              <Col md={6} sm={24}>
                <FormItem>
                  {
                    getFieldDecorator('ownerName')(
                      <Input placeholder="BA编码或姓名"/>
                    )
                  }
                </FormItem>
              </Col>
              <Col md={2} sm={24}>
                <Button type="primary" style={{ marginBottom: '10px' }}
                        name="check" onClick={this.checkBa}>查询</Button>
              </Col>
              <Col md={2} sm={24}>
                <Button type="primary" style={{ marginBottom: '10px' }}
                        name="derive" onClick={this.checkBa}>导出</Button>
              </Col>
              <Col md={2} sm={24}>
                <Button style={{ marginBottom: '10px' }}
                        onClick={this.resetBaList}>重置</Button>
              </Col>
            </Row>
          </Form>
          {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={3} sm={12} style={{ marginBottom: '10px' }}>
              <BaMerge modifier={false} record={{}} merge={this.mergeHandler}>
                <Button icon="plus" type='primary'>新增</Button>
              </BaMerge>
            </Col>
            <Col md={3} sm={12} style={{ marginBottom: '10px' }}>
              <UploadModal>
                <Button icon="upload" type='primary'>上传</Button>
              </UploadModal>
            </Col>
          </Row> */}
        </div>
        <div className={styles.tableContainer}>
          <Table
            columns={baColumns}
            dataSource={dataList}
            rowKey={record => record.id}
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

export default BaAccount
