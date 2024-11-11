import req from '@/util/request';
import qs from 'qs';

/**
 * 获取详情数据
 * @param data
 */
 export function detail(data) {
  return req({
    url: '/defect-report-batch/detail',
    method: 'get',
    params: data
  })
}

export function saveImport(data) {
  return req({
    url: '/defect-report-batch/save-import',
    method:'post',
    data: qs.stringify(data)
  })
}

export function saveDetail(data) {
  return req({
    url: '/defect-report-batch/save-detail',
    method:'post',
    data: qs.stringify(data)
  })
}

export function edit(data) {
  return req({
    url: '/defect-report-batch/edit',
    method: 'get',
    params: data
  })
}



// WEBPACK FOOTER //
// ./src/api/defectReportBatch/defectReportBatchDetail.js