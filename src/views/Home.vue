<template>
  <div>
<!--    <p>Home</p>-->
<!--    <a href="/case-tracker?projectId=1&slideId=1&slideListId=1&caseId=3">Go to View Tracker</a>-->
  </div>
</template>

<script>
export default {
  name: "Home",
  created() {
    this.$router.push('/case-tracker');
    // this.$router.push('/case-tracker?projectId=1&slideId=1&slideListId=1&caseId=1');
  }
}
</script>