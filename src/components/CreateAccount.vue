<template>
  <div>
    <div id="note">
      <h4>注意！</h4>
      <h4>* 私钥密码用于管理私钥和交易授权，请务必注意密码强度</h4>
      <h4>* 密码存储于您的钱包本地，如丢失，AWC 钱包无法帮您找回，请务必牢记</h4>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateAccount',
  data () {
    return {
      msg: 'Welcome to Your AWC wallet'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #note{
    background-color: darkcyan;
    border: 1px solid #000000;
    color: white;
    font-size: 8px;
    text-align: left;
    padding: 0px 12px;
  }

</style>
