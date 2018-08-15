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
              <span>ETH: {{balance}} <md-button @click="go('/transaction/eth/' + address)" class="md-primary">转账</md-button></span> 
            </div>
          </md-list-item>
        </md-list>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import * as eth from '../utils/eth'
import Web3 from 'web3'
var abis = require('../utils/abis')
window.web3 = Web3
window.abis = abis

export default {
  name: 'AccountDetail',
  data() {
    return {
      address: '',
      balance: '0',
      menuVisible: false,
      awc: 0
    }
  },
  mounted() {
    this.address = this.$route.params.address
    var web3 = new Web3("HTTP://127.0.0.1:7545")
    web3.eth.getBalance(this.address, 'latest').then((balance)=>{
        console.log(this.address + ' balance: ', balance)
        if (balance) {
          this.balance = web3.utils.fromWei(balance.toString(), 'ether')
        }
        console.log(this.balance)
    })
    console.log(abis)
    let contract = new web3.eth.Contract(abis.abi, abis.contract)
    window.contract = contract
    contract.methods.balanceOf(this.address).call().then((balance) =>{
      this.awc = balance
    })
    // todo .send
  },
  methods: {
    trasation: (token) => {

    },
    go: (hash) => {
      location.hash = hash
    }
  }
}
</script>

<style scoped>
  .md-list {
    width: 320px;
    max-width: 100%;
    display: inline-block;
    vertical-align: top;
    border: 1px solid rgba(#000, .12);
  }
</style> 
