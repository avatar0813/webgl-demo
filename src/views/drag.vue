<template>
  <div>
    <h3>拖拽几何体</h3>
    <div ref="container" class="container"></div>
  </div>
</template>

<script setup>
import * as THREE from 'three'


import { onMounted, ref } from 'vue'
import {
  createScene,
  createPerspectiveCamera,
  createRenderer,
  createAnimate,
} from '@/utils/three/eidtor'
import {
  createOrbitControls,
  createDragControls
} from '@/utils/three/addon'

const container = ref(null)

onMounted(() => {
  const containDom = container.value
  // 创建场景
  const axesHelper = new THREE.AxesHelper( 20 );
  const gridHelper = new THREE.GridHelper( 20, 20 );
  const scene = createScene({ background: 0xb6d4ff }, [axesHelper, gridHelper])
  const camera = createPerspectiveCamera({ containDom })
  const renderer = createRenderer(containDom)
  const orbitControl = createOrbitControls(camera, renderer.domElement)
  // 添加几何图形
  const cube = getCube(1,1,1)
  scene.add(cube)

  // 添加拖放控制
  const dragControl = createDragControls({ 
    objects: [cube],
    camera,
    dom: renderer.domElement,
    dragstart() {
      orbitControl.enabled = false
    },
    dragend() {
      orbitControl.enabled = true
    }
  })

  const animateCbs = [orbitControl.update]
  const animate = createAnimate(scene, camera, renderer, animateCbs)
  animate()
})


// 获取几何图形
function getCube(x = 0, y = 0, z = 0) {
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshMatcapMaterial( { color: 0x8c8f88 } )
  const cube = new THREE.Mesh( geometry, material );

  cube.position.x = x
  cube.position.y = y
  cube.position.z = z
  return cube
}


</script>

<style lang="scss" scoped>

</style>