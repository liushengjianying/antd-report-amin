import * as managerAccountService from '@/services/api'
import { PAGE_SIZE } from "../../../constants";

export default {
  namespace: 'manager',
  state: {
    pageNum: null,
    pageSize: null,
    totalPage: null,
    totalCount: null,
    dataList: [],
  },
  effects: {
    *getManagerAccountList({ payload }, { call, put }) {
      const response = yield call(managerAccountService.queryAccount, payload);
      yield put({
        type: 'save',
        payload: response.data
      })
    },
    *addManager({ payload }, { call, put, select }) {
      yield call(managerAccountService.add, payload);
      const page = yield select(state => state.manager.pageNum);
      yield put({
        type: 'getManagerAccountList',
        payload: {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "type": 3
        }
      })
    },
    *getAimManager({ payload }, { call, put }) {
      const response = yield call(managerAccountService.query, payload);
      yield put({
        type: 'clear'
      });
      yield put({
        type: 'save',
        payload: response.data
      });
    },
    *modifierManager({ payload }, { call, put, select }) {
      let newPayload;
      yield call(managerAccountService.modifier, payload);
      const page = yield select(state => state.manager.pageNum);
      if (Object.keys(payload).indexOf('ManagerName') > -1) {
        newPayload =  {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "ownerName": payload.ManagerName,
          "type": 3
        }
      } else {
        newPayload =  {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "type": 3
        }
      }
      yield put({
        type: 'getAimManager',
        payload: newPayload
      });
    },
    *statusControl({ payload }, { call, put, select }) {
      let newPayload;
      yield call(managerAccountService.StatusControl, payload);
      const page = yield select(state => state.manager.pageNum);
      if (Object.keys(payload).indexOf('ManagerName') > -1) {
        newPayload =  {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "ownerName": payload.ManagerName,
          "type": 3
        }
      } else {
        newPayload =  {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "type": 3
        }
      }
      yield put({
        type: 'getAimManager',
        payload: newPayload
      });
    },
    *bindStore({ payload }, { call, put, select }) {
      let newPayload;
      yield call(managerAccountService.AccountBind, payload);
      const page = yield select(state => state.manager.pageNum);
      if (Object.keys(payload).indexOf('ManagerName') > -1) {
        newPayload =  {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "ownerName": payload.ManagerName,
          "type": 3
        }
      } else {
        newPayload =  {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "type": 3
        }
      }
      yield put({
        type: 'getAimManager',
        payload: newPayload
      });
    }
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/database/account/manager') {
          let page = query.page;
          let arr = Object.keys(query);
          if (arr.length === 0 ) {
            page = 1
          }
          let payload = {
            "pageNum": page,
            "pageSize": PAGE_SIZE,
            "type": 3,
            "ownerName": query.ManagerName
          };
          dispatch({ type: 'getManagerAccountList', payload })
        }
      })
    }
  }
}
