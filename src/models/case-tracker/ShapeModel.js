export class ShapeModel {
  id = 0;
  title = 'Задача 1';
  shapeType = 'rectangle'; /* rectangle | circle */
  params = [];

  /* local */
  // left = 0;
  // top = 0;

  constructor(id, title, shapeType, params) {
    this.id = id;
    this.title = title;
    this.shapeType = shapeType;
    this.params = params;
  }
}