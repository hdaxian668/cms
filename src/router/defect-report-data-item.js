import DefectReportDataItemList from '@/components/defectReportDataItem/defectReportDataItemList'
import DefectReportDataItemNew from '@/components/defectReportDataItem/defectReportDataItemNew'
import DefectReportDataItemEdit from '@/components/defectReportDataItem/defectReportDataItemEdit'

export default [
  {
    path: '/defect-report-data-item/list',
    name: 'DefectReportDataItemList',
    component: DefectReportDataItemList
  }, {
    path: '/defect-report-data-item/new',
    name: 'defectReportDataItemNew',
    component: DefectReportDataItemNew
  }, {
    path: '/defect-report-data-item/edit',
    name: 'defectReportDataItemEdit',
    component: DefectReportDataItemEdit
  }
]



// WEBPACK FOOTER //
// ./src/router/defect-report-data-item.js