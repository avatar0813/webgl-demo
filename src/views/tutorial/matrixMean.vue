<template>
  <div>
    <h3>矩阵的意义</h3>
    <div ref="container" class="container"></div>
    <div class="tips">
      <p class="tips-title">
        矩阵的意义：
      </p>
      <p>
        当一个矩形position: (0, 0, 0), rotation: (0, 0, 0), scale:(1,1,1) 时；<br>
        他的matrix为： [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]；<br>
        可以理解为由 a(1,0,0,0), b(0,1,0,0), c(0,0,1,0);  abc三个方向以及定位点是 (0,0,0,1)组成的坐标系;<br>
      </p>
      <p class="tips-warn">
        实验的矩阵相乘没有体现出 A*B 与 B*A的不满足交换律规则。
      </p>
    </div>
  </div>
</template>

<script setup>
import { AxesHelper, GridHelper, BoxGeometry, MeshMatcapMaterial, Mesh, Matrix4, Euler } from 'three'
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
  const axesHelper = new AxesHelper( 20 );
  const gridHelper = new GridHelper( 20, 20 );
  const scene = createScene({ background: 0xb6d4ff }, [axesHelper, gridHelper])
  const camera = createPerspectiveCamera({containDom: container.value })

  // 添加几何图形
  const cube = getCube(1,2,3);
  console.log("cube:", cube);
  scene.add(cube)

   // 渲染
  const renderer = createRenderer(container.value)
  const orbitControl = createOrbitControls(camera, renderer.domElement)

  const animateCbs = [orbitControl.update]
  const animate = createAnimate(scene, camera, renderer, animateCbs)
  animate()
})

// 获取几何图形
function getCube(x = 0, y = 0, z = 0) {
  const geometry = new BoxGeometry( 2, 2, 2 );
  const material = new MeshMatcapMaterial( { color: 0x8c8f88 } );
  const cube = new Mesh( geometry, material );

  cube.position.x = x
  cube.position.y = y
  cube.position.z = z
  return cube
}


// 新建一个矩阵
const matrixA = new Matrix4()
  // 进行X轴旋转45°
  // matrixA.makeRotationFromEuler(new Euler(Math.PI / 4, 0, 0));
  // 进行Y轴旋转45°
  // matrixA.makeRotationFromEuler(new Euler(0, Math.PI / 4, 0));
  // // 进行Z轴旋转45°
  matrixA.makeRotationFromEuler(new Euler(0, 0, Math.PI / 4));
  // 进行y, Z轴旋转45°
  // matrixA.makeRotationFromEuler(new Euler(0, Math.PI / 4, Math.PI / 4));
const matrixB = new Matrix4();
matrixB.makeRotationFromEuler(new Euler(0, 0, Math.PI))

console.log('矩阵计算：',  matrixA.premultiply(matrixB), matrixA, matrixB);
</script>

<style lang="scss" scoped>

</style>