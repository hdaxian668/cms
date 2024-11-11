import ProjectList from '@/components/project/projectList'
import ProjectDetail from '@/components/project/projectDetail'
import ProgressList from '@/components/project/progressList'
import ProgressDetail from '@/components/project/progressDetail'
import SalesList from '@/components/project/salesList'
import SalesDetail from '@/components/project/salesDetail'
import FloorplanList from '@/components/project/floorplanList'
import FloorplanDetail from '@/components/project/floorplanDetail'
import UnitImport from '@/components/project/unitImport'
//import UnitDetail from '@/components/project/unitDetail'

export default [
  {
    path: '/',
    name: 'index',
    component: ProjectList,
  },
    {
      path: '/project/list',
      name: 'ProjectList',
      component: ProjectList,
    },
    {
      path: '/project/detail',
      name: 'ProjectDetail',
      component: ProjectDetail
    },
    {
      path: '/progress/list',
      name: 'ProgressList',
      component: ProgressList,
    },
    {
      path: '/progress/detail',
      name: 'ProgressDetail',
      component: ProgressDetail
    },
    {
      path: '/sales/list',
      name: 'SalesList',
      component: SalesList
    },
    {
      path: '/sales/detail',
      name: 'SalesDetail',
      component: SalesDetail
    },
    {
      path: '/unit/import',
      name: 'UnitImport',
      component: UnitImport
    },
    /*{
      path: '/unit/detail',
      name: 'UnitDetail',
      component: UnitDetail
    },*/
    {
      path: '/floorplan/list',
      name: 'FloorplanList',
      component: FloorplanList
    },
    {
      path: '/floorplan/detail',
      name: 'FloorplanDetail',
      component: FloorplanDetail
    },
]



// WEBPACK FOOTER //
// ./src/router/project.js