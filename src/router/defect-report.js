import DefectReport from '@/components/defectReport/defectReportList'
import DefectReportDetail from '@/components/defectReport/defectReportDetail'
import DefectReportImport from '@/components/defectReport/defectReportImport'
import DefectReportNew from '@/components/defectReport/defectReportNew'

export default [
  {
    path: '/defect-report/list',
    name: 'DefectReport',
    component: DefectReport
  }, {
    path: '/defect-report/new',
    name: 'DefectReportNew',
    component: DefectReportNew
  },{
    path: '/defect-report/detail',
    name: 'DefectReportDetail',
    component: DefectReportDetail
  },{
    path: '/defect-report/import',
    name: 'DefectReportImport',
    component: DefectReportImport
  },
]



// WEBPACK FOOTER //
// ./src/router/defect-report.js