<template>
  <div>
    <h3>绘制几何体</h3>
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
  // 相机
  /**
   * fov: 视野角度
   * aspect: 长宽比
   * near: 近端面
   * far: 远端面
   */
  const camera = new THREE.PerspectiveCamera(45, container.value.clientWidth / container.value.clientHeight, 1, 1000)
  // 渲染
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  container.value.appendChild( renderer.domElement );
  // 立方体
  const geometry = new THREE.BoxGeometry( 3, 3, 1 );
  // 材质
  const material = new THREE.MeshBasicMaterial( { color: '#8f9399' } );
  // 网格
  const cube = new THREE.Mesh( geometry, material );
  cube.rotation.x = 10
  cube.rotation.y = 20
  // 添加到场景中
  scene.add(cube)
  camera.position.z = 10;

  renderer.render( scene, camera );
}


</script>

<style lang="scss" scoped>

</style>