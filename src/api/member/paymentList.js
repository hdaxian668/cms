import req from '@/util/request';
import qs from 'qs'

/**
 * 获取状态选择框数据
 */
export function searchList(memberid) {
  const data = {
    id: memberid,
  };
  return req({
    url: '/payment-record/search-list',
    method: 'get',
    params: data,
  })
}

/**
 * 获取列表
 * @param data - 获取
 */
export function paymentData(data) {

  return req({
    url: '/payment-record/list-data',
    method: 'get',
    params: data
  })
}

/**
 * 状态改变
 * @param id
 * @param status
 */
export function status(id,status) {
  const data = {
    id: id,
    status: status,
  };
  return req({
    url: '/payment-record/change-payment-status',
    method: 'post',
    data: qs.stringify(data),
  })
}

/**
 * 删除
 * @param id
 */
export function deleteItem(id) {
  const data = {
    id,
  };
  return req({
    url: '/payment-record/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/member/paymentList.js