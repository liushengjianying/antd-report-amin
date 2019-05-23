import React from 'react'
import { connect } from 'dva';
import { Modal, Form, Table, Popconfirm, Row, Col, Select, Button } from 'antd'
import ModalControl from '../modalControl'
import styles from '../index.less'
import { PAGE_SIZE } from "../../constants";

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
      type: 'agentAcc/searchAgent',
      payload: {
        "agentName": value,
        "pageNum": 1,
        "pageSize": 2000
      }
    })
  }

  timeout = setTimeout(search, 300)
}

function set(a, b, c) {
  c({
    type: a,
    payload: b
  })
}

@connect((agentAcc) => agentAcc)
@Form.create()
class AgentChange extends ModalControl {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      targetKeys: [],
      AllList: [],
      codeStr: ''
    }
  }

  getAgent = (e) => {
    this.showModalHandler(e);
    const { dispatch, record } = this.props;
    const { typeCode } = record;
    dispatch({
      type: 'agentAcc/getAgentInfo',
      payload: {
        typeCode
      }
    })
  };


  handleSearch = (value) => {
    const { dispatch } = this.props;
    if (value.length >= 2) {
      fetchA(value, dispatch)
    }
  };

  handleChange = (value) => {
    this.setState({
      value
    })
  };

  addAgent = () => {
    this.props.form.validateFields((err, values) => {
      if (!err && values.agentCode !== undefined) {
        console.log(values);
        const { dispatch } = this.props;
        dispatch({
          type: 'agentAcc/addAgentCode',
          payload: values
        })
      }
    })
  };

  delete = (index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'agentAcc/delAgentCode',
      payload: {
        index
      }
    })
  };

  okHandler = async () => {
    const { dispatch } = this.props;
    const { record, AgentName } = this.props;
    const { pageNum } = this.props.agentAcc;
    let other =  {
      'typeCode': record.typeCode,
      'type': 1
    };
    await set('agentAcc/submitAgent', other, dispatch)
    this.props.form.resetFields();
    this.setState({
      visible: false
    });
    if (AgentName !== '') {
      let payload = {
        "pageNum": pageNum,
        "pageSize": PAGE_SIZE,
        "type": 1,
        "ownerName": AgentName
      };
      await set('agentAcc/getAimAgent', payload, dispatch);
    } else {
      let otherPayload = {
        "pageNum": pageNum,
        "pageSize": PAGE_SIZE,
        "type": 1,
      };
      await set('agentAcc/getAgentAccountList', otherPayload, dispatch);
    }
  };

  render() {
    const { children, agentAcc } = this.props;
    const { agentList, agentListFather } = agentAcc;
    const { visible } = this.state;
    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: '代理商编码',
        dataIndex: 'agentCode',
        key: 'agentCode'
      },
      {
        title: '代理商名',
        dataIndex: 'agentName',
        key: 'agentName'
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record, index) => {
          return (
            <Popconfirm title='确定要删除该代理商吗?'
                        onConfirm={() => this.delete(index)}
            >
              <a href="">删除</a>
            </Popconfirm>
          )
        }
      }
    ];

    return (
      <div>
        <span onClick={this.getAgent}>
          {children}
        </span>
        <Modal
          title="请绑定代理商"
          width={800}
          visible={visible}
          bodyStyle={{ padding: '32px 40px 48px' }}
          onOk={this.okHandler}
          onCancel={this.hideModalHandler}
        >
          <div className={styles.create}>
            <Form onSubmit={this.addAgent}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <FormItem>
                    {
                      getFieldDecorator('agentCode')
                      (
                        <Select
                          showSearch
                          value={this.state.value}
                          placeholder='请填代理商后新增'
                          defaultActiveFirstOption={false}
                          showArrow={false}
                          filterOption={false}
                          onSearch={this.handleSearch}
                          onChange={this.handleChange}
                          notFoundContent={null}
                        >
                          {agentListFather.map((item) => (
                            <Option key={item.agentCode}>{item.agentName}</Option>
                          ))}
                        </Select>
                      )
                    }
                  </FormItem>
                </Col>
                <Col md={2} sm={24}>
                  <Button type="primary" style={{ marginBottom: '10px' }}
                          name="check" onClick={this.addAgent}>新增</Button>
                </Col>
              </Row>
            </Form>
          </div>
          <div>
            <Table
              columns={columns}
              dataSource={agentList}
              pagination={false}
            />
          </div>
        </Modal>
      </div>
    )
  }
}

export default AgentChange
