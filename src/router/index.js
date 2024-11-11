import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login'
import project from './project'
import activity from './activity'
import discounted from './discounted'
import member from './member'
import level from './level'
import feedback from './feedback'
import subscribe from './subscribe'
import system from './system'
import message from './message'
import defectHoliday from './defect-holiday'
import defectReport from './defect-report'
import defectReportBatch from './defect-report-batch'
import defectReportDataItem from './defect-report-data-item'
import appVersion from './app-version'
import visitorPass from './visitor-pass'
import visitorLog from './visitor-log'
import guard from './guard'
import auditLog from './audit-log'
import feedbackCategory from './feedback-category.js'
import feedbackChannel from './feedback-channel.js'

import NotFind from '@/components/errorPage/404'
import NotPower from '@/components/errorPage/500'

Vue.use(Router)

export default new Router({
  routes: [
    ...project,
    ...activity,
    ...discounted,
    ...member,
    ...level,
    ...feedback,
    ...subscribe,
    ...system,
    ...message,
    ...defectHoliday,
    ...defectReport,
    ...defectReportBatch,
    ...defectReportDataItem,
    ...appVersion,
    ...visitorPass,
    ...visitorLog,
    ...guard,
    ...auditLog,
    ...feedbackCategory,
    ...feedbackChannel,

    {
      path: '*',
      name: NotFind,
      component: NotFind,
      meta: {
        title: '404未找到',
      },
    },
    {
      path: '/404',
      name: 'NotFind',
      component: NotFind,
    },
    {
      path: '/500',
      name: 'NotPower',
      component: NotPower,
    },
    {
      path: '/login/index',
      name: 'Login',
      component: Login,
    },
  ]
});




// WEBPACK FOOTER //
// ./src/router/index.js