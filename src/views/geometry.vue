<template>
  <div>
    <h3>自定义几何体:通过顶点点位绘制几何体</h3>
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
} from '@/utils/three/editor'

import {
  createOrbitControls
} from '@/utils/three/addon'

const container = ref(null)

onMounted(() => {
  const containDom = container.value
  // 创建场景
  const axesHelper = new THREE.AxesHelper( 20 )
  const gridHelper = new THREE.GridHelper( 20, 20 )
  const scene = createScene({ background: 0xb6d4ff }, [axesHelper, gridHelper])
  const camera = createPerspectiveCamera({ containDom: containDom })
  const renderer = createRenderer(containDom)
  const orbitControl = createOrbitControls(camera, renderer.domElement)

  const cube = createCube()
  scene.add(cube)

  const animateCbs = [orbitControl.update]
  const animate = createAnimate(scene, camera, renderer, animateCbs)
  animate()
})

// 创建图形
function createCube() {
  // 添加几何图形
  const geometry = new THREE.BufferGeometry()

  // 顶点
  const vertices = new Float32Array([
    0, 0, 0,
    1, 0, 0,
    1, 1, 0,
    0, 1, 0,
    0, 0, 1,
    1, 0, 1,
    1, 1, 1,
    0, 1, 1,
  ])
  const indexs = new Uint16Array([
    0,1,2, // 背面
    0,2,3,

    0,4,7, // 左面
    0,7,3,

    0,4,5, // 底面
    0,1,5,

    4,5,6, // 正面
    4,6,7,

    2,5,6, // 右面
    1,5,2,

    2,3,6, // 顶部
    3,7,6
  ])
  
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geometry.setIndex(new THREE.BufferAttribute(indexs, 1))
  const material = new THREE.MeshMatcapMaterial( { color: 0xffffff, side: THREE.DoubleSide } )
  geometry.computeVertexNormals()
  const cube = new THREE.Mesh(geometry, material)

  return cube
}


</script>

<style lang="scss" scoped>

</style>