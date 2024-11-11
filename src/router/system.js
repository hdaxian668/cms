import SystemAdvert from '@/components/system/advert'
import SystemAdDetail from '@/components/system/adDetail'
import SystemAboutUs from '@/components/system/aboutUs'
import SystemRules from '@/components/system/rules'
import SystemEmail from '@/components/system/email'
import AdministratorsList from '@/components/system/administratorsList'
import AdministratorDetail from '@/components/system/administratorDetail'
import UserGroupList from '@/components/system/userGroupList'
import UserGroupDetail from '@/components/system/userGroupDetail'

export default [
  {
    path: '/advert/list',
    name: 'SystemAdvert',
    component: SystemAdvert
  },
  {
    path: '/advert/detail',
    name: 'SystemAdDetail',
    component: SystemAdDetail
  },
  {
    path: '/setting/about',
    name: 'SystemAboutUs',
    component: SystemAboutUs
  },
  {
    path: '/setting/clause',
    name: 'SystemRules',
    component: SystemRules
  },
  {
    path: '/setting/email',
    name: 'SystemEmail',
    component: SystemEmail
  },
  {
    path: '/user/list',
    name: 'AdministratorsList',
    component: AdministratorsList
  },
  {
    path: '/user/detail',
    name: 'AdministratorDetail',
    component: AdministratorDetail
  },
  {
    path: '/user-group/list',
    name: 'UserGroupList',
    component: UserGroupList
  },
  {
    path: '/user-group/detail',
    name: 'UserGroupDetail',
    component: UserGroupDetail
  },
]



// WEBPACK FOOTER //
// ./src/router/system.js