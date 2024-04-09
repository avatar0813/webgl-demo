<template>
  <div>
    <h3>绘制几何体</h3>
    <div ref="container" class="container"></div>
  </div>
</template>

<script setup>
import { AxesHelper, GridHelper, BoxGeometry, MeshMatcapMaterial, Mesh } from 'three'
import { 
  createScene, 
  createPerspectiveCamera,
  createRenderer,
  createAnimate,
} from '@/utils/three/editor'
import {
  createOrbitControls
} from '@/utils/three/addon'

import { onMounted, ref } from 'vue'

const container = ref(null)

onMounted(() => {
  // 场景
  // 添加坐标轴网格线支持
  const axesHelper = new AxesHelper( 20 );
  const gridHelper = new GridHelper( 20, 20 );
  const scene = createScene({ background: 0xb6d4ff }, [axesHelper, gridHelper])
  const camera = createPerspectiveCamera({containDom: container.value })

  // 添加几何图形
  const cube = getCube(1,1,1)
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
  const geometry = new BoxGeometry( 1, 1, 1 );
  const material = new MeshMatcapMaterial( { color: 0x8c8f88 } );
  const cube = new Mesh( geometry, material );

  cube.position.x = x
  cube.position.y = y
  cube.position.z = z
  return cube
}


</script>

<style lang="scss" scoped>

</style>