import {ProjectModel} from "@/models/case-tracker/ProjectModel";
import {SlideModel} from "@/models/case-tracker/SlideModel";
import {SlideList} from "@/models/case-tracker/SlideList";
import {CaseModel} from "@/models/case-tracker/CaseModel";
import {ShapeModel} from "@/models/case-tracker/ShapeModel";
import {pickerColors} from "@/data/consts";

export const mockProjects = [
  new ProjectModel({
    id: 1,
    name: 'Untitled1',
    activityStatus: 'active',
  }),
  new ProjectModel({
    id: 2,
    name: 'Untitled2',
    activityStatus: 'active',
  }),
  new ProjectModel({
    id: 3,
    name: 'Untitled3',
    activityStatus: 'archived',
  }),
];
export const mockSlides = [
  new SlideModel({
    id: 1,
    slideState: 'in-work',
    projectId: 1,
    order: 0,
    img: true,
    imgUrl: '/test-img/android-sdk.png',
    imgLeft: -20,
    imgTop: 259,
  }),
  new SlideModel({
    id: 2,
    slideState: 'done',
    projectId: 1,
    order: 1,
    img: true,
    imgUrl: '/test-img/import-error.png',
    imgLeft: 5,
    imgTop: 5,
  }),
  new SlideModel({
    id: 3,
    slideState: 'in-work',
    projectId: 1,
    order: 2,
    img: true,
    imgUrl: '/test-img/no-env.png',
    imgLeft: 200,
    imgTop: 10,
  }),
  new SlideModel({
    id: 4,
    slideState: 'in-work',
    projectId: 1,
    order: 3,
    img: true,
    imgUrl: '/test-img/spot-error.png',
    imgLeft: 20,
    imgTop: 10,
  }),
  new SlideModel({
    id: 5,
    slideState: 'archived',
    projectId: 2,
    order: 0,
    img: null,
    imgLeft: null,
    imgTop: null,
  }),
];
export const mockSlideLists = [
  new SlideList({
    id: 1,
    slideId: 1,
    name: 'Лист1'
  }),
  new SlideList({
    id: 2,
    slideId: 2,
    name: 'Лист1'
  }),
  new SlideList({
    id: 3,
    slideId: 3,
    name: 'Лист1'
  }),
  new SlideList({
    id: 4,
    slideId: 4,
    name: 'Лист1'
  }),
];
export const mockCases = [
  new CaseModel({
    id: 1,
    projectId: 1,
    slideId: 1,
    slideListId: 1,
    title: 'Задача 1',
    caseStatus: 'in-work',
    isOpen: false,
    discus: '',
    resolut: '',
    children: [
      new ShapeModel( 1, 'Rectangle 1', 'rectangle', {
        width: 100,
        height: 100,
        top: 220,
        left: 200,
        fill: 'transparent',
        stroke: pickerColors.red,
        strokeWidth: 2
      }),
      new ShapeModel( 11, 'Rectangle 3', 'rectangle', {
        width: 120,
        height: 140,
        top: 320,
        left: 250,
        fill: 'transparent',
        stroke: pickerColors.green,
        strokeWidth: 2
      }),
    ],
    order: 0,
  }),
  new CaseModel({
    id: 2,
    projectId: 1,
    slideId: 1,
    slideListId: 1,
    title: 'Баг с выпадающим списком, когда на него нажимаешь.',
    caseStatus: 'done',
    isOpen: false,
    discus: '',
    resolut: '',
    children: [
      new ShapeModel( 1, 'Rectangle 1', 'rectangle', {
        width: 100,
        height: 100,
        top: 300,
        left: 200,
        fill: 'transparent',
        stroke: pickerColors.red,
        strokeWidth: 2
      }),
      new ShapeModel( 2, 'Rectangle 2', 'rectangle', {
        width: 150,
        height: 150,
        top: 300,
        left: 400,
        fill: 'transparent',
        stroke: pickerColors.green,
        strokeWidth: 2,
      }),
      new ShapeModel( 3, 'Ellipse 1', 'ellipse', {
        left: 650,
        top: 320,
        fill: 'transparent',
        stroke: pickerColors.black,
        strokeWidth: 2,
        radius: 50,
        originX: 'left',
        originY: 'top',
        rx: 200,
        ry: 150,
        angle: 0,
      }),
    ],
    order: 1,
  }),
  new CaseModel({
    id: 3,
    title: 'Задача 3.',
    projectId: 1,
    slideId: 1,
    slideListId: 1,
    caseStatus: 'done',
    isOpen: true,
    discus: '',
    resolut: '',
    children: [
      new ShapeModel( 4, 'Rectangle 4', 'rectangle', {
        width: 250,
        height: 100,
        top: 500,
        left: 300,
        fill: 'transparent',
        stroke: pickerColors.blue,
        strokeWidth: 2,
      }),
      new ShapeModel( 5, 'Ellipse 2', 'ellipse', {
        left: 650,
        top: 320,
        fill: 'transparent',
        stroke: pickerColors.green,
        strokeWidth: 2,
        radius: 100,
        originX: 'left',
        originY: 'top',
        rx: 250,
        ry: 100,
        angle: 0,
      }),
    ],
    order: 2,
  }),
  new CaseModel({
    id: 4,
    projectId: 1,
    slideId: 2,
    slideListId: 2,
    title: 'Задача 2',
    caseStatus: 'done',
    isOpen: false,
    discus: '',
    resolut: '',
    children: [],
    order: 0,
  }),
  new CaseModel({
    id: 5,
    projectId: 1,
    slideId: 2,
    slideListId: 2,
    title: 'Задача 3',
    caseStatus: 'done',
    isOpen: true,
    discus: '',
    resolut: '',
    children: [
      new ShapeModel( 6, 'Rectangle 6', 'rectangle', {
        width: 250,
        height: 100,
        top: 400,
        left: 300,
        fill: 'transparent',
        stroke: pickerColors.red,
        strokeWidth: 2,
      }),
      new ShapeModel( 7, 'Ellipse 7', 'ellipse', {
        left: 650,
        top: 320,
        fill: 'transparent',
        stroke: pickerColors.yellow,
        strokeWidth: 2,
        radius: 100,
        originX: 'left',
        originY: 'top',
        rx: 100,
        ry: 50,
        angle: 0,
      }),
    ],
    order: 1,
  }),
  new CaseModel({
    id: 6,
    projectId: 1,
    slideId: 3,
    slideListId: 3,
    title: 'Задача 7',
    caseStatus: 'in-work',
    isOpen: false,
    discus: '',
    resolut: '',
    children: [],
    order: 0,
  }),
  new CaseModel({
    id: 7,
    projectId: 1,
    slideId: 4,
    slideListId: 4,
    title: 'Задача 8',
    caseStatus: 'done',
    isOpen: true,
    discus: '',
    resolut: '',
    children: [
      new ShapeModel( 9, 'Rectangle 9', 'rectangle', {
        width: 250,
        height: 100,
        top: 100,
        left: 100,
        fill: 'transparent',
        stroke: pickerColors.pink,
        strokeWidth: 2,
      }),
    ],
    order: 1,
  }),
  new CaseModel({
    id: 8,
    projectId: 1,
    slideId: 4,
    slideListId: 4,
    title: 'Задача 9',
    caseStatus: 'in-work',
    isOpen: true,
    discus: '',
    resolut: '',
    children: [],
    order: 0,
  }),
];
export const mockCaseComments = [
  {
    id: 1,
    projectId: 1,
    slideId: 1,
    slideListId: 1,
    caseId: 1,
    parent: null,
    message: 'Привет. Здесь надо поменять скругление и может вообще убрать stroke.',
    user: {
      fullName: 'Dmitry Kolunov',
      shortName: 'DK',
      color: '#FF2727',
    },
    images: [],
    updatedAt: '2020-10-27 18:24:45',
    notifyInfo: { // join tables, если в таблице case_comment_notification есть запись для текущего юзера, то выести её, если нет то null поставить
      status: 'read', // notRead | read | archived
    }
  },
  {
    id: 2,
    projectId: 1,
    slideId: 1,
    slideListId: 1,
    caseId: 1,
    parent: 1,
    message: 'И тебе привет. Я думаю можно сделать как здесь тогда https://ru.wikipedia.org/wiki/Google_%D0%9F%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%D1%87%D0%B8%D0%BA',
    user: {
      fullName: 'Genom 89',
      shortName: '',
      color: '#b2b2b2',
    },
    images: [],
    updatedAt: '2020-10-27 18:30:45',
    notifyInfo: {
      status: 'read',
    }
  },
  {
    id: 3,
    projectId: 1,
    slideId: 1,
    slideListId: 1,
    caseId: 1,
    parent: null,
    message: 'Привет. Здесь надо поменять скругление и может вообще убрать stroke.',
    user: {
      fullName: 'Dmitry Kolunov',
      shortName: 'DK',
      color: '#FF2727',
    },
    images: [
      {
        id: 15,
        src: '',
        orientation: 'portrait'
      }
    ],
    updatedAt: '2020-10-28 19:13:45',
    notifyInfo: {
      status: 'read',
    }
  },
  {
    id: 4,
    projectId: 1,
    slideId: 1,
    slideListId: 1,
    caseId: 1,
    parent: 3,
    message: 'Привет. Здесь надо поменять.',
    user: {
      fullName: 'Dmitry Kolunov',
      shortName: 'DK',
      color: '#FF2727',
    },
    images: [],
    updatedAt: '2020-10-29 01:36:15',
    notifyInfo: {
      status: 'notRead',
    }
  },
  {
    id: 5,
    projectId: 1,
    slideId: 1,
    slideListId: 1,
    caseId: 1,
    parent: 3,
    message: 'Привет. Здесь надо .',
    user: {
      fullName: 'Genom 89',
      shortName: 'DK',
      color: '#b2b2b2',
    },
    images: [],
    updatedAt: '2020-10-29 01:46:15',
    notifyInfo: {
      status: 'notRead',
    }
  },
  {
    id: 6,
    projectId: 1,
    slideId: 1,
    slideListId: 1,
    caseId: 1,
    parent: null,
    message: 'Моё сообщение',
    user: {
      fullName: 'Derzhaev D',
      shortName: 'DD',
      color: '#7c4a4a',
    },
    images: [],
    updatedAt: '2020-10-30 11:46:15',
    notifyInfo: null // Моё сообщение, оно не будет мне показано в оповещении
  },
];
