<template>
  <ul class="nav" @click="clickHander">
    <li v-for="(item, index) in pages" :key="index" :data-path="item.path">{{ item.title }}</li>
  </ul>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goPage = (path = '/') => router.push({ path })
const clickHander = (e) => {
  if (!e.target) return
  goPage(e.target.dataset.path || '/')
}

const pages = [
  {
    path: '/draw-base',
    title: '绘制几何体',
  },
  {
    path: '/geometry',
    title: '自定义几何体',
  },
  {
    path: '/hover-face',
    title: '鼠标hover几何体face变色',
  },
  {
    path: '/stair',
    title: '绘制楼梯',
  },
  {
    path: '/drag',
    title: '拖拽几何体',
  },
  {
    path: '/stretch',
    title: '拉伸几何体',
  },
  {
    path: '/matrix-mean',
    title: '矩阵的意义',
  },
  {
    path: '/ray-plane',
    title: '射线与平面的交点',
  },
]
</script>

<style lang="scss" scoped>
.nav {
  @apply p-6;

  & li {
    @apply text-Slate-900 p-1 w-100 wd-600 hover:(font-bold) cursor-pointer;
  }
}
</style>