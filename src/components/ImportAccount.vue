<template>
  <div>
    <div id="note">
      <h4>注意！</h4>
      <h4>* 私钥密码用于管理私钥和交易授权，请务必注意密码强度</h4>
      <h4>* 密码存储于您的钱包本地，如丢失，AWC 钱包无法帮您找回，请务必牢记</h4>
    </div>
    <div id="form">
      <md-field :class="messageClass">
        <label>输入助记词或私钥</label>
        <md-textarea v-model="mnemonic"></md-textarea>
        <span class="md-error">助记词不得为空</span>
      </md-field>
      <md-field :class="messageClass">
        <label>钱包名称</label>
        <md-input v-model="wallet.name"></md-input>
        <span class="md-error">不得为空</span>
      </md-field>

      <md-field :class="messageClass">
        <label>密码</label>
        <md-input type="password" v-model="password" required></md-input>
        <span class="md-error">密码不得为空</span>
      </md-field>

      <md-field :class="messageClass">
        <label>确认密码</label>
        <md-input type="password" v-model="repass" required></md-input>
        <span class="md-error">与密码不一致</span>
      </md-field>

      <md-field :class="messageClass">
        <label>密码提示</label>
        <md-input v-model="wallet.passhint" required></md-input>
        <span class="md-error">不得为空</span>
      </md-field>
      <button v-on:click="submit()" v-bind:disabled="createBtnDisable" class="createBtn">下一步</button>
    </div>
    <div id="loading" v-if="showLoading">
      <md-progress-bar md-mode="query"></md-progress-bar>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
var keyCreate = require("../utils/mnemonic-privatekey")
import * as eth from '../utils/eth'
const bip39 = require('bip39');

console.log(eth)

export default {
  name: 'ImportAccount',
  data (){
    return {
      msg: 'Import Your AWC wallet',
      wallet: {
        name: '',
        passhint: '',
        keystore: null,
        account: '',
      },
      password: '',
      repass: '',
      mnemonic: '',
      privateKey: '',
      keystore: {},
      hasMessages: false,
      showLoading: false,
      createBtnDisable: false,
      createBtnText: '创建',
      ifShowError: false,
      errorMsg: ''
    }
  },
  methods: {
    submit(){
      console.log('submit')
      if (this.createBtnDisable) {return false}
      this.createBtnDisable = true
      if (!this.wallet.name || !this.password || !this.repass || !this.wallet.passhint || this.password != this.repass || !this.mnemonic) {
        this.hasMessages = true
        this.createBtnDisable = false
        return;
      }
      var _this = this
      Promise.resolve().then(()=>{
        console.log('showLoading')
        _this.createBtnDisable = true;
        _this.showLoading = true
        _this.hasMessages = false
      }).then(() => {
        if (this.mnemonic.length == 64 && this.mnemonic.indexOf(' ') === -1 ) {
          _this.privateKey = this.mnemonic
          _this.wallet.account = keyCreate.getAddressFromPrivateKey(_this.privateKey)
          return _this.privateKey
        }
        var ret = keyCreate.getPrivateKeyFromMnemonic(this.mnemonic)
        if (!ret) {
          throw new Error('私钥创建失败')
        }
        _this.privateKey = ret.privateKey
        _this.wallet.account = ret.account
        return _this.privateKey
      }).then((_privateKey) => {
        _this.keystore = keyCreate.getKeystoreFromPrivateKey(_this.privateKey, _this.password)
        console.log('keystore')
        console.log(_this.keystore)
        if (!_this.keystore) {
          throw new Error('keystore 创建失败')
        }
      }).then((keystore)=>{
        console.log('store keystore')
        var accounts = eth.getAccounts()
        _this.wallet.keystore = _this.keystore
        accounts = accounts.concat([_this.wallet])
        console.log(accounts)
        eth.storeAccounts(accounts)
        console.log('importAccount')
        this.createBtnDisable = false;
        this.showLoading = false 
        this.hasMessages = false
        location.hash = '/accountList' 
      }).then(()=>{
        console.log('show dialog')
        _this.showLoading = false
      }).catch((error) => {
        console.log('catch')
        console.log(error)
        _this.showError(error)
        _this.showLoading = false
      })
    },
    createAccount(){
      console.log('importAccount')
      this.createBtnDisable = false;
      this.showLoading = false 
      this.hasMessages = false
      location.hash = '/accountList' 
    },
    showError(msg){
      console.log(msg)
      if (typeof msg != 'string') {
        alert(msg)
        return false
      }
      this.errorMsg = msg
      this.isShowError = true
      return false
    }
  },
  computed:{
    messageClass () {
      return {
        'md-invalid': this.hasMessages
      }
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
  #form{
    padding: 0px 12px;
  }
  .mnemonic{
    background-color: darkcyan;
    color: white;
    padding: 12px;
  }
  #loading{
    position: fixed;
    top: 0;
    width: 100%;
  }
  .createBtn{
    background-color: darkcyan;
    padding: 5px 15px;
    border: 1px solid #000000;
    border-radius: 2px;
    color: #ffffff;
  }
  button:disabled{
    background-color: grey;
  }
</style>
