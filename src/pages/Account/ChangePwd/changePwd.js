import React from 'react'
import { connect } from 'dva';
import { Form, Input, Button } from 'antd'
import styles from './index.less'

const FormItem = Form.Item;

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

@connect((password) => password)
@Form.create()
class ChangePwd extends React.PureComponent {
  checkOldPwd = (rule, value, callback) => {
    const oldValue = this.props.form.getFieldsValue().oldPwd;
    if (value === oldValue) {
      callback('新密码和旧密码不能一致');
    }
    callback()
  };

  checkNewPwd = (rule, value, callback) => {
    const oldValue = this.props.form.getFieldsValue().password;
    if (value !== oldValue) {
      callback('两次输入密码要一致');
    }
    callback()
  };

  changePwd = () => {
    this.props.form.validateFields((err, value) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'password/changePwd',
          payload: {
            "oldPwd": value.oldPwd,
            "newPwd": value.newPwd
          }
        });
        this.props.form.resetFields();
      }
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Form horizontal="true" onSubmit={this.changePwd}>
          <FormItem
            {...formItemLayout}
            label="原密码"
          >
            {
              getFieldDecorator('oldPwd', {
                rules: [
                  {
                    required: true,
                    message: '请填写原来的密码'
                  },
                ],
              })(<Input type='password' placeholder='原密码'/>)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="新密码"
          >
            {
              getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请填写新密码'
                  },
                  { validator: this.checkOldPwd }
                ],
              })(<Input type='password' placeholder='新密码'/>)
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="再次确认"
          >
            {
              getFieldDecorator('newPwd', {
                rules: [
                  {
                    required: true,
                    message: '请再次确认密码'
                  },
                  { validator: this.checkNewPwd }
                ],
              })(<Input type='password' placeholder='再次确认密码'/>)
            }
          </FormItem>
          <div className={styles.change}>
            <Button style={{width: '200px'}} type='primary' onClick={this.changePwd}>确认</Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default ChangePwd
