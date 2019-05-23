import * as agentService from '@/services/api'
// import { PAGE_SIZE } from "../../constants";

export default {
  namespace: 'area',
  state: {
    areaList: []
  },
  effects: {
    *getAreaList(_, { call, put }) {
      const response = yield call(agentService.queryAreaList);
      console.log('area', response.data);
      yield put({
        type: 'save',
        payload: response.data
      })
    }
  },
  reducers: {
    save(state, { payload }) {
      let abc = {...state, ...payload};
      console.log('abc', abc);
      return {
        ...state,
        areaList: payload
      }
    }
  }
}
