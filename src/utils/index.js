export const geoIndex = () => new Uint16Array([
  // 逆时针
  0,1,2, // 背面
  0,2,3,

  0,4,7, // 左面
  0,7,3,

  0,4,5, // 底面
  0,5,1,

  4,5,6, // 正面
  4,6,7,

  2,6,5, // 右面
  1,2,5,

  2,3,6, // 顶部
  3,7,6
])

/**
 * @name 根据索引获取几何体中的坐标
 * @param {Geometry} geo 
 * @param {Mumber} index 
 * @returns 
 */
export function getXYZByIndex(geo, index) {
  if (!geo?.attributes?.position) {
    console.warn('🚀~~~~~~几何体获取失败~~~~~~🚀', geo)
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
    console.warn('🚀~~~~~~几何体获取失败~~~~~~🚀', geo)
    return {}
  }
  const { x: x1, y: y1, z: z1 } = getXYZByIndex(geo, index1)
  const { x: x2, y: y2, z: z2 } = getXYZByIndex(geo, index2)
  return x1 === x2 && y1 === y2 && z1 === z2
}