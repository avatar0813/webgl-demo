<template>
  <div>
    <h3>绘制楼梯</h3>
    <div ref="container" class="container"></div>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { ref, onMounted } from 'vue'
import {
  createScene,
  createPerspectiveCamera,
  createRenderer,
  createAnimate,
} from '@/utils/three/editor'
import {
  createOrbitControls
} from '@/utils/three/addon'
import { getStepStart, getStep, getWell, stepWidth, stepHeight, getPlat, stairWidth, wellWidth, wellHeight, platWidth, platInterWidth, wellLength, stairAllHeight } from './graph'

const container = ref(null)

onMounted(() => {
  // 创建场景
  const containerDom = container.value
  const axesHelper = new THREE.AxesHelper( 5000 )
  const gridHelper = new THREE.GridHelper( 10000, 20 )
  const scene = createScene({ background: 0xb6d4ff }, [axesHelper, gridHelper])
  const camera = createPerspectiveCamera({ containDom: containerDom, far: 20000 }, {x: 200, y: 1000, z: 10000})
  const renderer = createRenderer(containerDom)
  const orbitControl = createOrbitControls(camera, renderer.domElement)

  // 4、创建图形
  scene.add(getStair())

  const animateCbs = [orbitControl.update]
  const animate = createAnimate(scene, camera, renderer, animateCbs)
  animate()
})

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