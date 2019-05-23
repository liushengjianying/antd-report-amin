import * as activityService from '@/services/api'
import { PAGE_SIZE } from "../../constants";

export default {
  namespace: 'activity',
  state: {
    activityObj: {
      pageNum: null,
      pageSize: null,
      totalPage: null,
      totalCount: null,
      dataList: [],
    },
    // 商品展示对象
    goods: {
      pageNum: null,
      pageSize: null,
      totalPage: null,
      totalCount: null,
      dataList: [],
    },
    stores: {
      pageNum: null,
      pageSize: null,
      totalPage: null,
      totalCount: null,
      dataList: [],
    },
    storeList: [],
    anotherStr: ''
  },
  effects: {
    * getActivityList({ payload }, { call, put }) {
      const response = yield call(activityService.queryActivity, payload);
      yield put({
        type: 'saveActivity',
        payload: response.data
      })
    },
    * getAimActivity({ payload }, { call, put }) {
      const response = yield call(activityService.queryActivity, payload);
      yield put({
        type: 'clearActivity'
      });
      yield put({
        type: 'saveActivity',
        payload: response.data
      });
    },
    * modifierOrChangeActivity({ payload }, { call, put, select }) {
      yield call(activityService.addOrModifier, payload);
      const page = yield select(state => state.activity.activityObj.pageNum);
      yield put({
        type: 'getActivityList',
        payload: {
          "pageNum": page,
          "pageSize": PAGE_SIZE
        }
      })
    },
    * getGoodsList({ payload }, { call, put }) {
      const response = yield call(activityService.queryActGoods, payload);
      yield put({
        type: 'saveGoods',
        payload: response.data
      })
    },
    * saveGoodsCredit({ payload }, { call, put, select }) {
      yield call(activityService.saveCredit, payload);
      const page = yield select(state => state.activity.goods.pageNum);
      yield put({
        type: 'getGoodsList',
        payload: {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "prodisId": payload.prodisId
        }
      })
    },
    * getAimGoods({ payload }, { call, put }) {
      const response = yield call(activityService.queryActGoods, payload);
      yield put({
        type: 'clearGoods'
      });
      yield put({
        type: 'saveGoods',
        payload: response.data
      });
    },
    * getStoreList({ payload }, { call, put }) {
      const response = yield call(activityService.queryActStore, payload);
      yield put({
        type: 'saveStore',
        payload: response.data
      })
    },
    * getAimStore({ payload }, { call, put }) {
      const response = yield call(activityService.queryActStore, payload);
      yield put({
        type: 'clearStore'
      });
      yield put({
        type: 'saveStore',
        payload: response.data
      });
    },
    * ActStatusControl({ payload }, { call, put, select }) {
      yield call(activityService.actStatus, payload);
      const page = yield select(state => state.activity.activityObj.pageNum);
      yield put({
        type: 'getActivityList',
        payload: {
          "pageNum": page,
          "pageSize": PAGE_SIZE
        }
      })
    },
    * goodsStatusControl({ payload }, { call, put, select }) {
      yield call(activityService.actGoodsStatus, payload);
      const page = yield select(state => state.activity.goods.pageNum);
      yield put({
        type: 'getGoodsList',
        payload: {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "prodisId": payload.prodisId
        }
      })
    },
    * storeStatusControl({ payload }, { call, put, select }) {
      yield call(activityService.actStoreStatus, payload);
      const page = yield select(state => state.activity.stores.pageNum);
      yield put({
        type: 'getStoreList',
        payload: {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "prodisId": payload.prodisId
        }
      })
    },
    * searchShop({ payload }, { call, put }) {
      const response = yield call(activityService.queryStore, payload);
      yield put({
        type: 'saveSearch',
        payload: response.data
      })
    },
    * saveAnotherStr({ payload }, { _, put }) {
      yield put({
        type: 'saveAnotherStore',
        payload
      })
    },
    * addStore({ payload }, { call, put, select }) {
      yield call(activityService.addActStore, payload);
      const page = yield select(state => state.activity.stores.pageNum);
      yield put({
        type: 'getStoreList',
        payload: {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "prodisId": payload.fid
        }
      })
    },
  },
  reducers: {
    saveAnotherStore(state, { payload }) {
      return {
        ...state,
        anotherStr: payload.anotherStr
      }
    },
    saveSearch(state, { payload }) {
      return {
        ...state,
        storeList: payload
      }
    },
    saveActivity(state, { payload }) {
      return {
        ...state,
        activityObj: payload
      }
    },
    clearActivity(state) {
      return {
        ...state,
        activityObj: {
          pageNum: null,
          pageSize: null,
          totalPage: null,
          totalCount: null,
          dataList: [],
        }
      }
    },
    saveGoods(state, { payload }) {
      return {
        ...state,
        goods: payload
      }
    },
    clearGoods(state) {
      return {
        ...state,
        goods: {
          pageNum: null,
          pageSize: null,
          totalPage: null,
          totalCount: null,
          dataList: [],
        }
      }
    },
    saveStore(state, { payload }) {
      return {
        ...state,
        stores: payload
      }
    },
    clearStore(state) {
      return {
        ...state,
        stores: {
          pageNum: null,
          pageSize: null,
          totalPage: null,
          totalCount: null,
          dataList: [],
        }
      }
    },
    // saveCredits(state, { payload }) {
    //   return {
    //     ...state,
    //     uploadGoods: payload
    //   }
    // },
    reset(state) {
      return {
        ...state,
        goods: {
          pageNum: null,
          pageSize: null,
          totalPage: null,
          totalCount: null,
          dataList: [],
        },
      }
    },
    // saveCreditList(state, { payload }) {
    //   return {
    //     ...state,
    //     uploadGoods: payload,
    //     goods: {
    //       pageNum: null,
    //       pageSize: null,
    //       totalPage: null,
    //       totalCount: null,
    //       dataList: [],
    //     }
    //   }
    // },
    saveGoods(state, { payload }) {
      return {
        ...state,
        goods: payload
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/credits/activity') {

          let arr = Object.keys(query);
          let finalPage = Object.values(query)[0];
          let prodisId = Object.values(query)[1];
          let payload;
          let finalType = 'getActivityList';

          if (arr.length === 0) {
            finalPage = 1;
            payload = {
              "pageNum": finalPage,
              "pageSize": PAGE_SIZE,
            };
          }

          switch (arr[0]) {
            case 'actPage':
              finalType = 'getActivityList';
              payload = {
                "pageNum": finalPage,
                "pageSize": PAGE_SIZE,
                "disName": query.activityName
              };
              break;
            case 'goodsPage':
              finalType = 'getGoodsList';
              payload = {
                "pageNum": finalPage,
                "pageSize": PAGE_SIZE,
                "prodisId": prodisId,
                "searchStr": query.goodsName,
              };
              break;
            case 'storePage':
              finalType = 'getStoreList';
              payload = {
                "pageNum": finalPage,
                "pageSize": PAGE_SIZE,
                "prodisId": prodisId,
                "searchStr": query.actstoreName,
              };
              break;
          }

          dispatch({ type: finalType, payload })
        }
      })
    }
  }
}
