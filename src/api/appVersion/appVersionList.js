import req from '@/util/request';
import qs from 'qs';

/**
 * 删除用户信息
 */
export function deleteItem(id) {
  const data = {
    id,
  };
  return req({
    url: '/app-version/delete',
    method: 'post',
    data: qs.stringify(data),
  })
}



// WEBPACK FOOTER //
// ./src/api/appVersion/appVersionList.js