import ActivityList from '@/components/activity/activityList'
import ActivityDetail from '@/components/activity/activityDetail'
import RegistrationManagement from '@/components/activity/registration'
import ContactInformationList from '@/components/activity/contactList'

export default [
  {
    path: '/activity/list',
    name: 'ActivityList',
    component: ActivityList
  },
  {
    path: '/activity/detail',
    name: 'ActivityDetail',
    component: ActivityDetail
  },
  {
    path: '/attend/attend-list/:id/:name',
    name: 'RegistrationManagement',
    component: RegistrationManagement
  },
  {
    path: '/contact/contact-list',
    name: 'ContactInformationList',
    component: ContactInformationList
  },
]



// WEBPACK FOOTER //
// ./src/router/activity.js