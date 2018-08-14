<template>
  <div>
    <div id="note">
      <h4>注意！</h4>
      <h4>* Gas 默认取上一次区块产生数额</h4>
      <h4>* 请务必确认您的转账，一旦转出，将无法退回！</h4>
    </div>
    <div id="form">
      <md-field :class="messageClass">
        <label>收款人钱包</label>
        <md-input v-model="toAddress"></md-input>
        <span class="md-error">不得为空</span>
      </md-field>

      <md-field :class="messageClass">
        <label>转账金额</label>
        <md-input v-model="amount" required></md-input>
        <span class="md-error">金额不得为空</span>
      </md-field>

      <md-field :class="messageClass">
        <label>请输入密码</label>
        <md-input type="password" v-model="password" required></md-input>
        <span class="md-error">密码不得为空</span>
      </md-field>

      <md-field :class="messageClass">
        <label>备注</label>
        <md-input v-model="note" required></md-input>
        <span class="md-error">不得为空</span>
      </md-field>
      <button v-on:click="confirm()" class="createBtn">下一步</button>
    </div>
    <md-dialog-confirm
      :md-active.sync="active"
      md-title="确定交易信息"
      :md-content="transactionCon"
      md-confirm-text="确定"
      md-cancel-text="放弃"
      @md-cancel="onCancel"
      @md-confirm="submit" />
  </div>
</template>

<script>
import Vue from 'vue'
var keyCreate = require("../utils/mnemonic-privatekey")
var EthereumTx = require('ethereumjs-tx')
var aibs = require('../utils/abis')
import * as eth from '../utils/eth'
const bip39 = require('bip39');
import Web3 from 'web3'
const web3 = new Web3("HTTP://127.0.0.1:7545")
window.web3 = web3

console.log(eth)

export default {
  name: 'ImportAccount',
  data (){
    return {
      msg: 'Import Your AWC wallet',
      address: null,
      toAddress: '',
      amount: null,
      note: '',
      active: false,
      transactionCon: '',
      nonce: '',
      gasLimit: null,
      gasPrice: null,
      balance: null,
      password: null,
    }
  },
  methods: {
    submit(){
      try{
        this.active = false
        var account = eth.getAccountWithAddress(this.address)
        var privateKey = keyCreate.getPrivateKeyFromKeystore(account.keystore, this.password)
        console.log('privateKey: %s', privateKey)
        // private key should be a buffer
        privateKey =  Buffer.from(privateKey, 'hex')

        var rawTx = {
          nonce: web3.utils.toHex(this.nonce++),
          gasPrice: web3.utils.toHex(this.gasPrice),
          gasLimit: web3.utils.toHex(this.gasLimit),
          to: this.toAddress,
          value: web3.utils.toHex(this.amount * 1e18),
          data: null
        }

        console.log(rawTx)

        var tx = new EthereumTx(rawTx);
        console.log(tx)
        tx.sign(privateKey);

        var serializedTx = tx.serialize();

        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', (error, result) => {
          console.log('error: ')
          console.log(error)
          console.log('result: ')
          console.log(result)
          location.hash = '/accountList'
        });
      }catch(err){
        alert('转账失败')
        console.log(err)
      }
    },
    confirm(){
      // todo fetch gas and to address
      web3.eth.getBlock("latest").then((block)=>{
        console.log(block)
        console.log("gasLimit: " + block.gasLimit);
        this.nonce = block.number
        this.gasLimit = block.gasLimit
        var gas = web3.utils.fromWei(block.gasLimit.toString(), 'ether')
        var hintAddress = this.toAddress.substr(0, 8) + '...' + this.toAddress.substr(-4, 4)
        this.transactionCon = '<p>交易' + this.amount + 'eth<br />' + hintAddress + '</p><p>花费Gas:' + gas + ' eth</p>'
      })
      web3.eth.getGasPrice().then((gasPrice) => {
        this.gasPrice = gasPrice
      })
      
      this.active = true
    },
    onCancel(){
      this.active = false
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
  },
  mounted() {
    this.address = this.$route.params.address
    web3.eth.getBalance(this.address, 'latest').then((balance)=>{
        console.log(this.address + ' balance: ', balance)
        if (balance) {
          this.balance = web3.utils.fromWei(balance.toString(), 'ether')
        }
        console.log(this.balance)
    })
  },
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
</style>
