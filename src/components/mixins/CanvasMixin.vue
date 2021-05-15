<script>
import {fabric} from "fabric";
import {ShapeModel} from "@/models/case-tracker/ShapeModel";

export default {
  name: "CanvasMixin",
  methods: {
    createShapeObjByCaseChild(_child) {
      if (_child.shapeType === 'rectangle') {
        return new fabric.Rect(Object.assign(this.baseFields(_child), {
          uniScaleTransform: true,
          hasRotatingPoint: false,
          hoverCursor: 'default',
        }, _child.params));
      } else if (_child.shapeType === 'ellipse') {
        return new fabric.Ellipse(Object.assign(this.baseFields(_child), {
          uniScaleTransform: true,
          hasRotatingPoint: false,
          hoverCursor: 'default',
        }, _child.params));
      } else if (_child.shapeType === 'marker') {
        // this.$clipboard(_child.params.path);
        return new fabric.Path(_child.params.path, Object.assign(
            this.baseFields(_child), _child.params));
      }
    },
    baseFields(_child) {
      return Object.assign(ShapeModel.commonParams(), {
        id: _child.id,
        shapeType: _child.shapeType,
        title: _child.title,
        opacity: 1,
      });
    },
  },
}
</script>