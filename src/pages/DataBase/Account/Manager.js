import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva';
import { PAGE_SIZE } from '../../constants'
import { Table, Popconfirm, Pagination, Button, Input, Popover, Row, Col } from 'antd'
import ManagerMerge from './managerMerge'
import ManagerStore from './ManagerStore'
import styles from '../index.less'

@connect(({ manager }) => ({ manager }))
class BaAccount extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ManagerName: ''
    }
  }

  componentDidMount() {
    this.getManagerAccountList()
  }

  getManagerAccountList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'manager/getManagerAccountList',
      payload: {
        "pageNum": 1,
        "pageSize": PAGE_SIZE,
        "type": 3
      }
    })
  };

  pageChangeHandler = (page) => {
    console.log('page', page);
    const { dispatch } = this.props;
    const ManagerName = this.ManagerName.state.value;
    dispatch(routerRedux.push({
      pathname: '/database/account/manager',
      query: { page, ManagerName }
    }))
  };

  mergeHandler = (values) => {
    const { dispatch } = this.props;
    if (Object.keys(values).indexOf('fid') > -1) {
      let newValue;
      const ManagerName = this.ManagerName.state.value;
      if (ManagerName !== '') {
        newValue = { ...values, ManagerName}
      }
      dispatch({
        type: 'manager/modifierManager',
        payload: newValue
      })
    } else {
      dispatch({
        type: 'manager/addManager',
        payload: values
      })
    }
  };

  bindStoreHandler = (values) => {
    const { dispatch } = this.props;
    let newValue;
    const ManagerName = this.ManagerName.state.value;
    if (ManagerName !== '') {
      newValue = { ...values, ManagerName}
    }
    dispatch({
      type: 'manager/bindStore',
      payload: newValue
    })
  };

  getManagerList = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'manager/getManagerAccountList',
      payload: value
    })
  };

  statusControl = (record) => {
    const { fid } = record;
    const { dispatch } = this.props;
    const ManagerName = this.ManagerName.state.value;
    dispatch({
      type: 'manager/statusControl',
      payload: {
        "type": 1,
        fid,
        ManagerName
      }
    })
  };

  checkManager = () => {
    const ManagerName = this.ManagerName.state.value;
    const { pageNum, pageSize } = this.props.manager;
    const { dispatch } = this.props;
    this.setState({
      ManagerName
    });
    dispatch({
      type: 'manager/getAimManager',
      payload: {
        "pageNum": pageNum,
        "pageSize": pageSize,
        "type": 3,
        "ownerName": ManagerName
      }
    })
  };

  resetManagerList = () => {
    this.ManagerName.state.value = '';
    this.getManagerAccountList()
  };

  renderTable = (text) => {
    // 返回','隔开的字符串
    console.log("========", text)
    if (text) {
      let arr = text.split(',');
      arr.pop();
      console.log('+++++', arr);

      if (arr.length > 0) {
        if (arr.length === 1) {
          return (
            <span>{arr.join('')}</span>
          )
        }

        const content = (
          <div>
            {arr.map((item) => (
              <div>
                <a>{item}</a>
              </div>
            ))}
          </div>
        );

        return (
          <Popover content={content}>
            <a>
              {`${arr[0]}...`}
            </a>
          </Popover>
        )
      }
    }
    return null
    // console.log('==========', text)
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

  render() {
    const { manager } = this.props;
    const { totalCount, pageNum, dataList } = manager;

    const baColumns = [
      {
        title: '店长编码',
        dataIndex: 'typeCode',
        key: 'typeCode'
      },
      {
        title: '门店名称',
        dataIndex: 'storeNameList',
        key: 'storeNameList',
        render: (text) => (
          this.renderTable(text)
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
                <ManagerMerge modifier={true} record={record} merge={this.mergeHandler}>
                  <a>修改</a>
                </ManagerMerge>
                <ManagerStore record={record}
                              bind={this.bindStoreHandler}
                              otherBind={this.getManagerList}
                              storeType={true}
                              ManagerName={this.state.ManagerName}
                >
                  <a>绑定/换绑</a>
                </ManagerStore>
              {this.renderStatus(text, record)}
            </span>
          )
        }
      }
    ];

    return (
      <div className={styles.container}>
        <div className={styles.create}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            {/* <Col md={12} sm={24} style={{ marginBottom: '10px' }}>
              <ManagerMerge modifier={false} record={{}} merge={this.mergeHandler}>
                <Button icon="plus" type='primary'>新增</Button>
              </ManagerMerge>
            </Col> */}
            <Col md={6} sm={12} style={{ marginBottom: '10px' }}>
              <Input placeholder="店长查询" ref={ref => this.ManagerName = ref}/>
            </Col>
            <Col md={6} sm={24} style={{ marginBottom: '10px' }}>
              <span className={styles.submitButtons}>
                <Button type="primary" onClick={this.checkManager}>查询</Button>
                <Button onClick={this.resetManagerList}>重置</Button>
              </span>
            </Col>
          </Row>
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
