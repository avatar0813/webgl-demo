const routes = [
  {
    path: '/',
    component: () => import('@/app.vue')
  },
  {
    path: '/draw-base',
    name: 'drawBase',
    component: () => import('@/views/drawBase.vue')
  },
  {
    path: '/hover-face',
    name: 'hoverFace',
    component: () => import('@/views/hoverFace.vue')
  }
]

export default routes