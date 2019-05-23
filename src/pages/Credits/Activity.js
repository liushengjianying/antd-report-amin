import React, { Component } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva';
import { PAGE_SIZE } from '../constants'
import { Table, Pagination, Button, Row, Col, Input, Popconfirm } from 'antd'
import StoreTable from './storeTable'
import ActivityMerge from './ActivityMerge'
import GoodsTable from './goodsTable'
import UploadModal from './uploadModal'
import styles from './Activity.less'

@connect((activity) => activity)
class Activity extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getActivityScoreList()
  }

  getActivityScoreList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/getActivityList',
      payload: {
        "pageNum": 1,
        "pageSize": PAGE_SIZE
      }
    })
  };

  pageChangeHandler = (page) => {
    const { dispatch } = this.props;
    const activityName = this.activityName.state.value;
    dispatch(routerRedux.push({
      pathname: '/credits/activity',
      query: { 'actPage': page, activityName}
    }))
  };

  checkActivity = () => {
    const activityName = this.activityName.state.value;
    const { pageNum, pageSize } = this.props.activity.activityObj;
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/getAimActivity',
      payload: {
        "pageNum": pageNum,
        "pageSize": pageSize,
        "disName": activityName
      }
    })
  };

  resetActivityList = () => {
    this.activityName.state.value = '';
    this.getActivityScoreList()
  };

  mergeHandler = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/modifierOrChangeActivity',
      payload: values
    })
  };

  statusControl = (record) => {
    console.log(record);
    const { fid, status } = record;
    const { dispatch } = this.props;
    let type = status === 1 ? 2 : status === 2 ? 1 : null;
    dispatch({
      type: 'activity/ActStatusControl',
      payload: {
        type,
        fid
      }
    })
  };

  deleteControl = (record) => {
    const { fid } = record;
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/ActStatusControl',
      payload: {
        "type": 0,
        fid
      }
    })
  };

  render() {
    const { activityObj } = this.props.activity;
    console.log('++++++', this.props.activity);
    const { totalCount, pageNum, dataList } = activityObj;

    const activityColumns = [
      {
        title: '活动名称',
        dataIndex: 'disName',
        key: 'disName',
      },
      {
        title: '开始时间',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (text) => text.substring(0, 10)
      },
      {
        title: '结束时间',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (text) => text.substring(0, 10)
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          return (

          <span>
             {text === 1 ? `启用` : text === 2 ? `禁用` : null}
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
          <ActivityMerge modifier={true} record={record} merge={this.mergeHandler}>
            <a>修改</a>
          </ActivityMerge>
           {/*<Popconfirm title='确定要删除该活动吗?'*/}
                       {/*onConfirm={() => this.deleteControl(record)}*/}
           {/*>*/}
              {/*<a href="">删除</a>*/}
            {/*</Popconfirm>*/}
          <GoodsTable goodsRecord={record}>
             <a>商品</a>
          </GoodsTable>
          <StoreTable storeRecord={record}>
            <a>门店</a>
          </StoreTable>
           <Popconfirm title={record.status === 1 ? `确定要禁用该活动吗？` : `确定要启用该活动吗?`}
                       onConfirm={() => this.statusControl(record)}
           >
                <a href="">{record.status === 1 ? `禁用` : `启用`}</a>
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
            {/*<Col md={6} sm={24} style={{ marginBottom: '10px' }}>*/}
              {/*<ActivityMerge modifier={false} record={{}} merge={this.mergeHandler}>*/}
                {/*<Button icon="plus" type='primary'>新增</Button>*/}
              {/*</ActivityMerge>*/}
            {/*</Col>*/}
            <Col md={6} sm={24} style={{ marginBottom: '10px' }}>
              <UploadModal>
                <Button icon="upload" type='primary'>上传</Button>
              </UploadModal>
            </Col>
            <Col md={6} sm={12} style={{ marginBottom: '10px' }}>
              <Input placeholder="查询" ref={ref => this.activityName = ref}/>
            </Col>
            <Col md={6} sm={24} style={{ marginBottom: '10px' }}>
              <span className={styles.submitButtons}>
                <Button type="primary" onClick={this.checkActivity}>查询</Button>
                <Button onClick={this.resetActivityList}>重置</Button>
              </span>
            </Col>
          </Row>
        </div>
        <div className={styles.tableContainer}>
          <Table
            className={styles.tableStyle}
            columns={activityColumns}
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

export default Activity
