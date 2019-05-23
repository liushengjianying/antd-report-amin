import { stringify } from 'qs';
import request from '@/utils/request';
import { func } from 'prop-types';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

// 这里开始是真实的后台接口
// 代理商table分页, 查询
export async function queryAgentTable(params) {
  return request('/api/agent/pageList', {
    method: 'POST',
    body: params
  })
}

// 代理商新增
export async function addAgent(params) {
  return request('/api/agent/insert', {
    method: 'POST',
    body: params
  })
}

// 获取全部代理商
export async function queryAllAgentList() {
  return request('/api/agent/agentInfo', {
    method: 'GET'
  })
}

// 代理商，查询大区
export async function queryAreaList() {
  return request('/api/agent/areaInfo', {
    method: 'GET'
  })
}

// 代理商账号状态，启用/禁用
export async function AgentStatusControl(params) {
  const { type, fid } = params;
  return request(`/api/agent/changeStatus?type=${type}&&fid=${fid}`, {
    method: 'POST'
  })
}

// 代理商修改
export async function modifierAgent(params) {
  return request('/api/agent/updateAgent', {
    method: 'POST',
    body: params
  })
}

// 门店列表查询，模糊查询
export async function queryShopList(params) {
  return request('/api/store/pageList', {
    method: 'POST',
    body: params
  })
}

// 新增门店
export async function addStore(params) {
  return request('/api/store/insert', {
    method: 'POST',
    body: params
  })
}

// 门店账号状态
export async function ShopStatusControl(params) {
  const { type, fid } = params;
  return request(`/api/store/changeStatus?type=${type}&&fid=${fid}`, {
    method: 'POST'
  })
}

// 修改门店
export async function modifierShop(params) {
  return request('/api/store/updateStore', {
    method: 'POST',
    body: params
  })
}

// 获取所有门店
export async function queryAllShop() {
  return request('/api/store/storeInfo', {
    method: 'GET'
  })
}

// 获取商品
export async function queryGoodsList(params) {
  return request('/api/proInfo/pageList', {
    method: 'POST',
    body: params
  })
}

// 新增商品
export async function addGoods(params) {
  return request('/api/proInfo/insert', {
    method: 'POST',
    body: params
  })
}

// 修改商品
export async function modifierGoods(params) {
  return request('/api/proInfo/updatePro', {
    method: 'POST',
    body: params
  })
}

// 商品启用/禁用
export async function goodsStatusControl(params) {
  const { type, fid } = params;
  return request(`/api/proInfo/changeStatus?type=${type}&&fid=${fid}`, {
    method: 'POST'
  })
}

// 查询商品
export async function queryGoodsTable(params) {
  return request('/api/proInfo/pageList', {
    method: 'POST',
    body: params
  })
}

// 这里开始是账号管理
// ba 店长 代理商 账号模糊查询
export async function queryAccount(params) {
  return request('/api/owner/listAccount', {
    method: 'POST',
    body: params
  })
}

// 新增
export async function add(params) {
  return request('/api/owner/ownerInsert', {
    method: 'POST',
    body: params
  })
}

// 修改
export async function modifier(params) {
  return request('/api/owner/updateAccount', {
    method: 'POST',
    body: params
  })
}

// 账号状态
export async function StatusControl(params) {
  const { type, fid } = params;
  return request(`/api/owner/changeStatus?type=${type}&&fid=${fid}`, {
    method: 'POST'
  })
}

// 查询
export async function query(params) {
  return request('/api/owner/listAccount', {
    method: 'POST',
    body: params
  })
}

// ba升级为店长
export async function baUpgrade(params) {
  // const { fid } = params;
  return request(`/api/owner/baToMa?fid=${params}`, {
    method: 'POST'
  })
}

// ba绑定门店
export async function baBindStore(params) {
  const { fid, storeCode } = params;
  return request(`/api/owner/bindBaStore?fid=${fid}&&storeCode=${storeCode}`, {
    method: 'POST'
  })
}

// 门店查询，分绑定和未绑定两个数组
export async function queryStoreType(params) {
  const { typeCode } = params;
  return request(`/api/owner/storeBindInfo?typeCode=${typeCode}`, {
    method: 'GET'
  })
}

// 代理商绑定门店
// 一个人绑定多个代理商
export async function AccountBind(params) {
  const { typeCode, code, type } = params;
  return request(`/api/owner/changeBind?typeCode=${typeCode}&&code=${code}&&type=${type}`, {
    method: 'POST'
  })
}

// 代理商查询
export async function queryAgentType(params) {
  const { typeCode } = params;
  return request(`/api/owner/agentBindInfo?typeCode=${typeCode}`, {
    method: 'GET'
  })
}

// 登录
export async function trueLogin(params) {
  return request('/api/user/login', {
    method: 'POST',
    body: params
  })
}

// 注销
export async function loginout() {
  const fid = localStorage.getItem('fid');
  return request(`/api/user/logout?fid=${fid}`, {
    method: 'POST'
  })
}

// 改密码
export async function changePassword(params) {
  return request('/api/user/changePwd', {
    method: 'POST',
    body: params
  })
}

// 积分活动列表
export async function queryActivity(params) {
  return request('/api/prodis/pageList', {
    method: 'POST',
    body: params
  })
}

// 新增或修改积分活动，fid值null时候新增
export async function addOrModifier(params) {
  return request('/api/prodis/insetOrUpdate', {
    method: 'POST',
    body: params
  })
}

// 积分活动的状态 删除 上线 下线
export async function actStatus(params) {
  const { type, fid } = params;
  return request(`/api/prodis/changeStatus?type=${type}&&fid=${fid}`, {
    method: 'POST',
  })
}

// 积分活动绑定的商品列表
export async function queryActGoods(params) {
  return request('/api/prodis/pageListCredit', {
    method: 'POST',
    body: params
  })
}

// 修改商品积分
export async function saveCredit(params) {
  const { fid, credit} = params;
  return request(`/api/prodis/changeCredit?fid=${fid}&&credit=${credit}`, {
    method: 'POST'
  })
}

// 修改积分中商品状态
export async function actGoodsStatus(params) {
  const { fid, type} = params;
  return request(`/api/prodis/changeCreditStatus?type=${type}&&fid=${fid}`, {
    method: 'POST'
  })
}

// 查询积分的门店
export async function queryActStore(params) {
  return request('/api/prodis/pageListProdisStore', {
    method: 'POST',
    body: params
  })
}

// 积分门店的上线下线
export async function actStoreStatus(params) {
  const { fid, type} = params;
  return request(`/api/prodis/changeProdisStoreStatus?type=${type}&&fid=${fid}`, {
    method: 'POST'
  })
}

// Ba账号导出
export async function baDerive(params) {
  const { storeCode, ownerName} = params;
  return request(`/api/owner/exportBa?storeCode=${storeCode}&&ownerName=${ownerName}`, {
    method: 'GET'
  })
}

// 门店导出
export async function ShopDerive(params) {
  const { agentCode, storeName} = params;
  return request(`/api/store/exportStore?agentCode=${agentCode}&&storeName=${storeName}`, {
    method: 'GET'
  })
}

// 获取省份
export async function getProvince() {
 return request('/api/provinces/getProvince', {
   method: 'GET'
 })
}

// 获取城市
export async function getCity(params) {
  const { id } = params;
  return request(`/api/provinces/getCity?id=${id}`, {
    method: 'GET'
  })
}

// 新增门店活动
export async function addActStore(params) {
  const { fid, storeCode } = params;
  return request(`/api/prodis/addStore?fid=${fid}&&storeCode=${storeCode}`, {
    method: 'POST'
  })
}

// 搜索门店 最终确定接口
export async function queryStore(params) {
  const { searchStr } = params;
  return request(`/api/store/storeInfo?searchStr=${searchStr}`, {
    method: 'GET'
  })
}

// 返回门店名，用来增加假数据
export async function getStoreName(params) {
  const { storeCode } = params;
  return request(`/api/store/bindAddStore?storeCode=${storeCode}`, {
    method: 'GET'
  })
}

// 返回代理商名，用来增加假数据
export async function getAgentName(params) {
  const { agentCode } = params;
  return request(`/api/agent/bindAddAgent?agentCode=${agentCode}`, {
    method: 'GET'
  })
}

// 搜索全部商品
export async function queryProduct() {
  return request(`/api/proInfo/proInfo`, {
    method: 'GET'
  })
}

// 销售报表
export async function querySalesReport(params) {
  return request('/api/report/sales', {
    method: 'POST',
    body: params
  })
}

// 获取大区
export async function getArea() {
  return request(`/api/agent/areaInfo`, {
    method: 'GET'
  })
}

// 获取地区
export async function getDirection(params) {
  const { id } = params;
  return request(`/api/agent/areaInfo?id=${id}`, {
    method: 'GET'
  })
}