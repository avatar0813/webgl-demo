<template>
  <div>
    <h3>自定义几何体:通过顶点点位绘制几何体</h3>
    <div ref="container" class="container"></div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { onMounted, ref } from 'vue'

const container = ref(null)

onMounted(() => {
  initScene()
})

const initScene = () => {
  // 1、创建场景
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#b6d4ff')
  // 添加坐标轴网格线支持
  const axesHelper = new THREE.AxesHelper( 20 )
  const gridHelper = new THREE.GridHelper( 20, 20 )
  scene.add( axesHelper ).add( gridHelper )

  // 2、创建相机
  const camera = new THREE.PerspectiveCamera(45, container.value.clientWidth / container.value.clientHeight, 1, 1000)
  camera.position.z = 10
  camera.position.x = 2
  camera.position.y = 2
  
  // 3、添加几何图形
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
  // @note 非基础材质需要定义法向量才能有光影效果
  geometry.computeVertexNormals()
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

   // 4、初始渲染
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  container.value.appendChild( renderer.domElement )
  const oibitControl = new OrbitControls(camera, renderer.domElement)

  function animate() {
    requestAnimationFrame(animate)
    oibitControl.update()
    renderer.render(scene, camera)
  }
  animate()
}


</script>

<style lang="scss" scoped>

</style>