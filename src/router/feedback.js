import Feedback from '@/components/feedback/feedback'
import FeedbackDetail from '@/components/feedback/feedbackDetail'
import FeedbackNew from '@/components/feedback/feedbackNew'
import FeedbackImport from '@/components/feedback/feedbackImport'

export default [
  {
    path: '/feedback/list',
    name: 'Feedback',
    component: Feedback
  },
  {
    path: '/feedback/new',
    name: 'FeedbackNew',
    component: FeedbackNew
  },
  {
    path: '/feedback/detail',
    name: 'FeedbackDetail',
    component: FeedbackDetail
  },
  {
    path: '/feedback/import',
    name: 'FeedbackImport',
    component: FeedbackImport
  },
]



// WEBPACK FOOTER //
// ./src/router/feedback.js