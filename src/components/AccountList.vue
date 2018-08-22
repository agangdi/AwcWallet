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
          <md-list-item v-for="account in list" :key="account.name">
            <div v-on:click="go(account.account)" class="md-list-item-text">
              <span>{{account.name}}</span>
              <span>{{account.account}}</span>
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
import Abis from '../utils/abis'

export default {
  name: 'TripleLine',
  data() {
    return {
      list: [],
      menuVisible: false
    }
  },
  mounted() {
    var _list = eth.getAccounts()
    console.log(_list)
    var web3 = new Web3(Abis.gethNode)
    window.web3 = web3
    console.log(web3)
    var batch = new web3.BatchRequest();
    for(var index in _list){
      console.log('account i: ' + index)
      var account = _list[index]
      web3.eth.getBalance(account.account, 'latest').then((balance)=>{
        console.log(account.account + ' balance: ', balance)
        if (!balance) {
          account.balance = 0
        }else{
          account.balance = web3.utils.fromWei(balance.toString(), 'ether')
        }
        console.log(account.balance)
      })
    }
    this.list = _list
    console.log(this.list)
  },
  methods: {
    go: (address) => {
      console.log('go address: %s', address)
      location.hash='/accountDetail/' + address
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
