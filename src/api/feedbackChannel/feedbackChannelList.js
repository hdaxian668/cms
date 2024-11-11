import req from '@/util/request';
import qs from 'qs';

export function feedbackChannelData(data) {
  return req({
    url: '/feedback-channel/list-data',
    method: 'get',
    params: data
  })
}

/**
 * 删除条目
 * @param id
 * @param _csrf
 */
export function deleteItem(id) {
  const data = {
    id,
  };
  return req({
    url: '/feedback-channel/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/feedbackChannel/feedbackChannelList.js