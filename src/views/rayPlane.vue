<template>
  <div>
    <h3>射线与平面的交点</h3>
    <div ref="container" class="container"></div>
  </div>
</template>

<script setup>
import { AxesHelper, GridHelper, BoxGeometry, BufferGeometry, LineBasicMaterial, MeshMatcapMaterial, Mesh, Vector3, Line, Plane, Ray, PlaneHelper } from 'three'
import {
  createScene,
  createPerspectiveCamera,
  createRenderer,
  createAnimate,
} from '@/utils/three/editor'
import {
  createOrbitControls
} from '@/utils/three/addon'

import { onMounted, ref } from 'vue'

const container = ref(null)

onMounted(() => {
  // 场景
  // 添加坐标轴网格线支持
  const axesHelper = new AxesHelper(20)
  const gridHelper = new GridHelper(20, 20)
  const scene = createScene({ background: 0xb6d4ff }, [axesHelper, gridHelper])
  const camera = createPerspectiveCamera({ containDom: container.value })

  const startPoint = new Vector3(1, 1, 1)
  const endPoint = new Vector3(1, 1, 2)
  // 测试线
  const points = [startPoint, endPoint]
  const geometry = new BufferGeometry().setFromPoints(points)
  const material = new LineBasicMaterial({ color: 0xff0000 })
  const line = new Line(geometry, material)
  scene.add(line)

  // 添加平面
  const vecA = new Vector3(1, 0, 0)
  const vecB = new Vector3(0, 1, 0)
  const normal = new Vector3().crossVectors(vecA, vecB).normalize()
  const plane = new Plane().setFromNormalAndCoplanarPoint(normal, vecA)
  const helper = new PlaneHelper(plane, 10, 0xffff00)
  scene.add(helper)

  // 添加射线
  const rayDirection = endPoint.clone().sub(startPoint).normalize()
  const ray = new Ray(startPoint.clone(), rayDirection)


  // 渲染
  const renderer = createRenderer(container.value)
  const orbitControl = createOrbitControls(camera, renderer.domElement)

  const animateCbs = [orbitControl.update]
  const animate = createAnimate(scene, camera, renderer, animateCbs)
  animate()
})



// 直线与平面的交点，直线向量vecA, 由向量vecB+vecC构成的面
function vecWithPlaneIntersectPoint(line, vecA, vecB) {
  const { startPoint, endPoint } = line
  const normal = new Vector3().crossVectors(vecA, vecB).normalize()
  const plane = new Plane().setFromNormalAndCoplanarPoint(normal, vecB)
  const rayDirection = startPoint.clone().sub(endPoint).normalize()
  const ray = new Ray(startPoint.clone(), rayDirection)
  console.warn(ray)
  // 平行
  if (rayDirection.dot(normal) === 0) return null

  const intersectionPoint = new Vector3()
  ray.intersectPlane(plane, intersectionPoint)
  return intersectionPoint
}
function vecWithPlaneIntersectPoint2(line, vecA, vecB) {
  const { startPoint, endPoint } = line

  const planeNormal = new Vector3().crossVectors(vecA, vecB).normalize()
  const plane = new Plane(planeNormal, 0) // Assume plane passes through origin
  const helper = new THREE.PlaneHelper(plane, 1, 0xffff00)
  const rayDirection = startPoint.clone().sub(endPoint).normalize()
  const ray = new Ray(startPoint.clone(), rayDirection)

  const intersectionPoint = ray.intersectPlane(plane)
  return intersectionPoint
}


function testInterest() {
  const startPoint = new Vector3(1, 1, 1)
  const endPoint = new Vector3(1, 1, 2)
  const line = { startPoint, endPoint }
  const axisX = new Vector3(5, 0, 0)
  const axisY = new Vector3(0, 5, 0)
  const intersectPoint = vecWithPlaneIntersectPoint(line, axisX, axisY)
  console.log('交点：', intersectPoint)
}

testInterest()
</script>

<style lang="scss" scoped></style>