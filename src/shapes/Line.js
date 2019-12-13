/* eslint-disable */
import EventTarget from '../events/EventTarget'
import Shape from '../Shape'
import triggerEvent from '../events/triggerEvent'
import { mix } from '../utils/extend'

export class Line extends mix(Shape, EventTarget) {
  constructor(options = {}) {
    super(options)
    const { name, x1, y1, x2, y2 } = options
    this.name = name
    this.x1 = x1 || 0
    this.y1 = y1 || 0
    this.x2 = x2 || 20
    this.y2 = y2 || 20
  }
  render(ctx) {
    ctx.save()
    ctx.beginPath()
    this.setCtxProps && this.setCtxProps(ctx)
    ctx.moveTo(this.x1, this.y1)
    ctx.lineTo(this.x2, this.y2)
    this.stroke && ctx.stroke()
    ctx.restore()
  }
  on(type, callback) {
    this.addEventListener(type, callback)
  }
  fire(type) {
    triggerEvent(this, type)
  }
}

export default Line