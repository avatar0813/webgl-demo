<template>
  <div>
    <h3>全景预览</h3>
    <div ref="container" class="container"></div>
  </div>
</template>

<script setup>
import { BoxGeometry, MeshBasicMaterial, Mesh, TextureLoader, DoubleSide } from 'three'
import {
  createScene,
  createPerspectiveCamera,
  createRenderer,
  createAnimate,
} from '@/utils/three/editor'
import {
  createOrbitControls
} from '@/utils/three/addon'
import back from './img/back.png'
import bottom from './img/bottom.png'
import front from './img/front.png'
import left from './img/left.png'
import right from './img/right.png'
import top from './img/top.png'

import { onMounted, ref } from 'vue'

const container = ref(null)

const loadTextrue = (url) => {
  const loader = new TextureLoader()
  const texture = loader.load(url)
  const material = new MeshBasicMaterial({
    map: texture,
    side: DoubleSide,
  })
  return material
}
onMounted(() => {
  // 场景
  // 添加坐标轴网格线支持
  const scene = createScene({ background: 0xb6d4ff })
  const camera = createPerspectiveCamera({ containDom: container.value }, { x: 0, y: 10, z: 0 })

  // 添加几何图形
  const cube = getCube()
  scene.add(cube)

  // 渲染
  const renderer = createRenderer(container.value)
  const orbitControl = createOrbitControls(camera, renderer.domElement)

  const animateCbs = [orbitControl.update]
  const animate = createAnimate(scene, camera, renderer, animateCbs)
  animate()
})

// 获取几何图形
function getCube(x = 0, y = 0, z = 0) {
  const geometry = new BoxGeometry(40, 40, 40)
  const materialArr = [
    loadTextrue(back),
    loadTextrue(front),
    loadTextrue(top),
    loadTextrue(bottom),
    loadTextrue(left),
    loadTextrue(right),
  ]
  const cube = new Mesh(geometry, materialArr)

  cube.position.x = x
  cube.position.y = y
  cube.position.z = z
  return cube
}


</script>

<style lang="scss" scoped></style>