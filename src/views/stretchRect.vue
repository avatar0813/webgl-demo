<template>
  <div>
    <h3>拉伸几何体</h3>
    <div ref="container" class="container"></div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { onMounted, ref } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  createOrbitControls
} from '@/utils/three/addon'
import { getXYZByIndex, diffXYZByIndex } from '@/utils'
import {
  createScene,
  createPerspectiveCamera,
  createRenderer,
  createAnimate,
} from '@/utils/three/editor'

const container = ref(null)

onMounted(() => {
  initScene()
})

const initScene = () => {
  const containerDom = container.value
  // 1、场景 及 添加坐标轴网格线支持
  const scene = createScene({ background: 0xb6d4ff })
  const camera = createPerspectiveCamera({ containDom: containerDom, far: 5000 })
  const renderer = createRenderer(containerDom)
  const orbitControl = createOrbitControls(camera, renderer.domElement)

  // 添加几何图形
  const geometry = createGeometry()
  const cube = createCube(geometry)
  scene.add(cube)

  // 处理拉伸事件
  stretchHandler({scene, containerDom, camera, cube, orbitControl })

  const animateCbs = [orbitControl.update]
  const animate = createAnimate(scene, camera, renderer, animateCbs)
  animate()
}

function createGeometry() {
  const geometry = new THREE.BoxGeometry()
  geometry.computeVertexNormals()
  return geometry
}

function createCube(geometry) {
  
  const materials = new THREE.MeshMatcapMaterial( { color: 0xffffff, side: THREE.DoubleSide } )
  const cube = new THREE.Mesh( geometry, materials )
  return cube
}


function stretchHandler({ scene, containerDom, camera, cube, orbitControl }) {
  // 5、添加射线 判断是否点击在几何体上
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  let plane = new THREE.Plane()
  let intersects = []
  const p1 = new THREE.Vector3()
  const p2 = new THREE.Vector3()
  // @note 平面辅助
  // const planeHelper = new THREE.PlaneHelper( plane, 10, 0xffff00 );
  // scene.add( planeHelper );

  // 6、添加拖放控制
  function onpointerDown(event) {

    const rect = containerDom.getBoundingClientRect()
    pointer.x =  (event.clientX - rect.left) / rect.width * 2 - 1;
    pointer.y = -  (event.clientY - rect.top) / rect.height * 2 + 1;
    raycaster.setFromCamera( pointer, camera )
    intersects = raycaster.intersectObject(cube) || []
    if (intersects.length > 0) {
      // 获取点击点世界坐标
      // 根据相机法向量和场景原点创建平面
      const planeNormal = new THREE.Vector3()
      planeNormal.copy(camera.position).normalize()
      plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position)
      raycaster.ray.intersectPlane(plane, p1)

      // 在图形中点下，禁用滚动器
      orbitControl.enabled = false
      containerDom.style = 'cursor:pointer'
    }
  }

  function onPointerMove(event) {
    if (intersects.length === 0) return

    const rect = containerDom.getBoundingClientRect()
    pointer.x =  (event.clientX - rect.left) / rect.width * 2 - 1;
    pointer.y = -  (event.clientY - rect.top) / rect.height * 2 + 1;
    raycaster.setFromCamera( pointer, camera )
    
    raycaster.ray.intersectPlane(plane, p2)
    const face = intersects[0].face
    const faceIndex = intersects[0].faceIndex
    const planeNormal = intersects[0].normal // 平面法向量
    const geometry = intersects[0].object.geometry
    const verticeIndexArr = [] // 顶点索引集合
    const offsetDirection = planeNormal.clone().multiplyScalar((p2.clone().sub(p1.clone())).dot(planeNormal))
    p1.copy(p2)

    const indexArr = [face.a, face.b, face.c]
    // 找到正方体的另一个点
    // 如果当前面faceIndex 是偶数, 则另一个三角形 faceIndex 是偶数 - 1, 
    // 这另一个顶点是maxPositionIndex + 1
    // 反之 另一个订单时minPositionIndex - 1
    if (faceIndex % 2 === 0) {
      const max = Math.max(face.a, face.b, face.c)
      indexArr.push(max + 1)
    } else {
      const min = Math.min(face.a, face.b, face.c)
      indexArr.push(min - 1)
    }

    const geoCount = geometry.attributes.position.count
    for(let i = 0; i < geoCount; i++) {
      if (
        diffXYZByIndex(geometry, i, indexArr[0]) 
        || diffXYZByIndex(geometry, i, indexArr[1])
        || diffXYZByIndex(geometry, i, indexArr[2])  
        || diffXYZByIndex(geometry, i, indexArr[3])  
      ) {
        verticeIndexArr.push(i)
      }
    }

    // 设置新旧顶点坐标
    verticeIndexArr.forEach(index => {
      const {x, y, z} = getXYZByIndex(geometry, index)
      const originPointer = new THREE.Vector3(x, y, z).add(offsetDirection)
      geometry.attributes.position.setXYZ(index, originPointer.x, originPointer.y, originPointer.z)
    })
    geometry.attributes.position.needsUpdate = true
  }

  function onPointerUp() {
    intersects = []
    orbitControl.enabled = true
    containerDom.style = 'cursor:auto'
  }

  containerDom.addEventListener('pointerdown', onpointerDown );
  containerDom.addEventListener('pointermove', onPointerMove );
  containerDom.addEventListener('pointerup', onPointerUp );
}
</script>

<style lang="scss" scoped>

</style>