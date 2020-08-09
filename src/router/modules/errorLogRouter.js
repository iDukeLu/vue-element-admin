/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const errorLogRouter = {
  path: '/error-log',
  component: Layout,
  children: [
    {
      path: 'log',
      component: () => import('@/views/error-log/index'),
      name: 'ErrorLog',
      meta: { title: 'errorLog', icon: 'bug' }
    }
  ]
}

export default errorLogRouter
