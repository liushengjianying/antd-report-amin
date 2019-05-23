import * as StoreService from '@/services/api'
import { message } from 'antd'
// import { PAGE_SIZE } from "../../constants";

export default {
  namespace: 'store',
  state: {
    storeList: [], // 商店模糊查询
    storeArray: [], // 商店模糊查询换接口
    shopList: [],
    bindList: [],
    codeStr: '',
    storeStr: '',
    anotherStr: ''
  },
  effects: {
    * getAllShop(_, { call, put }) {
      const response = yield call(StoreService.queryAllShop);
      yield put({
        type: 'save',
        payload: response.data
      })
    },
    * getStoreByType({ payload }, { call, put }) {
      const response = yield call(StoreService.queryStoreType, payload);
      let bindList = response.data;
      yield put({
        type: 'saveType',
        payload: {
          bindList
        }
      })
    },
    * changeTargets({ payload }, { _, put, select }) {
      const AllList = yield select(state => state.store.AllList);
      const { targetKeys, agentType, storeType } = payload;
      yield put({
        type: 'targetsAndStr',
        payload: {
          AllList,
          targetKeys,
          agentType,
          storeType
        }
      });
    },
    * searchShop({ payload }, { call, put }) {
      const response = yield call(StoreService.queryShopList, payload);
      yield put({
        type: 'saveSearch',
        payload: response.data
      })
    },
    * saveStr({ payload }, { _, put }) {
      yield put({
        type: 'saveStoreStr',
        payload
      })
    },
    * saveAnotherStr({ payload }, { _, put }) {
      yield put({
        type: 'saveAnotherStore',
        payload
      })
    },
    * searchStore({ payload }, { call, put }) {
      const response = yield call(StoreService.queryStore, payload);
      yield put({
        type: 'saveStore',
        payload: response.data
      })
    },
    * addStoreCode({ payload }, { call, put, select }) {
      const response = yield call(StoreService.getStoreName, payload);
      const bindList = yield select(state => state.store.bindList);
      if (response.code === 1) {
        if (bindList.length === 0) {
          bindList.push({
            'storeCode': payload.storeCode,
            'storeName': response.data.storeName
          });
          yield put({
            type: 'controlStoreArray',
            payload: {
              bindList
            }
          });
        }

        if (bindList.length >= 1) {
          for (let i = 0; i < bindList.length; i++) {
            if (bindList[i].storeCode === payload.storeCode) {
             // message.error('不能重复绑定！');
              return;
            }
          }

          bindList.push({
            'storeCode': payload.storeCode,
            'storeName': response.data.storeName
          });
          yield put({
            type: 'controlStoreArray',
            payload: {
              bindList
            }
          });
        }
      }
    },
    * delStoreCode({ payload }, { call, put, select }) {
      const bindList = yield select(state => state.store.bindList);
      bindList.splice(payload.index, 1)
      yield put({
        type: 'controlStoreArray',
        payload: {
          bindList
        }
      });
    },
    * submitStore({ payload }, { call, put, select }) {
      const bindList = yield select(state => state.store.bindList);
      let arr = [];
      bindList.map((item) => {
        arr.push(item.storeCode)
      });
      arr.join(',');
      let newPayload = {
        ...payload,
        'code': arr
      };
      yield call(StoreService.AccountBind, newPayload);
    },
  },
  reducers: {
    controlStoreArray(state, { payload }) {
      return {
        ...state,
        bindList: payload.bindList
      }
    },
    saveStore(state, { payload }) {
      return {
        ...state,
        storeArray: payload
      }
    },
    saveAnotherStore(state, { payload }) {
      return {
        ...state,
        anotherStr: payload.anotherStr
      }
    },
    saveStoreStr(state, { payload }) {
      return {
        ...state,
        storeStr: payload.str
      }
    },
    saveSearch(state, { payload }) {
      return {
        ...state,
        storeList: payload.dataList
      }
    },
    save(state, { payload }) {
      return {
        ...state,
        shopList: payload
      }
    },
    saveType(state, { payload }) {
      const { bindList } = payload;
      return {
        ...state,
        bindList
      }
    }
  }
}
