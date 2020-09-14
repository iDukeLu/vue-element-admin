/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const trackingConfigRouter = {
  path: '/tracking-config',
  component: Layout,
  redirect: '/tracking-config/tracking-element-config',
  name: 'Table',
  meta: {
    title: 'trackingConfig',
    icon: 'component'
  },
  children: [
    {
      path: 'tracking-element-config',
      component: () => import('@/views/tracking-config/tracking-element-config'),
      name: 'TrackingElementConfig',
      meta: { title: 'trackingElementConfig' }
    },
    {
      path: 'tracking-dimension-config',
      component: () => import('@/views/tracking-config/tracking-dimension-config'),
      name: 'TrackingDimensionConfig',
      meta: { title: 'TrackingDimensionConfig' }
    }
  ]
}
export default trackingConfigRouter
