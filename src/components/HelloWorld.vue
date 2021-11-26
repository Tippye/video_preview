<template>
  <div>
    <input type="file" accept="video/*" @change="handleSubmit">
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods:{
    handleSubmit(e){
      console.log(e.target.files[0]);
      this.$emit("changeVideo",e.target.files[0])
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
