import {generateColorFromPicker} from "@/functions/conversation";

export function slidesOfProjectFilterWithSelect(_slides, projectId, slideId) {
  return _slides.filter(_s => {
    if (_s.slideState !== 'archived' && _s.projectId === projectId) {
      _s.isSelected = _s.id === slideId;
      return _s;
    }
  });
}

export function fillCasesCommentsTree(comments) {
  const result = [];
  comments
    .forEach(_c => {
      if (_c.parent === null) {
        result.push(Object.assign({}, _c));
      } else {
        const foundParent = result.find(_p => _p.id === _c.parent);
        if (foundParent) {
          if (foundParent.children) {
            foundParent.children.push(Object.assign({}, _c));
          } else {
            foundParent.children = [];
            foundParent.children.push(Object.assign({}, _c));
          }
        }
      }
    });
  return result;
}

export function getRealColor(stroke) {
  return (stroke === 'auto') ? `#${generateColorFromPicker()}` :
    `#${stroke.replace(/#/g, '')}`;
}