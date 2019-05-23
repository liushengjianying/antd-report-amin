import * as goodsService from '@/services/api'
import { PAGE_SIZE } from "../../constants";

export default {
  namespace: 'goods',
  state: {
    pageNum: null,
    pageSize: null,
    totalPage: null,
    totalCount: null,
    dataList: []
  },
  effects: {
    * getGoodsList({ payload }, { call, put }) {
      const response = yield call(goodsService.queryGoodsList, payload);
      yield put({
        type: 'save',
        payload: response.data
      })
    },
    * addGoods({ payload }, { call, put, select }) {
      yield call(goodsService.addGoods, payload);
      const page = yield select(state => state.goods.pageNum);
      yield put({
        type: 'getGoodsList',
        payload: {
          "pageNum": page,
          "pageSize": PAGE_SIZE
        }
      })
    },
    * getAimTable({ payload }, { call, put }) {
      const response = yield call(goodsService.queryGoodsTable, payload);
      yield put({
        type: 'clear'
      });
      yield put({
        type: 'save',
        payload: response.data
      });
    },
    * modifierGoods({ payload }, { call, put, select }) {
      let newPayload;
      yield call(goodsService.modifierGoods, payload);
      const page = yield select(state => state.goods.pageNum);
      if (Object.keys(payload).indexOf('goods') > -1) {
        newPayload = {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "proName": payload.goods
        }
      } else {
        newPayload = {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
        }
      }
      yield put({
        type: 'getAimTable',
        payload: newPayload
      })
    },
    * statusControl({ payload }, { call, put, select }) {
      let newPayload;
      yield call(goodsService.goodsStatusControl, payload);
      const page = yield select(state => state.goods.pageNum);
      if (Object.keys(payload).indexOf('goods') > -1) {
        newPayload = {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "proName": payload.goods
        }
      } else {
        newPayload = {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
        }
      }
      yield put({
        type: 'getAimTable',
        payload: newPayload
      })
    }
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
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
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/database/goods') {
          // 点击左侧导航栏后回到第一页
          let page = query.page;
          let arr = Object.keys(query);
          if (arr.length === 0) {
            page = 1
          }
          let payload = {
            "pageNum": page,
            "pageSize": PAGE_SIZE,
            "proName": query.goods
          };
          dispatch({ type: 'getGoodsList', payload })
        }
      })
    }
  }
}
