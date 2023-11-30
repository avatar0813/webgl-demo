<template>
  <div>
    <h3>拉伸几何体</h3>
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
  const containerDom = container.value
  // 1、场景 及 添加坐标轴网格线支持
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xb6d4ff)
  const axesHelper = new THREE.AxesHelper( 20 );
  scene.add( axesHelper )

  // 2、相机 调整初始相机角度
  const camera = new THREE.PerspectiveCamera(45, containerDom.clientWidth / containerDom.clientHeight, 1, 5000)
  camera.position.z = 10
  camera.position.x = 2
  camera.position.y = 5

  // 3、添加几何图形
  // 顶点
  const geometry = new THREE.BoxGeometry()
  geometry.computeVertexNormals()
  const materials = new THREE.MeshMatcapMaterial( { color: 0xffffff, side: THREE.DoubleSide } )
  const cube = new THREE.Mesh( geometry, materials );
  scene.add(cube)

   // 4、渲染
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(containerDom.clientWidth, containerDom.clientHeight)
  containerDom.appendChild( renderer.domElement )
  // 添加轨道控制器 使其可以拖动切换视角
  const orbitControl = new OrbitControls(camera, renderer.domElement);

  // 5、添加射线 判断是否点击在几何体上
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  let activeInCube = false
  let activeIntersect = null
  let p1 = new THREE.Vector3()
  let p2 = new THREE.Vector3()

  function onPointerMove(event) {
    if (!activeInCube) return

    const rect = containerDom.getBoundingClientRect()
    pointer.x = ( (event.clientX - rect.x) / renderer.domElement.clientWidth ) * 2 - 1;
    pointer.y = - ( (event.clientY - rect.y) / renderer.domElement.clientHeight ) * 2 + 1;
    raycaster.setFromCamera( pointer, camera )
    p2 = new THREE.Vector3(pointer.x, pointer.y, 0).unproject(camera)

    const face = activeIntersect.face
    const faceIndex = activeIntersect.faceIndex
    const planeNormal = activeIntersect.normal // 平面法向量
    const verticeIndexArr = [] // 顶点索引集合
    const dot = planeNormal.clone().multiplyScalar((p2.clone().sub(p1.clone())).dot(planeNormal.clone()))
    p1.copy(p2)

    // 一个面有3个点，记录每个点的position信息(x, y, z)
    const positionArr = [
      geometry.attributes.position.getX(face.a),
      geometry.attributes.position.getY(face.a),
      geometry.attributes.position.getZ(face.a),
      geometry.attributes.position.getX(face.b),
      geometry.attributes.position.getY(face.b),
      geometry.attributes.position.getZ(face.b),
      geometry.attributes.position.getX(face.c),
      geometry.attributes.position.getY(face.c),
      geometry.attributes.position.getZ(face.c),
    ]
    // 找到正方体的另一个点
    // 如果当前面faceIndex 是偶数, 则另一个三角形 faceIndex 是偶数 - 1, 
    // 这另一个顶点是maxPositionIndex + 1
    // 反之 另一个订单时minPositionIndex - 1
    if (faceIndex % 2 === 0) {
      const max = Math.max(face.a, face.b, face.c)
      positionArr.push(
        geometry.attributes.position.getX(max + 1),
        geometry.attributes.position.getY(max + 1),
        geometry.attributes.position.getZ(max + 1),
      )
    } else {
      const min = Math.min(face.a, face.b, face.c)
      positionArr.push(
        geometry.attributes.position.getX(min - 1),
        geometry.attributes.position.getY(min - 1),
        geometry.attributes.position.getZ(min - 1),
      )
    }

    // position.arr上找到位置
    const geoPSArr = geometry.attributes.position.array
    for (let i = 0; i < geoPSArr.length; i+=3) {
      const ps0 = geoPSArr[i]
      const ps1 = geoPSArr[i + 1]
      const ps2 = geoPSArr[i + 2]
      if (
        positionArr[0] === ps0 && positionArr[1] === ps1 && positionArr[2] === ps2
        || positionArr[3] === ps0 && positionArr[4] === ps1 && positionArr[5] === ps2
        || positionArr[6] === ps0 && positionArr[7] === ps1 && positionArr[8] === ps2
        || positionArr[9] === ps0 && positionArr[10] === ps1 && positionArr[11] === ps2
      ) {
        verticeIndexArr.push(i / 3)
      }
    }

    // 设置新旧顶点坐标
    verticeIndexArr.forEach(index => {
      const originPointer = new THREE.Vector3(
        geometry.attributes.position.getX(index),
        geometry.attributes.position.getY(index),
        geometry.attributes.position.getZ(index),
      ).add(dot)
      geometry.attributes.position.setXYZ(index, originPointer.x, originPointer.y, originPointer.z)
    })
    geometry.attributes.position.needsUpdate = true
  }

  // 6、添加拖放控制
  function onpointerDown(event) {

    const rect = containerDom.getBoundingClientRect()
    pointer.x = ( (event.clientX - rect.x) / renderer.domElement.clientWidth ) * 2 - 1;
    pointer.y = - ( (event.clientY - rect.y) / renderer.domElement.clientHeight ) * 2 + 1;
    raycaster.setFromCamera( pointer, camera )
    const intersects = raycaster.intersectObject(cube)
    
    if (intersects.length > 0) {
      // 获取点击点世界坐标
      p1 = new THREE.Vector3(pointer.x, pointer.y, 0).unproject(camera)
      activeInCube = true
      // 在图形中点下，禁用滚动器
      orbitControl.enabled = false
      activeIntersect = intersects[0]
    }
  }
  function onPointerUp() {
    activeInCube = false
    activeIntersect = null
    orbitControl.enabled = true
  }

  containerDom.addEventListener('pointerdown', onpointerDown );
  containerDom.addEventListener('pointermove', onPointerMove );
  containerDom.addEventListener('pointerup', onPointerUp );
  

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