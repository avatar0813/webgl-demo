const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/home.vue"),
  },
  {
    path: "/draw-base",
    name: "drawBase",
    component: () => import("@/views/drawBase.vue"),
  },
  {
    path: "/hover-face",
    name: "hoverFace",
    component: () => import("@/views/hoverFace.vue"),
  },
  {
    path: "/stair",
    name: "stair",
    component: () => import("@/views/stair/index.vue"),
  },
  {
    path: "/drag",
    name: "drag",
    component: () => import("@/views/drag.vue"),
  },
  {
    path: "/stretch",
    name: "stretch",
    component: () => import("@/views/stretchRect.vue"),
  },
  {
    path: "/geometry",
    name: "geometry",
    component: () => import("@/views/geometry.vue"),
  },
  {
    path: "/matrix-mean",
    name: "matrixMean",
    component: () => import("@/views/tutorial/matrixMean.vue"),
  },
  {
    path: "/ray-plane",
    name: "rayPlane",
    component: () => import("@/views/rayPlane.vue"),
  },
  {
    path: "/world-distance",
    name: "worldDistance",
    component: () => import("@/views/worldDistance.vue"),
  },
]

export default routes
