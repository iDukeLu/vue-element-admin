/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const themeRouter = {
  path: '/theme',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/theme/index'),
      name: 'Theme',
      meta: { title: 'theme', icon: 'theme' }
    }
  ]
}

export default themeRouter
