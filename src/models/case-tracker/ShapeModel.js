import {getRealColor} from "@/functions/case-tracker/projectsF";

export class ShapeModel {
  id = 0;
  title = 'Задача 1';
  shapeType = 'rectangle'; /* rectangle | ellipse */
  params = {};

  isSelected = false;

  constructor(id, title, shapeType, params) {
    this.id = id;
    this.title = title ? title : this.fillTitle(shapeType);
    this.shapeType = shapeType;
    if (shapeType === 'rectangle') {
      this.params = Object.assign(ShapeModel.commonParams(), {
        fill: 'transparent',
        strokeWidth: 2,
        width: 0,
        height: 0,
        // lockScalingX: true,
        // lockUniScaling: true,
      });
    } else if (shapeType === 'ellipse') {
      this.params = Object.assign(ShapeModel.commonParams(), {
        fill: 'transparent',
        strokeWidth: 2,
        radius: 0,
        originX: 'left',
        originY: 'top',
        rx: 0,
        ry: 0,
        angle: 0,
      });
    } else if (shapeType === 'marker') {
      this.params = Object.assign(ShapeModel.commonParams(), {
        width: 0,
        height: 0,
        hasControls: false,
      });
    }
    if (params.stroke) {
      params.stroke = getRealColor(params.stroke);
    }
    this.params = Object.assign(this.params, params);
  }

  fillTitle(shapeType) {
    if (shapeType === 'rectangle') {
      return 'Rectangle';
    } else if (shapeType === 'ellipse') {
      return 'Ellipse';
    } else if (shapeType === 'marker') {
      return 'Marker';
    } else {
      return 'Rectangle';
    }
  }

  static commonParams() {
    return {
      left: 0,
      top: 0,
      borderColor: '#00a6ed',
      cornerStrokeColor: '#00a6ed',
      cornerColor: 'white',
      cornerSize: 6,
      transparentCorners: false,
      lockRotation: true,
    };
  }
}