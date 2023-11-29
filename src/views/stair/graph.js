import * as THREE from 'three'
import { geoIndex } from '@/utils'
/**
 * @name 通用生成几何体
 * @param {Float32Array} vertices 顶点坐标
 * @param {Uint16Array} indexs 顶点索引
 * @param {Material} material 材质
 * @return {Mesh} 网格图形
 */
export function commonGenerateGeometry(vertices, indexs, material) {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  geometry.setIndex(new THREE.BufferAttribute(indexs, 1))
  geometry.computeVertexNormals()
  
  return new THREE.Mesh(geometry, material)
}
// 平台
export const platWidth = 1140 // (绿板)平台宽度
export const platHeight = 100 // (绿板)平台高度
export const platInterWidth = 200 // (黄板)平台连接处宽度
export const platInterHeight = 260  // 设定连接处高度为井宽高度

// 阶梯
export const stepWidth = 260 // 阶梯宽
export const stepHeight = 130 // 阶梯高、设计图上没有标明

// 井
export const wellWidth = 100 // 井宽
export const wellHeight = 260 // 井高： 此处设置跟楼梯宽一样
export const wellLength = stepWidth * 17 - (platWidth + platInterWidth) // 井总长度

// 楼梯
export const stairWidth = 1200 // 楼梯宽
export const stairAllWidth = stairWidth * 2 + wellWidth // 楼梯总宽 = 两个楼梯 + 井宽
export const stairAllHeight = stepHeight * 17 + platInterHeight

// 踏步开始
export function getStepStart() {
  // X轴：阶梯宽，Y轴：阶梯高，Z轴：楼梯宽
  const vertices = new Float32Array([
    0, 0, 0,
    stepWidth, 0, 0,
    stepWidth, stepHeight, 0,
    0, stepHeight, 0,
    0, 0, stairWidth,
    stepWidth, 0, stairWidth,
    stepWidth, stepHeight, stairWidth,
    0, stepHeight, stairWidth,
  ])
  const indexs = geoIndex()
  const material = new THREE.MeshMatcapMaterial( { color: 0xff1c1c, side: THREE.DoubleSide } )
  const cube = commonGenerateGeometry(vertices, indexs, material)
  return cube
}

// 踏步中间节
export function getStep() {
  // X轴：阶梯宽，Y轴：阶梯高，Z轴：楼梯宽
  const vertices = new Float32Array([
    0, stepHeight, 0,
    stepWidth, 0, 0,
    stepWidth, stepHeight * 2, 0,
    0, stepHeight * 2, 0,
    0, stepHeight, stairWidth,
    stepWidth, 0, stairWidth,
    stepWidth, stepHeight * 2, stairWidth,
    0, stepHeight * 2, stairWidth,
  ])
  const indexs = geoIndex()

  const material = new THREE.MeshMatcapMaterial( { color: 0xff1c1c, side: THREE.DoubleSide } )
  const cube = commonGenerateGeometry(vertices, indexs, material)
  return cube
}

// 楼梯平台
export function getPlat() {
  let group = new THREE.Group()
  // 绿板 X轴：平台宽度，Y轴：平台高度, Z轴：楼梯总宽度
  const greenVertices = new Float32Array([
    0, 0, 0,
    platWidth, 0, 0,
    platWidth, platHeight, 0,
    0, platHeight, 0,
    0, 0, stairAllWidth,
    platWidth, 0, stairAllWidth,
    platWidth, platHeight, stairAllWidth,
    0, platHeight, stairAllWidth,
  ])
  const greenIndexs = geoIndex()

  const greenMaterial = new THREE.MeshMatcapMaterial( { color: 0x6cffff, side: THREE.DoubleSide } )
  const greenCube = commonGenerateGeometry(greenVertices, greenIndexs, greenMaterial)
  // 偏移出一个连接处位置
  greenCube.translateX(-platWidth)
  greenCube.translateY(platInterHeight - platHeight)
  group.add(greenCube)
  
  // 黄板 X轴：连接处宽度， Y轴：连接处高度， Z轴：平台总宽度
  const yellowVertices = new Float32Array([
    0, 0, 0,
    platInterWidth, 0, 0,
    platInterWidth, platInterHeight, 0,
    0, platInterHeight, 0,
    0, 0, stairAllWidth,
    platInterWidth, 0, stairAllWidth,
    platInterWidth, platInterHeight, stairAllWidth,
    0, platInterHeight, stairAllWidth,
  ])
  const yellowIndexs = geoIndex()

  const yellowMaterial = new THREE.MeshMatcapMaterial( { color: 0xffff6c, side: THREE.DoubleSide } )
  const yellowCube = commonGenerateGeometry(yellowVertices, yellowIndexs, yellowMaterial)
  group.add(yellowCube)

  return group
}

// 井宽
export function getWell() {
  // X轴：楼梯总长度减去两个平台的宽度，Y轴：井高度, Z轴：井宽度
  const vertices = new Float32Array([
    0, 0, 0,
    wellLength, 0, 0,
    wellLength, wellHeight, 0,
    0, wellHeight, 0,
    0, 0, wellWidth,
    wellLength, 0, wellWidth,
    wellLength, wellHeight, wellWidth,
    0, wellHeight, wellWidth,
  ])
  const indexs = geoIndex()
  
  const material = new THREE.MeshMatcapMaterial( { color: 0x6c6cff, side: THREE.DoubleSide } )
  const cube = commonGenerateGeometry(vertices, indexs, material)
  return cube
}