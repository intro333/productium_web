export class CaseModel {
  id = 0;
  projectId = 0;
  slideId = 0;
  slideListId = 0;
  title = 'Задача 1';
  caseStatus = 'in-work'; // in-work | done | archived | deleted
  isOpen = true;
  discus = '';
  resolut = '';
  children = []; /* ShapeModel[] */
  order = 0;

  /* local */
  haveNewComments = false;
  discusBlockActivityState = 'discus'; // discus | resolut
  isSelected = false;
  isEdited = false;
  isDiscusEdited = false;

  constructor(_case) {
    Object.keys(_case).forEach(field => {
      this[field] = _case[field];
    });
    // this.id = _case.id;
    // this.projectId = _case.projectId;
    // this.slideId = _case.slideId;
    // this.slideListId = _case.slideListId;
    // this.title = _case.title;
    // this.caseStatus = _case.caseStatus;
    // this.isOpen = _case.isOpen;
    // this.discus = _case.discus;
    // this.resolut = _case.resolut;
    // this.children = _case.children;
    // this.order = _case.order;
  }
}