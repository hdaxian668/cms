import req from '@/util/request';
import qs from 'qs';

/**
 * 获取状态选择框数据
 */
export function selectLists() {
  return req({
    url: '/defect-report/search',
    method: 'get',
  })
}

/**
 * 获取列表
 * @param data
 */
export function defectData(data) {
  return req({
    url: '/defect-report/list-data',
    method: 'get',
    params: data
  })
}

export function getlist(data) {
  return req({
    url: '/defect-report/form-list-search',
    method:'get'
  })
}

export function getNextItemSeq(data){
  return req({
    url: '/defect-report/get-item-seq',
    method: 'get',
    params: data
  })
}

export function defectDelete(data){
  return req({
    url: '/defect-report/item-delete',
    method: 'get',
    params: data
  })
}



// WEBPACK FOOTER //
// ./src/api/defectReport/defectReportList.js