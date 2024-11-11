import req from '@/util/request';
import qs from 'qs';

/**
 * 获取详情数据
 * @param data
 */
export function itemlist(data) {
  return req({
    url: '/defect-holiday/list-data',
    method: 'get',
    params: data
  })
}
export function detail(data) {
  return req({
    url: '/defect-holiday/detail',
    method: 'get',
    params: data
  })
}
export function saveItem(data) {
  return req({
    url: '/defect-holiday/save-item',
    method:'post',
    data: qs.stringify(data)
  })
}

export function deleteItem(data) {
  return req({
    url: '/defect-holiday/delete-item',
    method:'post',
    data: qs.stringify(data)
  })
}

export function save(data) {
  return req({
    url: '/defect-holiday/save',
    method:'post',
    data: qs.stringify(data)
  })
}
export function saveImport(data) {
  return req({
    url: '/defect-holiday/save-import',
    method:'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/defectHoliday/defectHoliday.js