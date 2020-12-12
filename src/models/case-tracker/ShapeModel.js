import {generateColorFromPicker} from "@/functions/conversation";

export class ShapeModel {
  id = 0;
  title = 'Задача 1';
  shapeType = 'rectangle'; /* rectangle | ellipse */
  params = {
    borderColor: '#00a6ed',
    cornerStrokeColor: '#00a6ed',
    cornerColor: 'white',
    cornerSize: 6,
    transparentCorners: false
  };

  isSelected = false;

  constructor(id, title, shapeType, params) {
    this.id = id;
    this.title = title ? title : this.fillTitle(shapeType);
    this.shapeType = shapeType;
    if (shapeType === 'rectangle') {
      this.params = Object.assign(this.params, {
        left: 0,
        top: 0,
        fill: 'transparent',
        strokeWidth: 2,
        width: 0,
        height: 0,
        lockRotation: true,
        // lockScalingX: true,
        // lockUniScaling: true,
      });
    } else if (shapeType === 'ellipse') {
      this.params = Object.assign(this.params, {
        left: 0,
        top: 0,
        fill: 'transparent',
        strokeWidth: 2,
        radius: 0,
        originX: 'left',
        originY: 'top',
        rx: 0,
        ry: 0,
        angle: 0,
        lockRotation: true,
      });
    }
    if (params.stroke) {
      params.stroke = (params.stroke === 'auto') ? `#${generateColorFromPicker()}` :
        `#${params.stroke.replace(/#/g, '')}`;
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