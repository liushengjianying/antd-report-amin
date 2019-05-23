import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
// import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import * as loginService from '@/services/api'
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined
  },

  effects: {
    *logining({ payload }, { call, put }) {
      const response = yield call(loginService.trueLogin, payload);
      localStorage.setItem('fid', response.data.userInfo.fid);
      // const response = yield call(fakeAccountLogin, payload);
      // console.log('==========', response.data);
      yield put({
        type: 'changeLoginStatus',
        payload: response.data,
      });
      // Login successfully
      if (response.data.status === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
        // yield put({
        //   type: 'getUser',
        //   payload: {
        //     'userInfo': response.data.userInfo
        //   }
        // })
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { call, put }) {
      yield call(loginService.loginout);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          // search: stringify({
          //   redirect: window.location.href,
          // }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      // localStorage.removeItem("access_token");
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    // getUser(state, { payload }) {
    //   return {
    //     ...state,
    //     userInfo: payload.userInfo
    //   }
    // }
  },
};
