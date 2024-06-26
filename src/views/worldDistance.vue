<template>
  <div>
    <h3>像素转坐标距离</h3>
    <div ref="container" class="container"></div>
  </div>
</template>

<script setup>
import { AxesHelper, GridHelper, CameraHelper, BoxGeometry, BufferGeometry, Mesh, Vector3, Plane } from 'three'
import {
  createScene,
  createPerspectiveCamera,
  createRenderer,
  createAnimate,
  createOrbitControls,
  getDNC,
  intersectRayPlane,
} from '@/utils'

import { onMounted, ref } from 'vue'

const container = ref(null)

onMounted(() => {
  // 场景
  // 添加坐标轴网格线支持
  const axesHelper = new AxesHelper(20)
  const gridHelper = new GridHelper(20, 20)
  gridHelper.rotateX(Math.PI / 2);
  const camera = createPerspectiveCamera({ containDom: container.value }, { x: 0, y: -50, z: 0 })
  const cameraHelper = new CameraHelper(camera);
  const scene = createScene({ background: 0xb6d4ff }, [axesHelper, gridHelper, cameraHelper])

  const startPoint = new Vector3(1, 0, 1)
  const endPoint = new Vector3(1, 1, 1)

  // 渲染
  const renderer = createRenderer(container.value)
  const orbitControl = createOrbitControls(camera, renderer.domElement)

  const animateCbs = [orbitControl.update]
  const animate = createAnimate(scene, camera, renderer, animateCbs)
  animate()

  const clickHandler = createClickHandler(camera);
  renderer.domElement.addEventListener('click', clickHandler)
  
})

function getCanvasRect() {
  const canvasList = document.getElementsByTagName('canvas');
  const canvas = canvasList?.[0]
  if (!canvas) return null;
  return canvas.getBoundingClientRect();
}

function getCanvasNDC(pageX, pageY) {
  const rect = getCanvasRect();
  if (!rect) return;

  const { width, height, left, top } = rect;
  
  return getDNC(width, height, pageX - left, pageY - top, 1);
}

/**
 * @name 透视相机获取世界坐标 与坐标系平面的交点
 * @param offsetX 
 * @param offsetY 
 * @param camera 
 * @return { Vector3 }
 */
function getWorldPosition(pageX, pageY, camera) {
  const { position } = camera;
  // 找到远端面上的点
  const dnc = getCanvasNDC(pageX, pageY);
  const farPoint = new Vector3().set(dnc.x, dnc.y, dnc.z).unproject(camera);
  // TODO: 相机与坐标平面的交点
  const axesPlane = new Plane().setFromNormalAndCoplanarPoint(new Vector3(0,0,1), new Vector3(0,0,0));
  const interestPoint = intersectRayPlane(position, farPoint, axesPlane);
  return interestPoint;
}

/**
 * @name 像素距离转世界距离
 * @param pixel 像素距离
 * @return { number } 
 */
function getPixelToWorldDistance(pixel, camera) {
  const rect = getCanvasRect();
  if (!rect) return;

  const { position } = camera;
  const axesPlane = new Plane().setFromNormalAndCoplanarPoint(new Vector3(0,0,1), new Vector3(0,0,0));
  const { width, height } = rect;

  const dnc1 = getDNC(width, height, 0, 0, 1);
  const farPoint1 = new Vector3().set(dnc1.x, dnc1.y, dnc1.z).unproject(camera);
  const interestPoint1 = intersectRayPlane(position, farPoint1, axesPlane);

  const dnc2 = getDNC(width, height, 0, pixel, 1);
  const farPoint2 = new Vector3().set(dnc2.x, dnc2.y, dnc2.z).unproject(camera);
  const interestPoint2 = intersectRayPlane(position, farPoint2, axesPlane);
  return interestPoint1.distanceTo(interestPoint2)
  

}

function createClickHandler(camera) {
  return (e) => {
    const { pageX, pageY } = e;
    const worldPos = getWorldPosition(pageX, pageY, camera);
    console.log('点击世界坐标：', camera, worldPos);
    console.log('像素距离差:', getPixelToWorldDistance(10, camera));
  }
}


</script>

<style lang="scss" scoped></style> 