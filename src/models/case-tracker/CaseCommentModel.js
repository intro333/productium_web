export class CaseCommentModel {
  id = 0;
  projectId = 0;
  slideId = 0;
  slideListId = 0;
  caseId = 0;
  parent = null;
  message = '';
  user = {
    fullName: 'User1',
    shortName: 'U1',
    color: '#FF2727',
  };
  images = [];
  updatedAt = '';
  notifyInfo = null;

  constructor(_comment) {
    Object.keys(_comment).forEach(field => {
      this[field] = _comment[field];
    });
  }
}