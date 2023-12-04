hover<template>
  <div>
    <h3>鼠标hover几何体face变色</h3>
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
  createOrbitControls
} from '@/utils/three/addon'


const container = ref(null)
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


onMounted(() => {
  const containerDom = container.value
  const axesHelper = new THREE.AxesHelper( 20 );
  const gridHelper = new THREE.GridHelper( 20, 20 );
  const scene = createScene({ background: 0xb6d4ff }, [axesHelper, gridHelper])
  const camera = createPerspectiveCamera({aspect: containerDom.clientWidth / containerDom.clientHeight })
  const cube = createCube()

  scene.add(cube)

   // 渲染
  const renderer = createRenderer(containerDom)
  const orbitControl = createOrbitControls(camera, renderer.domElement)
  const animateCbs = [
    orbitControl.update,
    () => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
  }]
  const animate = createAnimate(scene, camera, renderer, animateCbs)
  animate()

  // 判断鼠标hover几何体face
  raycasterFocus(containerDom, renderer, camera, cube)
})

function createCube() {
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  // 分别给几何体每一面添加材质，用于给计算face面
  const cube = new THREE.Mesh( geometry, materials );
  cube.position.x = 1
  cube.position.y = 1
  cube.position.z = 1

  return cube
}

// 射线聚焦
function raycasterFocus(containerDom, renderer, camera, cube) {
  // 射线
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let activeFaceIndex = 0

  function onPointerMove( event ) {
    // 根据点与相机位设置射线
    const rect = containerDom.getBoundingClientRect()
    pointer.x = ( (event.clientX - rect.x) / renderer.domElement.clientWidth ) * 2 - 1;
    pointer.y = - ( (event.clientY - rect.y) / renderer.domElement.clientHeight ) * 2 + 1;
    raycaster.setFromCamera( pointer, camera );

    // 判断射线是否穿过图形
    const intersects = raycaster.intersectObject(cube)
    if (intersects.length > 0) {
      const item = intersects[0]
      if (item.face.materialIndex !== activeFaceIndex) {
        // 其他面还原色
        materials[activeFaceIndex].color.setHex(originMaterialColor)
      }
      // hover面改色 
      activeFaceIndex = item.face.materialIndex
      materials[activeFaceIndex].color.setHex(hoverMaterialColor)
    } else {
      if (activeFaceIndex !== -1) {
        materials[activeFaceIndex].color.setHex(originMaterialColor)
      }
    }
  }
  containerDom.addEventListener('pointermove', onPointerMove )
}
</script>

<style lang="scss" scoped>

</style>