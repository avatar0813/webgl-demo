<template>
  <div>
    <h3>拉伸几何体</h3>
    <div ref="container" class="container"></div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';

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
  // const gridHelper = new THREE.GridHelper( 20, 20 );
  scene.add( axesHelper )

  // 2、相机 调整初始相机角度
  const camera = new THREE.PerspectiveCamera(45, containerDom.clientWidth / containerDom.clientHeight, 1, 1000)
  camera.position.z = 10;
  camera.position.x = 2;
  camera.position.y = 2;

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
  const materials = new THREE.MeshMatcapMaterial( { color: 0xffffff, side: THREE.DoubleSide } )
  const cube = new THREE.Mesh( geometry, materials );
  const normalsHelper = new VertexNormalsHelper( cube, 5, 0x00ff00, 5 )
  scene.add(cube).add(normalsHelper)

   // 4、渲染
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(containerDom.clientWidth, containerDom.clientHeight)
  containerDom.appendChild( renderer.domElement )
  // 添加轨道控制器 使其可以拖动切换视角
  const orbitControl = new OrbitControls(camera, renderer.domElement);

  // 5、添加射线hover face
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  let activeInCube = false
  let activeIntersect = null

  // <-------->
  function onPointerMove( ) {
    if (!activeInCube) return
    const face = activeIntersect.face
    // 平面法向量
    const planeNormal = activeIntersect.normal
    console.log(face, planeNormal)
    const indexA = new THREE.Vector3(
      geometry.attributes.position.getX(face.a),
      geometry.attributes.position.getY(face.a),
      geometry.attributes.position.getZ(face.a),
    )
    const indexB = new THREE.Vector3(
      geometry.attributes.position.getX(face.b),
      geometry.attributes.position.getY(face.b),
      geometry.attributes.position.getZ(face.b),
    )
    const indexC = new THREE.Vector3(
      geometry.attributes.position.getX(face.c),
      geometry.attributes.position.getY(face.c),
      geometry.attributes.position.getZ(face.c),
    )

    // 偏移量
    const offsetValue = 1.1
    console.log('index1:', indexA, indexB, indexC)
    const scaleDirection = planeNormal.clone().multiplyScalar(offsetValue)
    indexA.add(scaleDirection)
    indexB.add(scaleDirection)
    indexC.add(scaleDirection)
    console.log('index2:', indexA, indexB, indexC)
    const faceArr = [face.a, face.b, face.c]
    const indexArr =  [indexA, indexB, indexC]
    for (let i = 0; i < faceArr.length; i++) {
      const vertice = faceArr[i]
      const index = indexArr[i]
      console.log('设置位置', vertice, index.x, index.y, index.z)
      geometry.attributes.position.setXYZ(vertice, index.x, index.y, index.z)
    }

    console.warn(geometry.attributes.position)
    geometry.attributes.position.needUpdate = true
    geometry.computeBoundingBox()
    geometry.computeBoundingSphere()
    geometry.computeVertexNormals()
    renderer.render( scene, camera )
    normalsHelper.update()
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

      // const offsetVector = new THREE.Vector3(0.5, 0, 0)
      // 找到顶点坐标
      // 
      // cube.position.add(offsetVector)
      renderer.render( scene, camera )
      normalsHelper.update()
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
    normalsHelper.update()
    renderer.render(  scene, camera );
  }
  animate()
}

/**
 * @name 修改几何体
 * @param {geometry} geo 几何体
 * @param {Index} index 顶点索引
 * @param {Object} skews 偏移量对象
 */
function changeGeoPosition(geo, index, skews = {}) {
  const originX = geo.attributes.position.getX(index)
  const originY = geo.attributes.position.getY(index)
  const originZ = geo.attributes.position.getZ(index)
  const { x, y, z } = skews
  geo.attributes.position.setXYZ(index, originX + x, originY + y, originZ + z)
  return geo
}
</script>

<style lang="scss" scoped>

</style>