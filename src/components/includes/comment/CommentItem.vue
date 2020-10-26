<template>
  <div class="pc-comment-item">
    <div class="pc-comment-item-user"
         :style="{'background-color': comment.user.color}"
    >{{comment.user.shortUserName}}</div>
    <div class="pc-comment-item-body">
      <span class="pc-comment-item-body-name">{{comment.user.userName}}</span>
      <span class="pc-comment-item-body-message">{{comment.message}}</span>
      <div class="pc-comment-item-body-bottom">
        <span class="pc-comment-item-body-date">сегодня 18:24</span>
        <span class="pc-comment-item-body-reply">ответить</span>
      </div>
    </div>
    <div class="pc-comment-item-body-img-box">
      <img src="@/assets/img/common/selectArrowGrey.svg"
           class="pc-comment-item-body-img"
           alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentItem",
  props: ['comment'],
}
</script>