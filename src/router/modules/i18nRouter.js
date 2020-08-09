/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const i18nRouter = {
  path: '/i18n',
  component: Layout,
  children: [
    {
      path: 'index',
      component: () => import('@/views/i18n-demo/index'),
      name: 'I18n',
      meta: { title: 'i18n', icon: 'international' }
    }
  ]
}

export default i18nRouter
