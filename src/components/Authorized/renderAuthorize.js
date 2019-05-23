/* eslint-disable import/no-mutable-exports */
let CURRENT = 'NULL';
/**
 * use  authority or getAuthority
 * @param {string|()=>String} currentAuthority
 */
  // renderAuthorize应该是高阶函数，Authorized是权限组件，currentAuthority权限
  // currentAuthority，在modal中,login触发，在localstorage中存入权限
  // basiclayout中从后台拿到了配置菜单，CURRENT中这时已经存入了权限，和菜单进行比对，有权限的能进入，不能的点击就会触发异常页
const renderAuthorize = Authorized => currentAuthority => {
  if (currentAuthority) {
    if (typeof currentAuthority === 'function') {
      CURRENT = currentAuthority();
    }
    if (
      Object.prototype.toString.call(currentAuthority) === '[object String]' ||
      Array.isArray(currentAuthority)
    ) {
      CURRENT = currentAuthority;
    }
  } else {
    CURRENT = 'NULL';
  }
  return Authorized;
};

export { CURRENT };
export default Authorized => renderAuthorize(Authorized);
