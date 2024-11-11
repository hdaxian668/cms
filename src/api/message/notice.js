import req from '@/util/request';
import qs from 'qs';

/**
 * 模拟数据
 * @param data
 */
export function edit(data) {
  return req({
    url: '/message/reminder-edit',
    method: 'get',
    params: data
  })
}
export function save(data) {
  return req({
    url: '/message/reminder-save',
    method:'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/message/notice.js