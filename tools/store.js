const Store = require('electron-store')
const store = new Store()

function set(key, value) {
    console.log(`set key:${key}, value:${value}`)
    store.set(key, value)
}

function get(key, defaultValue = null) {
    console.log(`get key:${key}`)
    return store.get(key, defaultValue)
}

function deleteKey(key) {
    console.log(`delete key:${key}`)
    store.delete(key)
}

const storageKeys = "windows"
function addStorageKey(key) {
    set(storageKeys, [...new Set(getStorageKeys()).add(key)])
}

function getStorageKeys() {
    return get(storageKeys, [])
}
module.exports = { get, set, deleteKey, addStorageKey, getStorageKeys }