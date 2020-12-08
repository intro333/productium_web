<script>
import {fabric} from "fabric";

export default {
  name: "CanvasMixin",
  methods: {
    createShapeObjByCaseChild(_child) {
      if (_child.shapeType === 'rectangle') {
        return new fabric.Rect(Object.assign({}, {
          id: _child.id,
          shapeType: _child.shapeType,
          title: _child.title,
          opacity: 1,
          uniScaleTransform: true,
          hasRotatingPoint: false,
          hoverCursor: 'default',
        }, _child.params));
      } else if (_child.shapeType === 'ellipse') {
        return new fabric.Ellipse(Object.assign({}, {
          id: _child.id,
          shapeType: _child.shapeType,
          title: _child.title,
          opacity: 1,
          uniScaleTransform: true,
          hasRotatingPoint: false,
          hoverCursor: 'default',
        }, _child.params));
      }
    }
  },
}
</script>