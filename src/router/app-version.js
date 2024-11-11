import AppVersionList from '@/components/appVersion/appVersionList'
import AppVersionDetail from '@/components/appVersion/appVersionDetail'

export default [
  {
    path: '/app-version/list',
    name: 'AppVersion',
    component: AppVersionList
  },
  {
    path: '/app-version/detail',
    name: 'AppVersionDetail',
    component: AppVersionDetail
  },
]



// WEBPACK FOOTER //
// ./src/router/app-version.js