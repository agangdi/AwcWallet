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
              <span>Eth: {{balance}} <md-button @click="go('/transaction/eth/' + address)" class="md-primary">转账</md-button></span> 
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

export default {
  name: 'AccountDetail',
  data() {
    return {
      address: '',
      balance: '0',
      menuVisible: false
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
