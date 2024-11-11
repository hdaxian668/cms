/**
 * 登录请求
 */
import req from '@/util/request';
import qs from 'qs';


export function login(data) {
  return req({
    url: '/main/login',
    method:'post',
    data: qs.stringify(data)
  })
}
export function emailotp(data) {
  return req({
    url: '/otp/emailotp',
    method:'post',
    data: qs.stringify(data)
  })
}
export function mobileotp(data) {
  return req({
    url: '/otp/mobileotp',
    method:'post',
    data: qs.stringify(data)
  })
}
export function verify(data) {
  return req({
    url: '/otp/verify',
    method:'post',
    data: qs.stringify(data)
  })
}
export function logout() {
  return req({
    url: '/main/logout',
    method:'get',
  })
}



// WEBPACK FOOTER //
// ./src/api/login/login.js