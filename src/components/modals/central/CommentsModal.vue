<template>
  <div class="p-comments scroll-y-container">
    <div class="p-comments-body">

    </div>
    <CommentInputArea :currentUserInfo="body.currentUserInfo" />
  </div>
</template>

<script>
import CommentInputArea from "@/components/includes/comment/CommentInputArea";

export default {
  name: "CommentsModal",
  props: ['contextMenu'],
  components: {
    CommentInputArea
  },
  computed: {
    cm() {
      return this.contextMenu();
    },
    body() {
      return this.cm.body;
    },
  },
  methods: {

  },
}
</script>
