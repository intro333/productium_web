export class SlideList {
  id = 0;
  slideId = 0;
  name = '';
  isSelected = false;

  constructor(_list) {
    this.id = _list.id;
    this.name = _list.name;
    this.slideId = _list.slideId;
    this.isSelected = _list.isSelected || false;
  }
}