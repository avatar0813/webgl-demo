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
  scene.rotateY(-2.2)

  // 2、相机 调整初始相机角度
  const camera = new THREE.PerspectiveCamera(45, containerDom.clientWidth / containerDom.clientHeight, 1, 5000)
  camera.position.z = 10
  camera.position.x = 2
  camera.position.y = 5

  // 3、添加几何图形
  // 顶点
  const verticesOfCube  = new Float32Array([
    1,0,0,
    0,0,-1,
    -1,0,0,
    0,0,1,
    0,1,0,
    0,-1,0
  ])
  const indicesOfFaces = [
      0,1,4,
      1,2,4,
      2,3,4,
      3,0,4,
      0,5,1,
      1,5,2,
      2,5,3,
      3,5,0

  ]
  const geometry = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, 2, 0)
  geometry.setIndex = new THREE.Uint16BufferAttribute(indicesOfFaces)
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

  function onPointerMove() {
    if (!activeInCube) return

    const face = activeIntersect.face
    const planeNormal = activeIntersect.normal // 平面法向量
    const verticeXYZArr = [] // 原面上的顶点坐标展开, verticeXYZArr中每三个元素表示一个顶点
    const verticeIndexArr = [] // 顶点索引集合
    const verticePointArr = [] // 订单三维坐标集合
    const updatePointArr = [] // 更新后的顶点坐标
    // 偏移量: 根据法向量长度(默认1) / 50 = 0.01
    const scaleDirection = planeNormal.clone().divideScalar(50)

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

    // position.arr上找到位置
    const geoPSArr = geometry.attributes.position.array
    for (let i = 0; i < geoPSArr.length; i+=3) {
      if (
        positionArr[0] === geoPSArr[i] && positionArr[1] === geoPSArr[i + 1] && positionArr[2] === geoPSArr[i + 2]
        || positionArr[3] === geoPSArr[i] && positionArr[4] === geoPSArr[i + 1] && positionArr[5] === geoPSArr[i + 2]
        || positionArr[6] === geoPSArr[i] && positionArr[7] === geoPSArr[i + 1] && positionArr[8] === geoPSArr[i + 2]
      ) {
        verticeXYZArr.push(i, i + 1, i + 2)
        verticeIndexArr.push(i / 3)
      }
    }

    // 设置新旧顶点坐标
    verticeIndexArr.forEach(vertice => {
      const originPointer = new THREE.Vector3(
        geometry.attributes.position.getX(vertice),
        geometry.attributes.position.getY(vertice),
        geometry.attributes.position.getZ(vertice),
      )
      verticePointArr.push(originPointer)
      updatePointArr.push(originPointer.add(scaleDirection))
    })

    for (let i = 0; i < verticeIndexArr.length; i++) {
      const vertice = verticeIndexArr[i]
      const point = updatePointArr[i]
      geometry.attributes.position.setXYZ(vertice, point.x, point.y, point.z)
    }

    geometry.attributes.position.needsUpdate = true
  }

  // 6、添加拖放控制
  function onpointerDown(event) {

    const rect = containerDom.getBoundingClientRect()
    pointer.x = ( (event.clientX - rect.x) / renderer.domElement.clientWidth ) * 2 - 1;
    pointer.y = - ( (event.clientY - rect.y) / renderer.domElement.clientHeight ) * 2 + 1;
    // 根据点与相机位设置射线
    raycaster.setFromCamera( pointer, camera )
    const intersects = raycaster.intersectObject(cube)
    
    if (intersects.length > 0) {
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