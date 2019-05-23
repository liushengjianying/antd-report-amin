import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router'
import router from 'umi/router';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Icon,
  Card,
  Button,
  Table,
  Pagination,
  DatePicker,
} from 'antd';
import { PAGE_SIZE } from '../../constants'
import fetch from 'dva/fetch';
import styles from './sale.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

let timeout;

function fetchA(value, dispatch) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }

  function search() {
    dispatch({
      type: 'salesReport/searchAgent',
      payload: {
        "pageName": 1,
        "pageSize": 20000,
        "storeName": value
      }
    })
  }

  timeout = setTimeout(search, 300)
}

@connect(({ salesReport }) => ({
  salesReport
}))
@Form.create()
class Sale extends PureComponent {
  state = {
    expandForm: false,
    pageNum: 1,
    pageSize: PAGE_SIZE,
    params: {
      isZero: 2
    }
  };

  componentDidMount() {
    this.getInfo()
  }

  getInfo = () => {
    const { dispatch } = this.props;
    const { pageSize, params } = this.state;
    dispatch({
      type: 'salesReport/searchProduct',
    })
    dispatch({
      type: 'salesReport/searchReport',
      payload: {
        pageNum: 1,
        pageSize,
        ...params
      }
    })
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSearch = (value) => {
    const { dispatch } = this.props;
    fetchA(value, dispatch)
  };

  pageChangeHandler = (page) => {
    const { dispatch } = this.props;
    const { params, pageSize } = this.state;
    dispatch({
      type: 'salesReport/searchReport',
      payload: {
        ...params,
        pageNum: page,
        pageSize
      }
    })
    // this.setState({
    //   pageNum: page
    // })
  };

  okHandler = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, values) => {
      console.log(values)
      console.log(err)
      if (!err) {
        const { data, sapCodes, agentCode, mobile, storeCode, isZero } = values;
        const { pageSize } = this.state;
        let startDate;
        let endDate;
        console.log(data)
        if (data !== undefined) {
          startDate = moment(data[0]).format("YYYY-MM-DD");
          endDate = moment(data[1]).format("YYYY-MM-DD");
        }
        const codes = sapCodes !== undefined ? sapCodes.join(',') : undefined;
        const params = {
          "agentCode": agentCode,
          "mobile": mobile,
          "storeCode": storeCode,
          "isZero": parseInt(isZero),
          startDate,
          endDate,
          "sapCodes": codes,
        }
        dispatch({
          type: 'salesReport/searchReport',
          payload: {
            ...params,
            pageNum: 1,
            pageSize
          }
        })
        this.setState({
          params
        })
      }
    })
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pageSize } = this.state;
    form.resetFields();
    dispatch({
      type: 'salesReport/searchReport',
      payload: {
        pageNum: 1,
        pageSize,
        isZero: 2
      }
    })
    this.setState({
      params: {
        isZero: 2
      }
    });
  };

  export = () => {
    const { pageNum, pageSize } = this.state;
    this.props.form.validateFields((err, value) => {
      if (!err) {
        const { data, sapCodes, agentCode, mobile, storeCode, isZero } = value;
        const access_token = localStorage.getItem('access_token');
        let startDate;
        let endDate;
        if (data !== undefined) {
          startDate = moment(data[0]).format("YYYY-MM-DD");
          endDate = moment(data[1]).format("YYYY-MM-DD");
        }
        const codes = sapCodes !== undefined ? sapCodes.join(',') : undefined;
        const params = {
          "agentCode": agentCode,
          "mobile": mobile,
          "storeCode": storeCode,
          "isZero": parseInt(isZero),
          startDate,
          endDate,
          "sapCodes": codes,
        }
        this.setState({
          params
        })
        fetch(`/api/report/exportSales`, {
          method: 'POST',
          body: JSON.stringify({pageNum, pageSize,...params}),
          headers: {
            access_token,
            "Content-Type": "application/json;charset=UTF-8"
          },
        })
          .then(function (response) {
            response.arrayBuffer().then(res => {
              var blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
              var objectUrl = URL.createObjectURL(blob);
              var a = document.createElement("a");
              document.body.appendChild(a);
              a.style = "display: none";
              a.download = `销售主数据表_${moment(new Date()).format('YYYY-MM-DD')}.xls`;
              a.href = objectUrl;
              a.click();
              document.body.removeChild(a);
            })
          });
      }
    })
  }

  renderAdvancedForm() {
    const {
      salesReport,
      form: { getFieldDecorator },
    } = this.props;
    const { AgentList, product } = salesReport
    return (
      <Form onSubmit={this.okHandler} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="门店">
              {getFieldDecorator('storeCode')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="积分是否为0">
              {getFieldDecorator('isZero', {
                initialValue: "2"
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option key="0">是</Option>
                  <Option key="1">否</Option>
                  <Option key="2">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="代理商">
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
                      {AgentList ? AgentList.map((item) => (
                        <Option key={item.agentCode}>{item.agentName}</Option>
                      )) : null}
                    </Select>
                  )
              }
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="起止日期">
              {getFieldDecorator('data')(
                <RangePicker format={dateFormat} onChange={this.dateChange} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号">
              {
                getFieldDecorator('mobile', {
                  rules: [
                    {
                      pattern: /^\d{11}$/,
                      message: '请输入正确的手机号码'
                    }
                  ]
                })(<Input placeholder='电话号码' />)
              }
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品">
              {getFieldDecorator('sapCodes')(
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请输入"
                  defaultValue={['a10', 'c12']}
                >
                  {product ? product.map((item) => (
                    <Option key={item.sapCode}>{item.proName}</Option>
                  )) : null}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit" onClick={this.okHandler}>
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.export}>
              导出
            </Button>
            {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a> */}
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const columns = [
      {
        title: '代理商编码',
        dataIndex: 'agentCode',
        key: 'agentCode'
      },
      {
        title: '代理商名称',
        dataIndex: 'agentName',
        key: 'agentName'
      },
      {
        title: '区域经理',
        dataIndex: 'areaManager',
        key: 'areaManager'
      },
      {
        title: '门店城市',
        dataIndex: 'city',
        key: 'city'
      },
      {
        title: '门店编码',
        dataIndex: 'storeCode',
        key: 'storeCode'
      },
      {
        title: '门店名称',
        dataIndex: 'storeName',
        key: 'storeName'
      },
      {
        title: '人员类型',
        dataIndex: 'ownerType',
        key: 'ownerType'
      },
      {
        title: '姓名',
        dataIndex: 'ownerName',
        key: 'ownerName'
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile'
      },
      {
        title: '产品编码',
        dataIndex: 'sapCode',
        key: 'sapCode'
      },
      {
        title: '代理商名称',
        dataIndex: 'productName',
        key: 'productName'
      },
      {
        title: '积分',
        dataIndex: 'credit',
        key: 'credit'
      },
      {
        title: '扫码时间',
        dataIndex: 'createTime',
        key: 'createTime'
      },
      {
        title: '积分状态',
        dataIndex: 'creditStatus',
        key: 'creditStatus'
      },
    ]
    const { tableList, pageNum, totalCount } = this.props.salesReport;
    return (
      <div className={styles.container}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
          </div>
        </Card>
        <div className={styles.tableContainer}>
          <Table
            columns={columns}
            dataSource={tableList}
            scroll={{ x: 1600 }}
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

export default Sale