import * as agentService from '@/services/api'
import { PAGE_SIZE } from "../../constants";

export default {
  namespace: 'agent',
  state: {
    pageNum: null,
    pageSize: null,
    totalPage: null,
    totalCount: null,
    dataList: [],
    // allList是模糊查询用的，等以后改接口用的着
    allList: [],
  },
  effects: {
    // payload是个对象，key是pageNum和pageSize，分页获取
    * getTableList({ payload }, { call, put }) {
      const response = yield call(agentService.queryAgentTable, payload);
      // console.log('dva', response);
      yield put({
        type: 'save',
        payload: response.data
      })
    },
    // 获取全部代理商
    * getAllTableList(_, { call, put }) {
      const response = yield call(agentService.queryAllAgentList);
      console.log('aaaaaa', response);
      yield put({
        type: 'saveAllAgent',
        payload: response.data
      })
    },
    *addAgent({ payload }, { call, put, select }) {
      yield call(agentService.addAgent, payload);
      const page = yield select(state => state.agent.pageNum);
      console.log('pagenum', page);
      yield put({
        type: 'getTableList',
        payload: {
          "pageNum": page,
          "pageSize": PAGE_SIZE
        }
      })
    },
    *getAimTable({ payload }, { call, put }) {
      const response = yield call(agentService.queryAgentTable, payload);
      yield put({
        type: 'clear'
      });
      yield put({
        type: 'save',
        payload: response.data
      });
    },
    *modifierAgent({ payload }, { call, put, select }) {
      let newPayload;
      yield call(agentService.modifierAgent, payload);
      const page = yield select(state => state.agent.pageNum);
      if (Object.keys(payload).indexOf('agent') > -1) {
        newPayload =  {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "agentName": payload.agent
        }
      } else {
        newPayload =  {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
        }
      }
      yield put({
        type: 'getAimTable',
        payload: newPayload
      })
    },
    *statusControl({ payload }, { call, put, select }) {
      let newPayload;
      yield call(agentService.AgentStatusControl, payload);
      const page = yield select(state => state.agent.pageNum);
      if (Object.keys(payload).indexOf('agent') > -1) {
        newPayload =  {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "agentName": payload.agent
        }
      } else {
        newPayload =  {
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
    saveAllAgent(state, { payload }) {
      return {
        ...state,
        allList: payload
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/database/agent') {
          // 点击左侧导航栏后回到第一页
          let page = query.page;
          let arr = Object.keys(query);
          if (arr.length === 0) {
            page = 1
          }
          let payload = {
            "pageNum": page,
            "pageSize": PAGE_SIZE,
            "agentName": query.agent
          };
          dispatch({ type: 'getTableList', payload })
        }
      })
    }
  }
}
