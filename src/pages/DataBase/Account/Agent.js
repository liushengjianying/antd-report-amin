import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva';
import { PAGE_SIZE } from '../../constants'
import { Table, Popconfirm, Pagination, Button, Input, Popover, Row, Col } from 'antd'
import AgentMerge from './AgentMerge'
import AgentChange from './agentChange'
import styles from '../index.less'

@connect(({ agentAcc }) => ({ agentAcc }))
class Agent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      AgentName: ''
    }
  }

  componentDidMount() {
    this.getAgentAccountList()
  }

  getAgentAccountList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'agentAcc/getAgentAccountList',
      payload: {
        "pageNum": 1,
        "pageSize": PAGE_SIZE,
        "type": 1
      }
    })
  };

  pageChangeHandler = (page) => {
    const { dispatch } = this.props;
    const AgentName = this.AgentName.state.value;
    dispatch(routerRedux.push({
      pathname: '/database/account/agent',
      query: { page, AgentName }
    }))
  };

  mergeHandler = (values) => {
    const { dispatch } = this.props;
    if (Object.keys(values).indexOf('fid') > -1) {
      let newValue;
      const AgentName = this.AgentName.state.value;
      if (AgentName !== '') {
        newValue = { ...values, AgentName }
      }
      dispatch({
        type: 'agentAcc/modifier',
        payload: newValue
      })
    } else {
      dispatch({
        type: 'agentAcc/add',
        payload: values
      })
    }
  };

  bindAgentHandler = (values) => {
    const { dispatch } = this.props;
    let newValue;
    const AgentName = this.AgentName.state.value;
    if (AgentName !== '') {
      newValue = { ...values, AgentName }
    }
    dispatch({
      type: 'agentAcc/bindAgent',
      payload: newValue
    })
  };

  statusControl = (record) => {
    const AgentName = this.AgentName.state.value
    const { fid } = record;
    const { dispatch } = this.props;
    dispatch({
      type: 'agentAcc/statusControl',
      payload: {
        "type": 1,
        fid,
        AgentName
      }
    })
  };

  checkAgent = () => {
    const AgentName = this.AgentName.state.value;
    const { pageNum, pageSize } = this.props.agentAcc;
    const { dispatch } = this.props;
    this.setState({
      AgentName
    });
    dispatch({
      type: 'agentAcc/getAimAgent',
      payload: {
        "pageNum": pageNum,
        "pageSize": pageSize,
        "type": 1,
        "ownerName": AgentName
      }
    })
  };

  resetManagerList = () => {
    this.AgentName.state.value = '';
    this.getAgentAccountList()
  };

  renderTable = (text) => {
    // 返回','隔开的字符串
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
    const { agentAcc } = this.props;
    const { totalCount, pageNum, dataList } = agentAcc;

    const baColumns = [
      {
        title: '代理商编码',
        dataIndex: 'typeCode',
        key: 'typeCode'
      },
      {
        title: '代理商名字',
        dataIndex: 'agentNameList',
        key: 'agentNameList',
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
                <AgentMerge modifier={true} record={record} merge={this.mergeHandler}>
                  <a>修改</a>
                </AgentMerge>
                <AgentChange record={record}
                              bind={this.bindAgentHandler}
                              agentType={true}
                              AgentName={this.state.AgentName}
                >
                  <a>绑定/换绑</a>
                </AgentChange>
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
            <Col md={12} sm={24} style={{ marginBottom: '10px' }}>
              <AgentMerge modifier={false} record={{}} merge={this.mergeHandler}>
                <Button icon="plus" type='primary'>新增</Button>
              </AgentMerge>
            </Col>
            <Col md={6} sm={12} style={{ marginBottom: '10px' }}>
              <Input placeholder="查询" ref={ref => this.AgentName = ref}/>
            </Col>
            <Col md={6} sm={24} style={{ marginBottom: '10px' }}>
              <span className={styles.submitButtons}>
                <Button type="primary" onClick={this.checkAgent}>查询</Button>
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

export default Agent
