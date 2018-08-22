
var keyCreate = require("../utils/mnemonic-privatekey")
var EthereumTx = require('ethereumjs-tx')
import * as eth from '../utils/eth'
import abis from '../utils/abis'
import Web3 from 'web3'
const web3 = new Web3(abis.gethNode)

const STORE_ACCOUNTS_KEY = 'awc_store_accounts_key'

export function storeAccounts(accounts) {
  console.log(accounts)
  localStorage.setItem(STORE_ACCOUNTS_KEY, JSON.stringify(accounts))
}

export function getAccounts() {
  var accounts = JSON.parse(localStorage.getItem(STORE_ACCOUNTS_KEY))
  return accounts ? accounts : [];
}

export function getAccountWithAddress(address) {
  var accounts = getAccounts()
  for(var i in accounts) {
    if (accounts[i].account == address) {
      return accounts[i]
    }
  }
  return null
}

export function fetchPrivateKeyWithAddress(from, password) {
  var account = eth.getAccountWithAddress(from)
  return keyCreate.getPrivateKeyFromKeystore(account.keystore, password)
}

export function sendTrasaction(from, password, rawTx, callback) {
  var account = eth.getAccountWithAddress(from)
  var privateKey = keyCreate.getPrivateKeyFromKeystore(account.keystore, password)
  console.log('privateKey: %s', privateKey)
  // private key should be a buffer
  privateKey =  Buffer.from(privateKey, 'hex')

  var rawTx = {
    nonce: web3.utils.toHex(rawTx.nonce),
    gasPrice: web3.utils.toHex(rawTx.gasPrice),
    gasLimit: web3.utils.toHex(rawTx.gasLimit),
    to: rawTx.to,
    value: web3.utils.toHex(rawTx.value * 1e18),
    data: rawTx.data
  }

  console.log(rawTx)

  var tx = new EthereumTx(rawTx);
  console.log(tx)
  tx.sign(privateKey);

  var serializedTx = tx.serialize();

  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
  .on('receipt', (result) => {
    console.log('result: ')
    console.log(result)
    callback(result)
  }).on('error', (error) => {
    throw error
  });
}

export function abiSend(rawTx, privateKey, callback) {

  console.log('abiSend: ')
  console.log(rawTx)
  // var tx = new EthereumTx(rawTx)
  privateKey =  Buffer.from(privateKey, 'hex')

  web3.eth.accounts.signTransaction(rawTx, privateKey).then(signed => {
    console.log(signed)
    var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);

    tran.on('confirmation', (confirmationNumber, receipt) => {
      console.log('confirmation: ' + confirmationNumber);
    });

    tran.on('transactionHash', hash => {
      console.log('hash');
      console.log(hash);
    });

    tran.on('receipt', receipt => {
      console.log('reciept');
      console.log(receipt);
      callback(receipt)
    });

    tran.on('error', error => {
      throw error
    });
  });
}
