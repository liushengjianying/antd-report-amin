import * as shopService from '@/services/api'
import { PAGE_SIZE } from "../../constants";
import { message } from "antd";

function err(response) {
  if (response.code === 9999) {
    let err = (
      <span>{response.msg}</span>
    );
    message.error(err, 3);
  }
}

export default {
  namespace: 'shop',
  state: {
    pageNum: null,
    pageSize: null,
    totalPage: null,
    totalCount: null,
    dataList: [],
    anotherStr: '',
    AgentList: [],
    // 查询省份
    provinceList: [],
    // 查询城市
    cityList: [],
    // 大区
    areaList: [],
    // 地区
    directionList: []
  },
  effects: {
    * saveAnotherStr({ payload }, { _, put }) {
      yield put({
        type: 'saveAnotherAgent',
        payload
      })
    },
    *searchAgent({ payload }, { call, put }) {
      const response = yield call(shopService.queryAgentTable, payload);
      yield put({
        type: 'saveSearch',
        payload: response.data
      })
    },
    * getShopList({ payload }, { call, put }) {
      const response = yield call(shopService.queryShopList, payload);
      yield put({
        type: 'save',
        payload: response.data
      })
    },
    * addShop({ payload }, { call, put, select }) {
      yield call(shopService.addStore, payload);
      const page = yield select(state => state.shop.pageNum);
      console.log('1111111111', page)
      yield put({
        type: "getShopList",
        payload: {
          "pageNum": page,
          "pageSize": PAGE_SIZE
        }
      })
    },
    * getAimShop({ payload }, { call, put }) {
      const response = yield call(shopService.queryShopList, payload);
      yield put({
        type: 'save',
        payload: response.data
      });
    },
    * modifierShop({ payload }, { call, put, select }) {
      let newPayload;
      yield call(shopService.modifierShop, payload.values);
      const page = yield select(state => state.shop.pageNum);
      if (Object.keys(payload).indexOf('checkVal') > -1) {
        newPayload = {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "storeName": payload.checkVal.storeName,
          "agentCode": payload.checkVal.agentCode
        }
      } else {
        newPayload = {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
        }
      }
      yield put({
        type: 'getShopList',
        payload: newPayload
      });
    },
    * statusControl({ payload }, { call, put, select }) {
      let newPayload;
      yield call(shopService.ShopStatusControl, payload.value);
      const page = yield select(state => state.shop.pageNum);
      if (Object.keys(payload).indexOf('checkVal') > -1) {
        newPayload = {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "storeName": payload.checkVal.storeName,
          "agentCode": payload.checkVal.agentCode
        }
      } else {
        newPayload = {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
        }
      }
      yield put({
        type: 'getShopList',
        payload: newPayload
      });
    },
    * derive({ payload, callback }, { call }) {
      const response = yield call(shopService.ShopDerive, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    * province(_, { call, put }) {
      const response = yield call(shopService.getProvince);
      yield put({
        type: 'saveProvince',
        payload: response.data
      })
    },
    * city({ payload }, { call, put }) {
      const response = yield call(shopService.getCity, payload);
      // yield put({
      //   type: 'clearCity'
      // });
      yield put({
        type: 'saveCity',
        payload: response.data
      })
    },
    * getArea({ _ }, { call, put }) {
      const response = yield call(shopService.getArea);
      yield put({
        type: 'saveArea',
        payload: response.data
      })
    },
    * getDirection({payload}, { call, put, select }) {
      const response = yield call(shopService.getDirection, payload)
      yield put({
        type: 'saveDirection',
        payload: response.data
      })
    }
  },
  reducers: {
    clearCity(state) {
      return {
        ...state,
        cityList: []
      }
    },
    saveCity(state, { payload }) {
      return {
        ...state,
        cityList: payload
      }
    },
    saveProvince(state, { payload }) {
      return {
        ...state,
        provinceList: payload
      }
    },
    saveSearch(state, { payload }) {
      return {
        ...state,
        AgentList: payload.dataList
      }
    },
    saveAnotherAgent(state, { payload }) {
      return {
        ...state,
        anotherStr: payload.anotherStr
      }
    },
    save(state, { payload }) {
      return {
        ...state,
        pageNum: payload.pageNum,
        pageSize: payload.pageSize,
        totalPage: payload.totalPage,
        totalCount: payload.totalCount,
        dataList: payload.dataList,
      }
    },
    clear() {
      return {
        pageNum: null,
        pageSize: null,
        totalPage: null,
        totalCount: null,
        dataList: []
      }
    },
    saveArea(state, { payload }) {
      return {
        ...state,
        areaList: payload
      }
    },
    saveDirection(state, {payload}) {
      return {
        ...state,
        directionList: payload
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/database/shop') {
          let page = query.page;
          const { agentCode, storeName } = query;
          let arr = Object.keys(query);
          if (arr.length === 0) {
            page = 1
          }
          let payload = {
            "pageNum": page,
            "pageSize": PAGE_SIZE,
            agentCode,
            storeName
          };
          dispatch({
            type: 'getShopList',
            payload
          })
        }
      })
    }
  }
}
