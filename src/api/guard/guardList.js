import req from '@/util/request';
import qs from 'qs';

export function guardData(data) {
  return req({
    url: '/guard/list-data',
    method: 'get',
    params: data
  })
}
export function disable(id) {
  const data = {
    id,
  };
  return req({
    url: '/guard/disable',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function enable(id) {
  const data = {
    id,
  };
  return req({
    url: '/guard/enable',
    method: 'post',
    data: qs.stringify(data)
  })
}
  


// WEBPACK FOOTER //
// ./src/api/guard/guardList.js