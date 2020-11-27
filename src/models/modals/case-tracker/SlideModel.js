export class SlideModel {
  id = 0;
  slideState = 'in-work';
  projectId = 0;
  order = 0;
  image = '';
  isSelected = false;

  constructor(_slide) {
    this.id = _slide.id;
    this.slideState = _slide.slideState;
    this.projectId = _slide.projectId;
    this.order = _slide.order;
    this.image = _slide.image;
  }
}