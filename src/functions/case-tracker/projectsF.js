import {generateColorFromPicker} from "@/functions/conversation";

export function slidesOfProjectFilterWithSelect(_slides, projectId, slideId) {
  return _slides.filter(_s => {
    if (_s.slideState !== 'archived' && _s.projectId === projectId) {
      _s.isSelected = _s.id === slideId;
      return _s;
    }
  });
}

export function projectFilterWithSelect(_projects, projectId) {
  return _projects.filter(_p => {
    if (_p.activityStatus !== 'archived') {
      _p.isSelected = _p.id === projectId;
      return _p;
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

/* Автоинкремент для названия элемента кейса */
export function shapeTitleAutoIncrement(shapeObj, objsByType) {
  let title = shapeObj.title;
  const nums = [];
  objsByType.forEach(_o2 => {
    const titleNoChars = _o2.title.replace( /^\D+/g, '');
    if (titleNoChars !== '') {
      nums.push(parseInt(titleNoChars));
    }
  }); /* Оставить только цифры */
  if (nums.length) {
    const maxNum =  Math.max.apply(null, nums);
    if (maxNum) {
      title += ' ' + (maxNum+1);
    }
  } else {
    title += ' 1';
  }

  return title;
}
