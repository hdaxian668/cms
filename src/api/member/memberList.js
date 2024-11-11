import req from '@/util/request';
import qs from 'qs';

/**
 * 获取会员列表
 * @param data - 搜索信息、表格需要数据
 */
export function customerData(data) {
  return req({
    url: '/customer/list-data',
    method: 'get',
    params: data
  })
}

export function bulkSendValidEmail(data) {
  return req({
    url: '/customer/bulk-send-valid-email',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 选择列表
 */
export function searchLists() {
  return req({
    url: '/customer/search',
    method: 'get',
  })
}

/**
 * 删除用户信息
 */
export function deleteItem(id) {
  const data = {
    id,
  };
  return req({
    url: '/customer/delete',
    method: 'post',
    data: qs.stringify(data),
  })
}
/**
 * 删除用户信息
 */
export function resetItem(id) {
  const data = {
    id,
  };
  return req({
    url: '/customer/reset',
    method: 'post',
    data: qs.stringify(data),
  })
}





// WEBPACK FOOTER //
// ./src/api/member/memberList.js