import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

// 获取用户信息 basiclayout 界面
export async function queryTrueUser() {
  return request('/api/user/userInfo', {
    method: 'GET'
  })
}
