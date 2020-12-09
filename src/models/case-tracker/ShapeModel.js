export class ShapeModel {
  id = 0;
  title = 'Задача 1';
  shapeType = 'rectangle'; /* rectangle | ellipse */
  params = {

  };

  constructor(id, title, shapeType, params) {
    this.id = id;
    this.title = title ? title : this.fillTitle(shapeType);
    this.shapeType = shapeType;
    if (shapeType === 'rectangle') {
      this.params = {
        left: 0,
        top: 0,
        fill: 'transparent',
        stroke: '#00a6ed',
        strokeWidth: 2,
        width: 0,
        height: 0,
        lockRotation: true,
        // lockScalingX: true,
        // lockUniScaling: true,
      }
    } else if (shapeType === 'ellipse') {
      this.params = {
        left: 0,
        top: 0,
        fill: 'transparent',
        stroke: '#00a6ed',
        strokeWidth: 2,
        radius: 0,
        originX: 'left',
        originY: 'top',
        rx: 0,
        ry: 0,
        angle: 0,
        lockRotation: true,
      }
    }
    this.params = Object.assign(this.params, params);
  }

  fillTitle(shapeType) {
    if (shapeType === 'rectangle') {
      return 'Rectangle 1';
    } else if (shapeType === 'ellipse') {
      return 'Ellipse 1';
    } else {
      return 'Rectangle 1';
    }
  }
}