<template>
  <div class="hello">
    <img src="../assets/logo.png">
    <h2>{{msg}}</h2>
    <button v-on:click="go('/accountList')">Account List</button>
    <button v-on:click="go('/createAccount')">Create Account</button>
    <button v-on:click="go('/importAccount')">Import Account</button>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      msg: 'Welcome to Your AWC wallet'
    }
  },
  methods: {
    go(hash){
      location.hash = hash
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  button{
    width: 80%;
    margin: 0 auto;
    height: 40px;
    background: white;
    border-radius: 5px;
    border: 1px solid red;
    margin-top: 1rem;
  }
</style>
