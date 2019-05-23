import * as salesService from '@/services/api'
import { PAGE_SIZE } from "../../../constants";

export default {
    namespace: 'salesReport',
    state: {
        pageNum: '',
        totalCount: '',
        // 代理商
        AgentList: [],
        // 商品
        product: [],
        tableList: []
    },
    effects: {
        *searchAgent({ payload }, { call, put }) {
            const response = yield call(salesService.queryAgentTable, payload);
            console.log(response.data)
            yield put({
                type: 'saveAgent',
                payload: response.data
            })
        },
        *searchProduct({ _ }, { call, put }) {
            const response = yield call(salesService.queryProduct)
            yield put({
                type: 'saveProduct',
                payload: response.data
            })
        },
        *searchReport({ payload }, { call, put }) {
            const response = yield call(salesService.querySalesReport, payload)
            yield put({
                type: 'saveReport',
                payload: response.data
            })
        },
    },
    reducers: {
        saveAgent(state, { payload }) {
            return {
                ...state,
                AgentList: payload.dataList
            }
        },
        saveProduct(state, { payload }) {
            return {
                ...state,
                product: payload
            }
        },
        saveReport(state, { payload }) {
            return {
                ...state,
                tableList: payload.dataList,
                pageNum: payload.pageNum,
                totalCount: payload.totalCount
            }
        }
    }
}
