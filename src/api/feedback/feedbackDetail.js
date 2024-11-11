import req from '@/util/request';
import qs from 'qs';

export function edit(data) {
  return req({
    url: '/feedback/edit',
    method: 'get',
    params: data
  })
}
export function save(data) {
  return req({
    url: '/feedback/save',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function importFeedback(data) {
  return req({
    url: '/feedback/import',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function saveImportFeedback(data) {
  return req({
    url: '/feedback/save-import',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 获取默认列表数据
 */
export function getDefaultArray() {
  return req({
    url: '/setting/switch-array',
    method: 'get',
  })
}



// WEBPACK FOOTER //
// ./src/api/feedback/feedbackDetail.js