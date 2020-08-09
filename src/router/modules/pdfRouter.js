/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const pdfRouter = {
  path: '/pdf',
  component: Layout,
  redirect: '/pdf/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/pdf/index'),
      name: 'PDF',
      meta: { title: 'pdf', icon: 'pdf' }
    },
    {
      path: '/pdf/download',
      component: () => import('@/views/pdf/download'),
      name: 'DownloadPdf',
      meta: { title: 'DownloadPdf' },
      hidden: true
    }
  ]
}

export default pdfRouter
