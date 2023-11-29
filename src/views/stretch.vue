<template>
  <div>
    <h3>拉伸几何体</h3>
    <div ref="container" class="container"></div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';

import { onMounted, ref } from 'vue'

const container = ref(null)

onMounted(() => {
  initScene()
})

const initScene = () => {
  const containerDom = container.value
  // 场景 及 添加坐标轴网格线支持
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xb6d4ff)
  const axesHelper = new THREE.AxesHelper( 20 );
  const gridHelper = new THREE.GridHelper( 20, 20 );
  scene.add( axesHelper ).add( gridHelper );

  // 相机 调整初始相机角度
  const camera = new THREE.PerspectiveCamera(45, containerDom.clientWidth / containerDom.clientHeight, 1, 1000)
  camera.position.z = 10;
  camera.position.x = 2;
  camera.position.y = 2;

  // 添加几何图形
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  // 分别给几何体每一面添加材质，用于给计算face面
  const originMaterialColor  = 0x8c8f88
  const hoverMaterialColor  = 0x000ab4
  const materials = [
    new THREE.MeshMatcapMaterial( { color: originMaterialColor } ),
    new THREE.MeshMatcapMaterial( { color: originMaterialColor } ),
    new THREE.MeshMatcapMaterial( { color: originMaterialColor } ),
    new THREE.MeshMatcapMaterial( { color: originMaterialColor } ),
    new THREE.MeshMatcapMaterial( { color: originMaterialColor } ),
    new THREE.MeshMatcapMaterial( { color: originMaterialColor } ),
  ]
  const cube = new THREE.Mesh( geometry, materials );
  cube.position.x = 1
  cube.position.y = 1
  cube.position.z = 1
  scene.add(cube)

  var vertices = geometry.vertices;
  console.log('vertices', vertices, geometry)

   // 渲染
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(containerDom.clientWidth, containerDom.clientHeight)
  containerDom.appendChild( renderer.domElement );

  // 添加轨道控制器 使其可以拖动切换视角
  const orbitControl = new OrbitControls(camera, renderer.domElement);

  // 射线
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let activeFaceIndex = 0


  // 记录hover面
  let dragGeo = null
  let dragFace = null
  function onPointerMove( event ) {
    const rect = containerDom.getBoundingClientRect()
    pointer.x = ( (event.clientX - rect.x) / renderer.domElement.clientWidth ) * 2 - 1;
    pointer.y = - ( (event.clientY - rect.y) / renderer.domElement.clientHeight ) * 2 + 1;
    // 根据点与相机位设置射线
    raycaster.setFromCamera( pointer, camera );


    // 判断射线是否穿过图形
    const intersects = raycaster.intersectObject(cube)
    if (intersects.length > 0) {
      const item = intersects[0]
      dragGeo = item.object.geometry
      dragFace = item.face
      if (item.face.materialIndex !== activeFaceIndex) {
        // 其他面还原色
        materials[activeFaceIndex].color.setHex(originMaterialColor)
      }
      // hover面改色 修改记录faceIndex
      activeFaceIndex = item.face.materialIndex
      materials[activeFaceIndex].color.setHex(hoverMaterialColor)

    } else {
      dragGeo = null
      dragFace = null
      if (activeFaceIndex !== -1) {
        materials[activeFaceIndex].color.setHex(originMaterialColor)
      }
    }

  }
  containerDom.addEventListener('pointermove', onPointerMove );

  // 6、添加拖放控制
  const dragControl = new DragControls([cube], camera, renderer.domElement)
  // 拖动时禁用轨道控制器
  dragControl.addEventListener('dragstart', () => {
    orbitControl.enabled = false
  })
  dragControl.addEventListener('dragend', () => {
    orbitControl.enabled = true
  })
  dragControl.addEventListener('drag', (e) => {
    // 拖动时修改几何图形坐标并重新渲染
    renderer.render( scene, camera );

    // 设置拖动
    if (dragGeo && dragFace) {
      console.log('drag:', dragGeo, dragFace)
      const indexA = dragFace.a
      const indexB = dragFace.b
      const indexC = dragFace.c
      const positionAX = dragGeo.attributes.position.getX(indexA)
      const positionAY = dragGeo.attributes.position.getY(indexA)
      const positionAZ = dragGeo.attributes.position.getZ(indexA)
      console.log('x-y-z', [indexA], [positionAX, positionAY, positionAZ])
    }
  })

  function animate() {
    requestAnimationFrame(animate)
    orbitControl.update()
    renderer.render(  scene, camera );
  }
  animate()
}
</script>

<style lang="scss" scoped>

</style>