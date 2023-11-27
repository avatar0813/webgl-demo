<script setup>
import { RouterView, useRouter } from 'vue-router';

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
    path: '/hover-face',
    title: '鼠标hover几何体face变色',
  },
]
</script>

<template>
  <div>
    <h1>新手楼梯任务</h1>
    <ul @click="clickHander">
      <li v-for="(item, index) in pages" :key="index" :data-path="item.path" >{{ item.title }}</li>
    </ul>
  </div>
  <router-view></router-view>
</template>

<style scoped>
</style>
