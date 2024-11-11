import DefectReportBatch from '@/components/defectReportBatch/defectReportBatchList'
import DefectReportBatchDetail from '@/components/defectReportBatch/defectReportBatchDetail'
import DefectReportBatchNew from '@/components/defectReportBatch/defectReportBatchNew'
import DefectReportBatchImport from '@/components/defectReportBatch/defectReportBatchImport'

export default [
  {
    path: '/defect-report-batch/import',
    name: 'DefectReportBatchImport',
    component: DefectReportBatchImport
  },  {
    path: '/defect-report-batch/new',
    name: 'DefectReportBatchNew',
    component: DefectReportBatchNew
  },{
    path: '/defect-report-batch/detail',
    name: 'DefectReportBatchDetail',
    component: DefectReportBatchDetail
  },{
    path: '/defect-report-batch/list',
    name: 'DefectReportBatch',
    component: DefectReportBatch
  },
]



// WEBPACK FOOTER //
// ./src/router/defect-report-batch.js