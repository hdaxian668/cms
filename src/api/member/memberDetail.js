
import req from '@/util/request';
import qs from 'qs';

/**
 * 展示用户信息，不能新建
 * @param data
 */
export function edit(data) {
  return req({
    url: '/customer/detail',
    method: 'get',
    params: data
  })
}
/**
 * 保存编辑
 * @param data
 */
export function save(data) {
  return req({
    url: '/customer/save',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * Activate Email
 * @param id - 用戶ID
 */
export function activateEmail(id) {
  let data = {
    id: id,
  };
  return req({
    url: '/customer/activate-email',
    method: 'get',
    params: data,
  })
}

/**
 * 重置密碼
 * @param id - 用戶ID
 */
export function resetPassword(id) {
  let data = {
    id: id,
  };
  return req({
    url: '/customer/update-password',
    method: 'get',
    params: data,
  })
}

/**
 * 获取默认列表数据
 */
export function getDefaultArray() {
  return req({
    url: '/setting/switch-array',
    method: 'get',
  })
}




// WEBPACK FOOTER //
// ./src/api/member/memberDetail.js