/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const zipRouter = {
  path: '/zip',
  component: Layout,
  redirect: '/zip/download',
  alwaysShow: true,
  name: 'Zip',
  meta: { title: 'zip', icon: 'zip' },
  children: [
    {
      path: 'download',
      component: () => import('@/views/zip/index'),
      name: 'ExportZip',
      meta: { title: 'exportZip' }
    }
  ]
}

export default zipRouter
