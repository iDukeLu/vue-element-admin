/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const excelRouter = {
  path: '/excel',
  component: Layout,
  redirect: '/excel/export-excel',
  name: 'Excel',
  meta: {
    title: 'excel',
    icon: 'excel'
  },
  children: [
    {
      path: 'export-excel',
      component: () => import('@/views/excel/export-excel'),
      name: 'ExportExcel',
      meta: { title: 'exportExcel' }
    },
    {
      path: 'export-selected-excel',
      component: () => import('@/views/excel/select-excel'),
      name: 'SelectExcel',
      meta: { title: 'selectExcel' }
    },
    {
      path: 'export-merge-header',
      component: () => import('@/views/excel/merge-header'),
      name: 'MergeHeader',
      meta: { title: 'mergeHeader' }
    },
    {
      path: 'upload-excel',
      component: () => import('@/views/excel/upload-excel'),
      name: 'UploadExcel',
      meta: { title: 'uploadExcel' }
    }
  ]
}

export default excelRouter
