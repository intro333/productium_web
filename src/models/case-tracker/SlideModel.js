export class SlideModel {
  id = 0;
  slideState = 'in-work';
  projectId = 0;
  order = 0;
  img = null;
  imgBase64 = null;
  imgUrl = null;
  isSelected = false;
  canvasWidth = 0;
  canvasHeight = 0;

  constructor(_slide) {
    this.id = _slide.id;
    this.slideState = _slide.slideState;
    this.projectId = _slide.projectId;
    this.order = _slide.order;
    this.img = _slide.img;
    this.imgUrl = _slide.imgUrl;
  }
}