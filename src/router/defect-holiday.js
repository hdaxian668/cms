import DefectHolidayList from '@/components/defectHoliday/defectHolidayList'
import DefectHolidayNew from '@/components/defectHoliday/defectHolidayNew'
import DefectHolidayEdit from '@/components/defectHoliday/defectHolidayEdit'
import DefectHolidayImport from '@/components/defectHoliday/defectHolidayImport'

export default [
  {
    path: '/defect-holiday/list',
    name: 'DefectHolidayList',
    component: DefectHolidayList
  }, {
    path: '/defect-holiday/new',
    name: 'DefectHolidayNew',
    component: DefectHolidayNew
  }, {
    path: '/defect-holiday/edit',
    name: 'DefectHolidayEdit',
    component: DefectHolidayEdit
  }, {
    path: '/defect-holiday/import',
    name: 'DefectHolidayImport',
    component: DefectHolidayImport
  },
]


// WEBPACK FOOTER //
// ./src/router/defect-holiday.js