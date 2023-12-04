import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { DragControls } from 'three/addons/controls/DragControls.js'
import { isFunction } from '../tools'

/**
 * @name 创建轨道控制器
 * @param {Camera} camera 
 * @param {HTMLElement} renderDom 
 * @returns orbitControl
 */
export function createOrbitControls(camera, renderDom) {
  const orbitControl = new OrbitControls(camera, renderDom)
  return orbitControl
}

/**
 * @name 创建拖放控制器
 * @param {Object} options 
 * @returns dragControl
 */
export function createDragControls(options = {}) {
  const {
    objects = [],
    camera,
    dom,
    dragstart,
    dragend,
    dragmove,
  } = {
    ...options
  }
  const dragControl = new DragControls(objects, camera, dom)
  Object.entries({ dragstart, dragend, dragmove }).forEach(([eventName, cb]) => {
    if (isFunction(cb)) {
      dragControl.addEventListener(eventName, cb)
    }
  })
  return dragControl
}
