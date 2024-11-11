import req from '@/util/request';
import qs from 'qs';

/**
 * 联络信息筛选条件
 */
export function selectLists() {
  return req({
    url: '/activity-contact/search-list',
    method: 'get',
  })
}

/**
 * 联络管理列表
 * @param data
 */
export function contactData(data) {
  return req({
    url: '/activity-contact/list-data',
    method: 'get',
    params: data,
  })
}

/**
 * 联络状态改变
 * @param id
 * @param status
 */
export function status(id,status) {
  let data = {
    id,
    status,
  };
  return req({
    url: '/activity-contact/change-contact-status',
    method: 'post',
    data: qs.stringify(data),
  })
}




// WEBPACK FOOTER //
// ./src/api/activity/contactList.js