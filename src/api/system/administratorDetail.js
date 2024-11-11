import req from '@/util/request';
import qs from 'qs';

export function edit(data) {
  return req({
    url: '/user/edit',
    method: 'get',
    params: data
  })
}

export function check(data) {
  return req({
    url: '/user/check',
    method: 'get',
    params: data
  })
}

/**
 * 重置密碼
 * @param id
 * @param value
 */
export function changePwd(id, value) {
  const data = {
    id: id,
    newpwd: value,
  };
  return req({
    url: '/user/change-pwd',
    method:'post',
    data: qs.stringify(data)
  })
}

export function save(data) {
  return req({
    url: '/user/save',
    method:'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/system/administratorDetail.js