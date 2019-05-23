import * as service from '@/services/api'
import { message } from 'antd'

export default {
  namespace: 'password',
  state: {

  },
  effects: {
    *changePwd({ payload }, { call }) {
      const response = yield call(service.changePassword, payload)
      if (response.code === 1) {
        message.success('密码修改成功', 2)
      }
    }
  }
}
