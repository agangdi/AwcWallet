<template>
  <div>
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">钱包列表</span>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">Navigation</md-toolbar>

        <md-list>
          <md-list-item>
            <span class="md-list-item-text"><router-link to="/createAccount">创建</router-link></span>
          </md-list-item>

          <md-list-item>
            <span class="md-list-item-text"><router-link to="/importAccount">导入</router-link></span>
          </md-list-item>

          <md-list-item>
            <span class="md-list-item-text"><router-link to="/">首页</router-link></span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <md-list class="md-triple-line">
          <md-list-item>
            <div class="md-list-item-text">
              <span>{{address}}</span> 
              <span>AWC: {{awc}}</span> 
              <span>ETH: {{balance}} 
                <md-button @click="go('/transaction/eth/' + address)" class="md-primary">转账</md-button></span> 
            </div>
          </md-list-item>
        </md-list>
        <md-content>
          说明：每1eth兑换10000awc, 每次出拳消耗{{price}}awc
        </md-content>
        <md-content class="errorMsg">
          <p>{{errorMsg}}</p>
        </md-content>
      </md-app-content>
    </md-app>
    <div class="form">
      <md-field>
        <label>数量</label>
        <md-input v-model="awcAmount"></md-input>
      </md-field>
      <md-field>
        <label>密码</label>
        <md-input v-model="password" type="password"></md-input>
      </md-field>
      <md-button @click="buyAwc" class="md-raised md-accent">兑换AWC</md-button>

    </div>
    <div class="form">
        <md-radio v-model="punches" value="0">石头</md-radio>
        <md-radio v-model="punches" value="2">剪子</md-radio>
        <md-radio v-model="punches" value="1">布</md-radio>
      <md-button @click="holdPunches" class="md-raised md-accent">出拳</md-button>
    </div>
  </div>
</template>

<script>
import * as eth from '../utils/eth'
var EthereumTx = require('ethereumjs-tx')
import Web3 from 'web3'
var abis = require('../utils/abis')
var web3 = new Web3(abis.gethNode)
const contract = new web3.eth.Contract(abis.abi, abis.contract)
window.contract = contract

export default {
  name: 'AccountDetail',
  data() {
    return {
      address: '',
      balance: '0',
      menuVisible: false,
      awc: 0,
      password: '',
      punches: null,
      awcAmount: null,
      price: null,
      nonce: null,
      gasLimit: null,
      gasPrice: null,
      errorMsg: '',
      buyClose: false
    }
  },
  mounted() {
    this.address = this.$route.params.address
    var web3 = new Web3(abis.gethNode)
    web3.eth.getBalance(this.address, 'latest').then((balance)=>{
        console.log(this.address + ' balance: ', balance)
        if (balance) {
          this.balance = web3.utils.fromWei(balance.toString(), 'ether')
        }
        console.log(this.balance)
    })
    console.log(abis)
    contract.methods.balanceOf(this.address).call().then((balance) =>{
      this.awc = balance
    })
    contract.methods.getPrice().call().then((price) =>{
      this.price = price 
    })
    // todo .send
    // todo fetch gas and to address
    // web3.eth.getBlock("latest").then((block)=>{
    //   this.gasLimit = block.gasLimit
    // })
    this.gasLimit = abis.gasLimit
    web3.eth.getTransactionCount(this.address).then((count) => {
      this.nonce = count
    })
    this.gasPrice = abis.gasPrice
    // web3.eth.getGasPrice().then((gasPrice) => {
    //   this.gasPrice = gasPrice
    // })
    console.log(this)
    
  },
  methods: {
    trasation(token){

    },
    go(hash) {
      location.hash = hash
    },
    reload() {
      console.log("this.reload")
      location.hash = location.hash
    },
    buyAwc() {
      if (this.buyClose) {
        return false
      }
      this.buyClose = true
      // note: methods 中用箭头函数取不到this
      console.log("awcAmount: %s + password: %s", this.awcAmount, this.password)
      if (!this.awcAmount || !this.password) {
        this.errorMsg = '兑换数量和密码不能为空'
        return false
      }
      this.errorMsg = ''
      let rawTx = {
        nonce: this.nonce++,
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit,
        to: abis.contract,
        value: this.awcAmount,
        data: null
      }
      console.log(rawTx)
      try{
        eth.sendTrasaction(this.address, this.password, rawTx, (result) => {
          this.reload()
        })
      }catch(err){
        console.log(typeof err)
        // if (err.indexOf('Error: message authentication code mismatch') != -1) {
        //   this.errorMsg = '密码不正确'
        // }
        console.log(err)
        this.reload()
      }
      
    },
    holdPunches() {
      // note: methods 中用箭头函数取不到this
      this.punches = parseInt(this.punches)
      console.log("punches: %i + password: %s", this.punches, this.password)
      if (!this.punches|| !this.password) {
        this.errorMsg = '出拳和密码不能为空'
        return false
      }

      var web3 = new Web3(abis.gethNode)
      let privateKey = eth.fetchPrivateKeyWithAddress(this.address, this.password)
      privateKey =  Buffer.from(privateKey, 'hex')

      // account = web3.eth.accounts.privateKeyToAccount('0x' + privateKeyToAccount);
      var contract = new web3.eth.Contract(abis.abi, abis.contract);
      var transfer = contract.methods.letPunches(this.punches);
      var encodedABI = transfer.encodeABI();

      var rawTx = {
        from: this.address,
        to: abis.contract,
        nonce: web3.utils.toHex(this.nonce++),
        gasPrice: web3.utils.toHex(this.gasPrice),
        gasLimit: web3.utils.toHex(this.gasLimit),
        // gas: 600000,
        data: encodedABI,
        value: 0
        // gasPrice: 20000000
      }; 
      console.log(rawTx)
      var tx = new EthereumTx(rawTx);
      console.log(tx)
      tx.sign(privateKey);

      var serializedTx = tx.serialize();

      web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('receipt', (result) => {
        console.log('result: ')
        console.log(result)
        alert('刚才发成功')
      }).on('error', (error) => {
        alert('转账失败') 
        console.log(error)
      });
    }
  }
}
</script>

<style scoped>
  .form{
    padding: 0px 12px;
  }
  .md-list {
    width: 320px;
    max-width: 100%;
    display: inline-block;
    vertical-align: top;
    border: 1px solid rgba(#000, .12);
  }
  .phone-viewport {
    width: 100%;
    height: 200px;
    display: flex;
    justify-contentx: center;
    align-items: flex-end;
    overflow: hidden;
    border: 1px solid rgba(#000, .26);
    background: rgba(#000, .06);
  }
  .errorMsg{
    color: red;
  }
</style> 
