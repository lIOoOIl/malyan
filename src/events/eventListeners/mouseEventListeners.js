import EVENTS from '../EVENTS'
import triggerEvent from '../triggerEvent'
import math from '../../utils/math'
import _ from '../../utils/tool'

let isClickEvent = true
let preventClickTimeout
const clickDelay = 200

function preventClickHandler() {
  isClickEvent = false
}

function mouseDown(e) {
  const element = this
  preventClickTimeout = setTimeout(preventClickHandler, clickDelay)
  // 当鼠标mousedown阻止默认move事件，待判断后再在document上注册该move事件
  this.removeEventListener('mousemove', mouseMove)
  const startPoint = {
    client: {
      x: e.clientX,
      y: e.clientY
    },
    page: {
      x: e.pageX,
      y: e.pageY
    },
    canvas: math.pageToCanvas(element, e.clientX, e.clientY)
  }
  let lastPoint = _.cloneDeep(startPoint)
  const eventData = {
    event: e,
    element,
    startPoint,
    lastPoint,
    currentPoint: startPoint,
    deltaPoint: {
      x: 0,
      y: 0
    },
    type: EVENTS.OBJECT_MOUSE_DOWN
  }
  triggerEvent(eventData.element, EVENTS.OBJECT_MOUSE_DOWN, eventData)

  const onMouseMove = function (e) {
    // console.log('onMouseMove')
    const eventType = EVENTS.OBJECT_MOUSE_DRAG
    const currentPoint = {
      client: {
        x: e.clientX,
        y: e.clientY
      },
      page: {
        x: e.pageX,
        y: e.pageY
      },
      canvas: math.pageToCanvas(element, e.clientX, e.clientY)
    }

    // Calculate delta values in page coordinates
    const deltaPoint = {
      client: math.point.subtract(currentPoint.client, lastPoint.client),
      page: math.point.subtract(currentPoint.page, lastPoint.page),
      canvas: math.point.subtract(currentPoint.canvas, lastPoint.canvas),
    }

    const eventData = {
      event: e,
      element,
      startPoint,
      lastPoint,
      currentPoint,
      deltaPoint,
      type: eventType,
    }
    triggerEvent(eventData.element, eventType, eventData)
    lastPoint =  _.cloneDeep(currentPoint)
  }
  const onMouseUp = function () {
    // console.log('onMouseUp')
    clearTimeout(preventClickTimeout)
    let eventType = EVENTS.MOUSE_UP
    if (isClickEvent) {
      eventType = EVENTS.ROOT_CLICK_PRIVATE
    }

    const eventData = {
      event: e,
      element,
      type: eventType,
      startPoint
    }

    triggerEvent(element, eventType, eventData)

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    element.addEventListener('mousemove', mouseMove)
    isClickEvent = true
  }

  // document注册move和up事件
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function mouseMove() {
  // console.log('mouseMove')
}

function mouseDoubleClick() {
  // console.log('mouseDoubleClick')
}

function disable(element) {
  element.removeEventListener('mousedown', mouseDown)
  element.removeEventListener('mousemove', mouseMove)
  element.removeEventListener('dblclick', mouseDoubleClick)
}

function enable(element) {
  // Prevent handlers from being attached multiple times
  disable(element)
  element.addEventListener('mousedown', mouseDown)
  element.addEventListener('mousemove', mouseMove)
  element.addEventListener('dblclick', mouseDoubleClick)
}

export default {
  enable,
  disable
}
