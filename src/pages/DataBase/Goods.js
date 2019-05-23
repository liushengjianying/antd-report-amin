import React from 'react'
import { routerRedux } from 'dva/router'
import { Table, Popconfirm, Pagination, Button, Row, Col, Input } from 'antd'
import { connect } from 'dva';
import { PAGE_SIZE } from '../constants'
import GoodsModal from './goodsModal'
import styles from './index.less'

@connect(({ goods }) => ({
  goods
}))
class Goods extends React.PureComponent {

  componentDidMount() {
    this.getGoodsList()
  };

  getGoodsList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/getGoodsList',
      payload: {
        "pageNum": 1,
        "pageSize": PAGE_SIZE
      }
    })
  };

  pageChangeHandler = (page) => {
    const { dispatch } = this.props;
    const goods = this.goods.state.value;
    dispatch(routerRedux.push({
      pathname: '/database/goods',
      query: { page, goods }
    }))
  };

  mergeHandler = (values) => {
    const { dispatch } = this.props;
    if (Object.keys(values).indexOf('fid') > -1) {
      let newValue;
      const goods = this.goods.state.value;
      if (goods !== '') {
        newValue = { ...values, goods}
      }
      dispatch({
        type: 'goods/modifierGoods',
        payload: newValue
      })
    } else {
      dispatch({
        type: 'goods/addGoods',
        payload: values
      })
    }
  };

  statusControl = (record) => {
    const { fid, status } = record;
    const { dispatch } = this.props;
    let type = status === 1 ? 0 : 1;
    const goods = this.goods.state.value;
    dispatch({
      type: 'goods/statusControl',
      payload: {
        type,
        fid,
        goods
      }
    })
  };

  checkGoods = () => {
    const goods = this.goods.state.value;
    const { pageNum, pageSize } = this.props.goods;
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/getAimTable',
      payload: {
        "pageNum": pageNum,
        "pageSize": pageSize,
        "proName": goods
      }
    })
  };

  resetGoodsList = () => {
    this.goods.state.value = '';
    this.getGoodsList()
  };

  render() {
    const { goods } = this.props;
    const { totalCount, pageNum, dataList } = goods;

    const goodsColumns = [
      {
        title: '编码',
        dataIndex: 'sapCode',
        key: 'sapCode'
      },
      {
        title: '名字',
        dataIndex: 'proName',
        key: 'proName',
      },
      {
        title: '类型',
        dataIndex: 'proType',
        key: 'proType',
        render: (text) => {
          return (
            <span>{text === 1 ? `彩妆` : `护肤`}</span>
          )
        }
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
                <GoodsModal modifier={true} record={record} merge={this.mergeHandler}>
                  <a>修改</a>
                </GoodsModal>
                 <Popconfirm title={record.status === 0 ? `确定要启用该商品吗？` : `确定要禁用该商品吗?`}
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
              <GoodsModal modifier={false} record={{}} merge={this.mergeHandler}>
                <Button icon="plus" type='primary'>新增</Button>
              </GoodsModal>
            </Col>
            <Col md={6} sm={12} style={{ marginBottom: '10px' }}>
              <Input placeholder="商品查询" ref={ref => this.goods = ref}/>
            </Col>
            <Col md={6} sm={24} style={{ marginBottom: '10px' }}>
              <span className={styles.submitButtons}>
                <Button type="primary" onClick={this.checkGoods}>查询</Button>
                <Button onClick={this.resetGoodsList}>重置</Button>
              </span>
            </Col>
          </Row>
        </div>
        <div className={styles.tableContainer}>
          <Table
            columns={goodsColumns}
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

export default Goods
