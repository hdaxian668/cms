import req from '@/util/request';
import qs from 'qs';

export function getPublicKey() {
  return req({
    url: '/main/public-key',
    method:'get'
  })
}
/**
 * 获取状态选择框数据
 */
export function getBaseInfo() {
  return req({
    url: '/main/get-userinfo',
    method: 'get',
  })
}

export function resetPwd(value) {
  const data = {
    newpwd: value,
  };
  return req({
    url: '/main/reset-pwd',
    method:'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/index.js