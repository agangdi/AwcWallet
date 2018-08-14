
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