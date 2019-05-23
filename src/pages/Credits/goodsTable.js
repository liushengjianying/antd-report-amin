import React from 'react'
import { connect } from 'dva';
import { Input, Button, Table, Row, Col, Modal, Pagination, Popconfirm } from 'antd'
import { PAGE_SIZE } from "../constants";
import CreditModal from './creditModal'
import styles from './Activity.less'
import { routerRedux } from "dva/router";

@connect((activity) => activity)
class GoodsTable extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  pageChangeHandler = (page) => {
    const { dispatch, goodsRecord } = this.props;
    const { fid } = goodsRecord;
    const goodsName = this.goodsName.state.value;
    dispatch(routerRedux.push({
      pathname: '/credits/activity',
      query: { 'goodsPage': page, "prodisId": fid, goodsName }
    }))
  };

  getGoodsList = () => {
    const { dispatch, goodsRecord } = this.props;
    const { fid } = goodsRecord;
    dispatch({
      type: 'activity/getGoodsList',
      payload: {
        "pageNum": 1,
        "pageSize": PAGE_SIZE,
        "prodisId": fid
      }
    })
  };

  showGoodsTable = (e) => {
    if (e) {
      e.stopPropagation()
    }
    this.setState({
      visible: true
    });
    this.getGoodsList()
  };

  hideModalHandler = () => {
    this.setState({
      visible: false
    });
  };

  checkGoods = () => {
    const { dispatch } = this.props;
    const goodsName = this.goodsName.state.value;
    let prodisId = this.props.goodsRecord.fid;
    if (goodsName !== '') {
      dispatch({
        type: 'activity/getAimGoods',
        payload: {
          "pageNum": 1,
          "pageSize": 8,
          "searchStr": goodsName,
          "prodisId": prodisId
        }
      })
    }
  };

  resetGoodsList = () => {
    this.goodsName.state.value = '';
    this.getGoodsList()
  };

  statusControl = (record) => {
    const { fid, status } = record;
    const { dispatch } = this.props;
    let prodisId = this.props.goodsRecord.fid;
    let type = status === 1 ? 0 : 1;
    dispatch({
      type: 'activity/goodsStatusControl',
      payload: {
        type,
        fid,
        prodisId
      }
    })
  };

  changCredit = (values) => {
    const { dispatch } = this.props;
    let prodisId = this.props.goodsRecord.fid;
    let newVlue = { ...values, prodisId };
    dispatch({
      type: 'activity/saveGoodsCredit',
      payload: newVlue
    });
  };

  render() {
    const { goods } = this.props.activity;
    const { totalCount, pageNum, dataList } = goods;
    const { children } = this.props;
    const { visible } = this.state;

    const goodsColumns = [
      {
        title: '商品编码',
        dataIndex: 'sapCode',
        key: 'sapCode',
      },
      {
        title: '商品名',
        dataIndex: 'proName',
        key: 'proName'
      },
      {
        title: '积分',
        dataIndex: 'ownCredit',
        key: 'ownCredit'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          return (
            <Popconfirm title={record.status === 1 ? `确定要下线该商品吗？` : `确定要上线该商品吗?`}
                        onConfirm={() => this.statusControl(record)}
            >
              <a href="">{text === 0 ? `下线` : `上线`}</a>
            </Popconfirm>
          )
        }
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          return (
            <CreditModal record={record} merge={this.changCredit}>
              <a>修改</a>
            </CreditModal>
          )
        }
      }
    ];

    return (
      <div className={styles.tableContainer}>
        <span onClick={this.showGoodsTable}>
          {children}
        </span>
        <Modal
          title='请选择商品'
          visible={visible}
          width={800}
          bodyStyle={{ paddingBottom: '60px' }}
          onCancel={this.hideModalHandler}
          onOk={this.hideModalHandler}
        >
          <div className={styles.create}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={12} style={{ marginBottom: '10px' }}>
                <Input placeholder="查询" ref={ref => this.goodsName = ref}/>
              </Col>
              <Col md={12} sm={12} style={{ marginBottom: '10px' }}>
                <span className={styles.submitButtons}>
                  <Button type="primary" onClick={this.checkGoods}>查询</Button>
                  <Button onClick={this.resetGoodsList}>重置</Button>
                </span>
              </Col>
            </Row>
          </div>
          <div className={styles.tableContainer}>
            <Table
              className={styles.tableStyle}
              columns={goodsColumns}
              dataSource={dataList}
              rowKey={record => record.fid}
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
      </div>
    )
  }
}

export default GoodsTable
