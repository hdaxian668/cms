import req from '@/util/request';
import qs from 'qs';
export function edit(data) {
  return req({
    url: '/activity/edit',
    method: 'get',
    params: data
  })
}

export function save(data) {
  return req({
    url: '/activity/save',
    method:'post',
    data: qs.stringify(data)
  })
}

/**
 * 删除某条活动时间段
 * @param id
 */
export function deleteAttributeItem(id) {
  return req({
    url: '/activity/delete-attribute',
    method: 'post',
    data: qs.stringify({
      id,
    })
  })
}



// WEBPACK FOOTER //
// ./src/api/activity/activityDetail.js