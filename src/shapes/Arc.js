import EventTarget from '../events/EventTarget'
import Shape from '../Shape'
import triggerEvent from '../events/triggerEvent'
import { mix } from '../utils/extend'

export class Arc extends mix(Shape, EventTarget) {
  constructor(options = {}) {
    super(options)
    const { name, x, y, radius, startAngle, endAngle, anticlockwise} = options
    this.name = name
    this.x = x || 0
    this.y = y || 0
    this.radius = radius
    this.anticlockwise = anticlockwise || false
    this.startAngle = startAngle || 0
    this.endAngle = endAngle || Math.PI * 2
  }
  render(ctx) {
    ctx.save()
    const matrix = this.matrix.elements
    ctx.transform(matrix[0], matrix[3], matrix[1], matrix[4], matrix[2], matrix[5])
    ctx.beginPath()
    this.setCtxProps && this.setCtxProps(ctx)
    ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise)
    this.close && ctx.closePath()
    this.fill && ctx.fill()
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

export default Arc