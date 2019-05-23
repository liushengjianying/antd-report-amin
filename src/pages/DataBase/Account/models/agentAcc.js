import * as agentAccountService from '@/services/api'
import { PAGE_SIZE } from "../../../constants";
import { message } from "antd/lib/index";

export default {
  namespace: 'agentAcc',
  state: {
    pageNum: null,
    pageSize: null,
    totalPage: null,
    totalCount: null,
    dataList: [],
    bindList: [],
    agentListFather: [],
    agentList: []
  },
  effects: {
    *getAgentAccountList({ payload }, { call, put }) {
      const response = yield call(agentAccountService.queryAccount, payload);
      yield put({
        type: 'save',
        payload: response.data
      })
    },
    *add({ payload }, { call, put, select }) {
      yield call(agentAccountService.add, payload);
      const page = yield select(state => state.agentAcc.pageNum);
      yield put({
        type: 'getAgentAccountList',
        payload: {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "type": 1
        }
      })
    },
    *getAimAgent({ payload }, { call, put }) {
      const response = yield call(agentAccountService.query, payload);
      yield put({
        type: 'clear'
      });
      yield put({
        type: 'save',
        payload: response.data
      });
    },
    *modifier({ payload }, { call, put, select }) {
      let newPayload;
      yield call(agentAccountService.modifier, payload);
      const page = yield select(state => state.agentAcc.pageNum);
      if (Object.keys(payload).indexOf('AgentName') > -1) {
        newPayload =  {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "ownerName": payload.AgentName,
          "type": 1
        }
      } else {
        newPayload =  {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "type": 1
        }
      }
      yield put({
        type: 'getAimAgent',
        payload: newPayload
      })
    },
    *statusControl({ payload }, { call, put, select }) {
      let newPayload;
      yield call(agentAccountService.StatusControl, payload);
      const page = yield select(state => state.agentAcc.pageNum);
      if (Object.keys(payload).indexOf('AgentName') > -1) {
        newPayload =  {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "ownerName": payload.AgentName,
          "type": 1
        }
      } else {
        newPayload =  {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "type": 1
        }
      }
      yield put({
        type: 'getAimAgent',
        payload: newPayload
      });
    },
    *bindAgent({ payload }, { call, put, select }) {
      let newPayload;
      yield call(agentAccountService.AccountBind, payload);
      const page = yield select(state => state.agentAcc.pageNum);
      if (Object.keys(payload).indexOf('AgentName') > -1) {
        newPayload =  {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "ownerName": payload.AgentName,
          "type": 1
        }
      } else {
        newPayload =  {
          "pageNum": page,
          "pageSize": PAGE_SIZE,
          "type": 1
        }
      }
      yield put({
        type: 'getAimAgent',
        payload: newPayload
      })
    },
    * searchAgent({ payload }, { call, put }) {
      const response = yield call(agentAccountService.queryAgentTable, payload);
      yield put({
        type: 'saveAgent',
        payload: response.data.dataList
      })
    },
    * getAgentInfo({ payload }, { call, put }) {
      const response = yield call(agentAccountService.queryAgentType, payload);
      let agentList = response.data;
      yield put({
        type: 'controlAgentArray',
        payload: {
          agentList
        }
      })
    },
    * addAgentCode({ payload }, { call, put, select }) {
      const response = yield call(agentAccountService.getAgentName, payload);
      const agentList = yield select(state => state.agentAcc.agentList);
      if (response.code === 1) {
        if (agentList.length === 0) {
          agentList.push({
            'agentCode': payload.agentCode,
            'agentName': response.data.agentName
          });
          yield put({
            type: 'controlAgentArray',
            payload: {
              agentList
            }
          });
        }

        if (agentList.length >= 1) {
          for (let i = 0; i < agentList.length; i++) {
            if (agentList[i].agentCode === payload.agentCode) {
             // message.error('不能重复绑定！');
              return;
            }
          }

          agentList.push({
            'agentCode': payload.agentCode,
            'agentName': response.data.agentName
          });
          yield put({
            type: 'controlAgentArray',
            payload: {
              agentList
            }
          });
        }
      }
    },
    * delAgentCode({ payload }, { call, put, select }) {
      const agentList = yield select(state => state.agentAcc.agentList);
      agentList.splice(payload.index, 1);
      yield put({
        type: 'controlAgentArray',
        payload: {
          agentList
        }
      });
    },
    * submitAgent({ payload }, { call, put, select }) {
      const agentList = yield select(state => state.agentAcc.agentList);
      let arr = [];
      agentList.map((item) => {
        arr.push(item.agentCode)
      });
      arr.join(',');
      let newPayload = {
        ...payload,
        'code': arr
      };
      yield put({
        type: 'clearSelect'
      });
      yield call(agentAccountService.AccountBind, newPayload);
    },
  },
  reducers: {
    controlAgentArray(state, { payload }) {
      return {
        ...state,
        agentList: payload.agentList
      }
    },
    clearSelect(state) {
      return {
        ...state,
        agentListFather: []
      }
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    saveAgent(state, { payload }) {
      return {
        ...state,
        agentListFather: payload
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/database/account/agent') {
          let page = query.page;
          let arr = Object.keys(query);
          if (arr.length === 0 ) {
            page = 1
          }
          let payload = {
            "pageNum": page,
            "pageSize": PAGE_SIZE,
            "type": 1,
            "ownerName": query.AgentName
          };
          dispatch({ type: 'getAgentAccountList', payload })
        }
      })
    }
  }
}
