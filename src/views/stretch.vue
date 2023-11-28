<template>
  <div>
    <h3>拉伸几何体</h3>
    <div ref="container" class="container"></div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { onMounted, ref } from 'vue'

const container = ref(null)

onMounted(() => {
  initScene()
})

const initScene = () => {
  // 场景
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#b6d4ff')
  // 添加坐标轴网格线支持
  const axesHelper = new THREE.AxesHelper( 20 );
  const gridHelper = new THREE.GridHelper( 20, 20 );
  scene.add( axesHelper ).add( gridHelper );


  // 相机
  /**
   * fov: 视野角度
   * aspect: 长宽比
   * near: 近端面
   * far: 远端面
   */
  const camera = new THREE.PerspectiveCamera(45, container.value.clientWidth / container.value.clientHeight, 1, 1000)
  camera.position.z = 10;
  camera.position.x = 2;
  camera.position.y = 2;

  // 添加几何图形
  const cube = getCube(1,1,1)
  scene.add(cube)

   // 渲染
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  container.value.appendChild( renderer.domElement );
  renderer.render( scene, camera );
}

// 获取几何图形
function getCube(x = 0, y = 0, z = 0) {
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshBasicMaterial( { color: '#8c8f88' } );
  const cube = new THREE.Mesh( geometry, material );

  cube.position.x = x
  cube.position.y = y
  cube.position.z = z
  return cube
}
</script>

<style lang="scss" scoped>

</style>