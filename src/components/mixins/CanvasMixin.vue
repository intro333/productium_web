<script>
import {fabric} from "fabric";

export default {
  name: "CanvasMixin",
  methods: {
    createShapeObjByCaseChild(_child) {
      if (_child.shapeType === 'rectangle') {
        return new fabric.Rect(Object.assign({}, {
          opacity: 1,
          uniScaleTransform: true,
          hasRotatingPoint: false,
          hoverCursor: 'default'
        }, _child.params));
      } else if (_child.shapeType === 'circle') {
        return new fabric.Circle(Object.assign({}, {
          opacity: 1,
          uniScaleTransform: true,
          hasRotatingPoint: false,
          hoverCursor: 'default'
        }, _child.params));
      }
    }
  },
}
</script>