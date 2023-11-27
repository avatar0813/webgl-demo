hover<template>
  <div>
    <h3>鼠标hover几何体face变色</h3>
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
  const dom = container.value
  // 场景
  const scene = new THREE.Scene()
  // 相机
  /**
   * fov: 视野角度
   * aspect: 长宽比
   * near: 近端面
   * far: 远端面
   */
  const camera = new THREE.PerspectiveCamera(65, dom.clientWidth / dom.clientHeight, 1, 100)
  // 渲染
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(dom.clientWidth, dom.clientHeight)
  dom.appendChild( renderer.domElement );
  // 立方体
  const geometry = new THREE.BoxGeometry( 3, 3, 1 );
  // 材质
  const material = new THREE.MeshBasicMaterial( { color: '#8f9399' } );
  // 网格
  const cube = new THREE.Mesh( geometry, material );
  cube.rotation.x = 0.3
  cube.rotation.y = 2
  // 添加到场景中
  scene.add(cube)
  camera.position.z = 10;

  // 初始化射线与点
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function onPointerMove(e) {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    const rect = dom.getBoundingClientRect()
    pointer.x = ( e.clientX - rect.x / dom.clientWidth) * 2 - 1
    pointer.y = (e.clientY - rect.y / dom.clientHeight) * 2 - 1

    raycasterRender()
  }


  // 射线移动出发重新渲染
  function raycasterRender() {
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera( pointer, camera );
    // 计算物体和射线的焦点
    const intersects = raycaster.intersectObjects( scene.children );
    console.log('intersects', intersects, scene.children)
    for ( let i = 0; i < intersects.length; i ++ ) {
      intersects[ i ].object.material.color.set( 0xff0000 );
    }
    renderer.render( scene, camera );
  }

  dom.addEventListener('pointermove', onPointerMove)
  renderer.render( scene, camera )
  // window.requestAnimationFrame(raycasterRender);
}
</script>

<style lang="scss" scoped>

</style>