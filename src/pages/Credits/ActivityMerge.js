import React from 'react'
import { connect } from 'dva';
import GoodsTable from './goodsTable'
import { Modal, Form, Input, DatePicker, Button, Transfer } from 'antd'
import { routerRedux } from 'dva/router'
import moment from 'moment';
import styles from './ActivityMerge.less'
import { PAGE_SIZE } from "../constants";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

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

@connect(({ activity, goods }) => ({ activity, goods }))
@Form.create()
class ActivityModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 第一个完整的form表单
    }
  }

  componentWillUnmount(){
    clearTimeout(this.myClear)
  };

  showModalHandler = (e) => {
    if (e) {
      e.stopPropagation()
    }
    this.setState({
      visible: true
    })
  };

  hideModalHandler = () => {
    this.setState({
      visible: false
    })
    this.myClear =  setTimeout(this.props.form.resetFields,300);
  };

  dateChange = (date, dateString) => {
    this.setState({
      datePicker: dateString
    })
  };

  okHandler = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { data, disName } = values;
        const { modifier, merge } = this.props;
        let startDate = moment(data[0]).format("YYYY-MM-DD");
        let endDate = moment(data[1]).format("YYYY-MM-DD");
        let newValues = {
          startDate,
          endDate,
          disName
        };
        if (modifier === true) {
          const { fid } = this.props.record;
          newValues = { ...newValues, fid };
        } else {
          newValues = { ...newValues, fid: null };
        }
        merge(newValues);
        this.hideModalHandler()
      }
    })
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      visible,
    } = this.state;
    const { children } = this.props;
    const { disName, startDate, endDate } = this.props.record;

    return (
      <div>
        <span onClick={this.showModalHandler}>
          {children}
        </span>
        <Modal
          title='新增活动'
          width={700}
          visible={visible}
          bodyStyle={{ padding: '32px 40px 48px' }}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
        >
          <Form horizontal="true" hideRequiredMark={true} onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="活动名称"
            >
              {
                getFieldDecorator('disName', {
                  rules: [
                    {
                      required: true,
                      message: '请填写活动名称'
                    }
                  ],
                  initialValue: disName
                })(<Input placeholder='给活动写个名字'/>)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="起止日期"
            >
              {
                getFieldDecorator('data', {
                  rules: [
                    {
                      required: true,
                      message: '请选择活动日期'
                    }
                  ],
                  initialValue: [startDate ? moment(startDate, dateFormat) : null,
                    endDate ? moment(endDate, dateFormat) : null]
                })(
                  <RangePicker
                    format={dateFormat}
                    onChange={this.dateChange}
                  />
                )
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default ActivityModal
