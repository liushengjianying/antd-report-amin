import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva';
import { PAGE_SIZE } from '../constants'
import { Table, Popconfirm, Pagination, Button, Input, Row, Col } from 'antd'
import AgentModal from './agentModal'
import styles from './index.less'

@connect(({ agent }) => ({
  agent
}))
class Agent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getTableList()
  }

  getTableList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'agent/getTableList',
      payload: {
        "pageNum": 1,
        "pageSize": PAGE_SIZE
      }
    })
  };

  pageChangeHandler = (page) => {
    console.log('page', page);
    const { dispatch } = this.props;
    const agent = this.agent.state.value;
    dispatch(routerRedux.push({
      pathname: '/database/agent',
      query: { page, agent }
    }))
  };

  mergeHandler = (values) => {
    const { dispatch } = this.props;
    if (Object.keys(values).indexOf('fid') > -1) {
      let newValue;
      const agent = this.agent.state.value;
      if (agent !== '') {
        newValue = { ...values, agent}
      }
      dispatch({
        type: 'agent/modifierAgent',
        payload: newValue
      });
    } else {
      dispatch({
        type: 'agent/addAgent',
        payload: values
      })
    }
  };

  statusControl = (record) => {
    const { fid, status } = record;
    const { dispatch } = this.props;
    const agent = this.agent.state.value;
    let type = status === 1 ? 0 : 1;
    dispatch({
      type: 'agent/statusControl',
      payload: {
        type,
        fid,
        agent
      }
    })
  };

  checkAgent = () => {
    const { pageNum, pageSize } = this.props.agent;
    const { dispatch } = this.props;
    const agent = this.agent.state.value;
    dispatch({
      type: 'agent/getAimTable',
      payload: {
        "pageNum": pageNum,
        "pageSize": pageSize,
        "agentName": agent
      }
    })

  };

  resetAgentList = () => {
    this.agent.state.value = '';
    this.getTableList()
  };

  render() {
    const { agent } = this.props;
    const { totalCount, pageNum, dataList } = agent;

    const agentColumns = [
      {
        title: '编码',
        dataIndex: 'agentCode',
        key: 'agentCode'
      },
      {
        title: '名字',
        dataIndex: 'agentName',
        key: 'agentName',
      },
      {
        title: '大区',
        dataIndex: 'areaName',
        key: 'areaName'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
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
        render: (text, record) => {
          return (
            <span className={styles.action}>
                <AgentModal modifier={true} record={record} merge={this.mergeHandler}>
                  <a>修改</a>
                </AgentModal>
                <Popconfirm title={record.status === 0 ? `确定要启用该代理商吗？` : `确定要禁用该代理商吗?`}
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
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={12} sm={24} style={{ marginBottom: '10px' }}>
              <AgentModal modifier={false} record={{}} merge={this.mergeHandler}>
                <Button icon="plus" type='primary'>新增</Button>
              </AgentModal>
            </Col>
            <Col md={6} sm={12} style={{ marginBottom: '10px' }}>
              <Input placeholder="代理商查询" ref={ref => this.agent = ref}/>
            </Col>
            <Col md={6} sm={24} style={{ marginBottom: '10px' }}>
              <span className={styles.submitButtons}>
                <Button type="primary" onClick={this.checkAgent}>查询</Button>
                <Button onClick={this.resetAgentList}>重置</Button>
              </span>
            </Col>
          </Row>
        </div>
        <div className={styles.tableContainer}>
          <Table
            columns={agentColumns}
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
