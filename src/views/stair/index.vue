<template>
  <div>
    <h3>绘制楼梯</h3>
    <div ref="container" class="container"></div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { ref, onMounted } from 'vue'
import { getStepStart, getStep, getWell, stepWidth, stepHeight, getPlat, stairWidth, wellWidth, wellHeight, platWidth, platInterWidth, wellLength, stairAllHeight } from './graph'
const container = ref(null)

onMounted(() => {
  initScene()
})

const initScene = () => {
  // 1、创建场景
  const containerDom = container.value
  const scene = getScene()
  // 2、创建相机
  const camera = getCamera(containerDom)
  // 3、初始渲染
  const renderer = getRenderer(containerDom)
  const orbitControl = new OrbitControls(camera, renderer.domElement)

  // 4、创建图形
  scene.add(getStair())
  
  function animate() {
    requestAnimationFrame(animate)
    orbitControl.update()
    renderer.render(scene, camera)
  }
  animate()
}


// 创建场景
function getScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#b6d4ff')
  // 添加坐标轴网格线支持
  const axesHelper = new THREE.AxesHelper( 5000 )
  const gridHelper = new THREE.GridHelper( 10000, 20 )
  scene.add( axesHelper ).add( gridHelper )

  return scene
}
// 创建相机
function getCamera(dom) {
  if (!dom) {
    console.warn('🚀~~~~~~创建相机需要一个容器~~~~~~🚀')
    return
  }
  const camera = new THREE.PerspectiveCamera(45, dom.clientWidth / dom.clientHeight, 1, 20000)
  camera.position.z = 10000
  camera.position.x = 200
  camera.position.y = 1000
  
  return camera
}

// 创建渲染器
function getRenderer(dom) {
  if (!dom) {
    console.warn('🚀~~~~~~创建渲染器需要一个容器~~~~~~🚀')
    return
  }
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(dom.clientWidth, dom.clientHeight)
  dom.appendChild( renderer.domElement )

  return renderer
}

// 创建楼梯分组
function getStairGroup() {
  const group = new THREE.Group()

  // 1、添加阶梯：17阶step，1阶stepStart
  const stepCount = 18
  const stepGroup = new THREE.Group()
  const stepStart = getStepStart()
  stepGroup.add(stepStart)
  const step = getStep()
  let cloneStep = step.clone()
  for (let i = 0; i < stepCount - 1; i++) {
    // 阶梯偏移定位
    cloneStep.translateY(stepHeight * (i))
    cloneStep.translateX(-(stepWidth * (i + 1)))
    stepGroup.add(cloneStep)
    cloneStep = step.clone()
  }
  group.add(stepGroup)

  // 2、添加平台
  const plat = getPlat()
  plat.translateX(-(stepCount - 1) * stepWidth - platInterWidth)
  plat.translateY((stepCount - 1) * stepHeight)
  plat.translateZ(-(stairWidth + wellWidth))
  group.add(plat)

  return group
}

// 创建楼梯
function getStair() {
  const group = new THREE.Group()
  const stair1 = getStairGroup()
  const stair2 = stair1.clone()
  const well = getWell()
  stair2.rotateY(Math.PI)

  // 设置偏移
  const stairWidth = platWidth + platInterWidth + stepWidth * 18
  stair1.translateX((stairWidth - stepWidth) / 2)
  stair2.translateX((stairWidth - stepWidth) / 2)
  // 偏移出井宽
  stair1.translateZ(wellWidth / 2)
  stair2.translateZ(wellWidth / 2)
  // 井宽偏移
  well.translateX(- wellLength / 2)
  well.translateZ(- wellWidth / 2)
  well.translateY(stairAllHeight - wellHeight)
  group.add(stair1, stair2, well)

  return group
}

</script>

<style lang="scss" scoped>

</style>