import { 
  Color, 
  Scene, 
  PerspectiveCamera, 
  WebGLRenderer,
} from 'three'


/**
 * @name 创建scene
 * @param {Oject} options 
 * @param {Array} groups 
 * @returns scene
 */
export function createScene(options = {}, groups = []) {
  const { 
    background
  } = {
    background: 0xffffff,
    ...options,
  }

  const scene = new Scene()
  scene.background = new Color(background)
  for (let i = 0; i < groups.length; i++) {
    scene.add(groups[i])
  }
  return scene
}

/**
 * @name 创建透视相机
 * @param {Object} options 
 * @param {Object} positions 相机位置
 * @returns camera
 */
export function createPerspectiveCamera(options = {}, positions = {}) {
  
  const {
    fov,
    containDom,
    near,
    far,
  } = {
    fov: 45, // 摄像机视锥体垂直视野角度
    dom : 1, // 摄像机视锥体长宽比
    containDom: window, // 容器
    far: 1000, // 摄像机视锥体远端面
    ...options
  }

  const {
    x,
    y,
    z,
  } = {
    x: 2,
    y: 2,
    z: 10,
    ...positions
  }

  const isWin = containDom instanceof Window
  const width = isWin ? window.innerWidth : containDom.clientWidth
  const height = isWin ? window.innerHeight : containDom.clientHeight
  const aspect = width / height 
  
  const camera = new PerspectiveCamera(fov, aspect, near, far)
  camera.position.x = x
  camera.position.y = y
  camera.position.z = z

  return camera
}

/**
 * @name 创建渲染器
 * @param {HTMLElement} contain 
 * @param {Object} options 
 * @returns renderer
 */
export function createRenderer(contain, options = {}) {
  const {
    antialias,
  } = {
    antialias: true, //  是否执行抗锯齿
    ...options
  }

  const params = { antialias }
  const renderer = new WebGLRenderer(params)
  const containDom = contain || window
  const isWin = containDom instanceof Window
  const width = isWin ? window.innerWidth : contain.clientWidth
  const height = isWin ? window.innerHeight : contain.clientHeight

  renderer.setSize(width, height)
  containDom.appendChild(renderer.domElement)
  
  return renderer
}


/**
 * @name 创建动画
 * @param {Scene} scene 
 * @param {Camera} camera 
 * @param {Renderer} renderer 
 * @param {Addon callback []} addonCbs 
 * @returns animate
 */
export function createAnimate(scene, camera, renderer, addonCbs = []) {
  function animate() {
    requestAnimationFrame(animate)
    addonCbs.forEach(cb => cb())
    renderer.render(scene, camera)
  }
  
  return animate
}