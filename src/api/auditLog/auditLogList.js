import req from '@/util/request';
import qs from 'qs';

/**
 * 联系我们
 */
export function list(data) {
  return req({
    url: '/audit-log/list-data',
    method: 'get',
    params: data
  })
}


// WEBPACK FOOTER //
// ./src/api/auditLog/auditLogList.js