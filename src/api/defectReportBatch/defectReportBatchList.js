import req from '@/util/request';
import qs from 'qs';

/**
 * 获取状态选择框数据
 */
export function selectLists() {
  return req({
    url: '/defect-report-batch/search',
    method: 'get',
  })
}

/**
 * 获取列表
 * @param data
 */
export function defectBatchData(data) {
  return req({
    url: '/defect-report-batch/list-data',
    method: 'get',
    params: data
  })
}

export function defectBatchDataWithItem(data) {
  return req({
    url: '/defect-report-batch/list-batch-item',
    method: 'get',
    params: data
  })
}
export function defectBatchDelete(data){
  return req({
    url: '/defect-report-batch/batch-delete',
    method: 'get',
    params: data
  })
}



// WEBPACK FOOTER //
// ./src/api/defectReportBatch/defectReportBatchList.js