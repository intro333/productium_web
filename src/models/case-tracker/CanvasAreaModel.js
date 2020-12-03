export class CanvasAreaModel {
  canvas = null;
  canvasWidth = 0;
  canvasHeight = 0;

  constructor(canvas, canvasWidth, canvasHeight) {
    this.canvas = canvas;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }
}