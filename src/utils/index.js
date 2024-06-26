import { Vector3, Ray } from "three"

export * from "./three/addon"
export * from "./three/editor"

/**
 * @name 获取标准正方体face索引
 * @returns Uint16Array
 */
export const geoIndex = () =>
  new Uint16Array([
    // 逆时针
    0,
    1,
    2, // 背面
    0,
    2,
    3,

    0,
    4,
    7, // 左面
    0,
    7,
    3,

    0,
    4,
    5, // 底面
    0,
    5,
    1,

    4,
    5,
    6, // 正面
    4,
    6,
    7,

    2,
    6,
    5, // 右面
    1,
    2,
    5,

    2,
    3,
    6, // 顶部
    3,
    7,
    6,
  ])

/**
 * @name 根据索引获取几何体中的坐标
 * @param {Geometry} geo
 * @param {Mumber} index
 * @returns
 */
export function getXYZByIndex(geo, index) {
  if (!geo?.attributes?.position) {
    console.warn("🚀~~~~~~几何体获取失败~~~~~~🚀", geo)
    return {}
  }
  return {
    x: geo.attributes.position.getX(index),
    y: geo.attributes.position.getY(index),
    z: geo.attributes.position.getZ(index),
  }
}

/**
 * @name 判断索引顶点位置是否相同
 * @param {Geometry} geo
 * @param {Index} index1 索引1
 * @param {Index} index2 索引2
 * @return {Boolean} ture: 相同, false: 不相同
 */
export function diffXYZByIndex(geo, index1, index2) {
  if (!geo?.attributes?.position) {
    console.warn("🚀~~~~~~几何体获取失败~~~~~~🚀", geo)
    return {}
  }
  const { x: x1, y: y1, z: z1 } = getXYZByIndex(geo, index1)
  const { x: x2, y: y2, z: z2 } = getXYZByIndex(geo, index2)
  return x1 === x2 && y1 === y2 && z1 === z2
}

/**
 * @name 获取归一化坐标
 * @param { number } width 画布宽
 * @param { number } height 画布高
 * @param { number } x 点击 x 坐标
 * @param { number } y 点击 y 坐标
 * @param { number } z NDC Z轴，区间【0，1】 0:近面端，0.5:远近面中间，1:远面端
 */
export function getDNC(width, height, x, y, z = 0.5) {
  const dx = (x / width) * 2 - 1
  const dy = -(y / height) * 2 + 1
  return new Vector3(dx, dy, z)
}

/**
 * @param 射线与平面交点
 * @param {Vector3} startPoint
 * @param {Vector3} endPoint
 * @param {Vector3} plane
 * @returns { Vector3 | null }
 */
export function intersectRayPlane(startPoint, endPoint, plane) {
  const normalize = endPoint.clone().sub(startPoint).normalize()
  const ray = new Ray(startPoint, normalize)
  const target = new Vector3()
  ray.intersectPlane(plane, target)
  return target
}
