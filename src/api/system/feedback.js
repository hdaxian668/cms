import req from '@/util/request';
import qs from 'qs';

/**
 * 联系我们
 */
export function feedback(data) {
  return req({
    url: '/feedback/list-data',
    method: 'get',
    params: data
  })
}

export function deleteItem(id,_csrf) {
  const data = {
    id,
    _csrf
  };
  return req({
    url: '/feedback/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/system/feedback.js