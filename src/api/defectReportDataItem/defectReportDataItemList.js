import req from '@/util/request';
import qs from 'qs';

/**
 * 获取详情数据
 * @param data
 */
export function itemlist(data) {
  return req({
    url: '/list-data/list-data',
    method: 'get',
    params: data
  })
}
export function detail(data) {
  return req({
    url: '/list-data/detail',
    method: 'get',
    params: data
  })
}
export function saveItem(data) {
  return req({
    url: '/defect-report-data-item/save-item',
    method:'post',
    data: qs.stringify(data)
  })
}

export function deleteItem(data) {
  return req({
    url: '/defect-report-data-item/delete-item',
    method:'post',
    data: qs.stringify(data)
  })
}

export function save(data) {
  return req({
    url: '/defect-report-data-item/save',
    method:'post',
    data: qs.stringify(data)
  })
}



// WEBPACK FOOTER //
// ./src/api/defectReportDataItem/defectReportDataItemList.js