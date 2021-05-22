export class SlideModel {
  id = 0;
  slideState = 'in-work';
  projectId = 0;
  order = 0;
  img = null;
  imgBase64 = null;
  imgUrl = null;
  imgObj = null;
  isSelected = false;
  canvasWidth = 0;
  canvasHeight = 0;
  imgLeft = null;
  imgTop = null;
  lastClientX = 0;
  lastClientY = 0;
  isLeftDirection = null;
  isTopDirection = null;
  panLeftMouseDownPoint = 0;
  panLeftMouseUpPoint = 0;
  allLineCoords = [];
  zoom = {
    offsetX: 0,
    offsetY: 0,
    z: 1
  };

  constructor(_slide) {
    this.id = _slide.id;
    this.slideState = _slide.slideState;
    this.projectId = _slide.projectId;
    this.order = _slide.order;
    this.img = _slide.img;
    this.imgUrl = _slide.imgUrl || null;
    this.imgLeft = _slide.imgLeft || 0;
    this.imgTop = _slide.imgTop || 0;
    this.zoom = _slide.zoom || this.zoom;
    this.lastClientX = _slide.lastClientX || 0;
    this.lastClientY = _slide.lastClientY || 0;
    this.isSelected = _slide.isSelected || false;
  }
}