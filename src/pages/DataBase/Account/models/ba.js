import * as baAccountService from '@/services/api'
import { PAGE_SIZE } from "../../../constants";

export default {
  namespace: 'ba',
  state: {
    pageNum: null,
    pageSize: null,
    totalPage: null,
    totalCount: null,
    dataList: [],
  },
  effects: {
    * getBaAccountList({ payload }, { call, put }) {
      const response = yield call(baAccountService.queryAccount, payload);
      // console.log('dva', response);
      yield put({
        type: 'save',
        payload: response.data
      })
    },
    * addBa({ payload }, { call, put, select }) {
      yield call(baAccountService.add, payload);
      const page = yield select(state => state.ba.pageNum);
      yield put({
        type: 'getBaAccountList',
        payload: {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "type": 4
        }
      })
    },
    * bindBa({ payload }, { call, put, select }) {
      let newPayload;
      yield call(baAccountService.baBindStore, payload);
      const page = yield select(state => state.ba.pageNum);
      if (Object.keys(payload).indexOf('checkVal') > -1) {
        newPayload =  {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "type": 4,
          "ownerName": payload.checkVal.ownerName,
          "storeCode": payload.checkVal.storeCode
        }
      } else {
        newPayload =  {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "type": 4
        }
      }
      yield put({
        type: 'getBaAccountList',
        payload: newPayload
      })
    },
    * getAimBa({ payload }, { call, put }) {
      const response = yield call(baAccountService.query, payload);
      yield put({
        type: 'clear'
      });
      yield put({
        type: 'save',
        payload: response.data
      });
    },
    * modifierBa({ payload }, { call, put, select }) {
      let newPayload;
      yield call(baAccountService.modifier, payload.values);
      const page = yield select(state => state.ba.pageNum);
      if (Object.keys(payload).indexOf('checkVal') > -1) {
        newPayload = {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "type": 4,
          "ownerName": payload.checkVal.ownerName,
          "storeCode": payload.checkVal.storeCode
        }
      } else {
        newPayload = {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
        }
      }
      yield put({
        type: 'getBaAccountList',
        payload: newPayload
      })
    },
    * statusControl({ payload }, { call, put, select }) {
      let newPayload;
      yield call(baAccountService.StatusControl, payload.value);
      const page = yield select(state => state.ba.pageNum);
      if (Object.keys(payload).indexOf('checkVal') > -1) {
        newPayload = {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "type": 4,
          "ownerName": payload.checkVal.ownerName,
          "storeCode": payload.checkVal.storeCode
        }
      } else {
        newPayload = {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
        }
      }
      yield put({
        type: 'getBaAccountList',
        payload: newPayload
      })
    },
    // ba升级为店长
    * baUpgrade({ payload }, { call, put, select }) {
      let newPayload;
      yield call(baAccountService.baUpgrade, payload.fid);
      const page = yield select(state => state.ba.pageNum);
      if (Object.keys(payload).indexOf('checkVal') > -1) {
        newPayload = {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "type": 4,
          "ownerName": payload.checkVal.ownerName,
          "storeCode": payload.checkVal.storeCode
        }
      } else {
        newPayload = {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
        }
      }
      yield put({
        type: 'getBaAccountList',
        payload: newPayload
      })
    },
    * bindStore({ payload }, { call, put, select }) {
      let newPayload;
      yield call(baAccountService.baBindStore, payload.values);
      const page = yield select(state => state.ba.pageNum);
      if (Object.keys(payload).indexOf('checkVal') > -1) {
        newPayload = {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "type": 4,
          "ownerName": payload.checkVal.ownerName,
          "storeCode": payload.checkVal.storeCode
        }
      } else {
        newPayload = {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
        }
      }
      yield put({
        type: 'getBaAccountList',
        payload: newPayload
      })
    },
    * derive({ payload, callback }, { call }) {
      const response = yield call(baAccountService.baDerive, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
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
        if (pathname === '/database/account/ba') {
          let page = query.page;
          const { storeCode, ownerName} = query;
          let arr = Object.keys(query);
          if (arr.length === 0) {
            page = 1
          }
          let payload = {
            "pageNum": page,
            "pageSize": PAGE_SIZE,
            "type": 4,
            storeCode,
            ownerName
          };
          dispatch({ type: 'getBaAccountList', payload })
        }
      })
    }
  }
}
