const md5 = require('md5');
/**
 * 
 * @param {string} cmd command line
 * @param {string} pwd directory path
 * @returns 
 */
function getStoreKey(cmd, dir) {
    const cmdHash = md5(cmd)
    const pwdHash = md5(dir)
    return md5(`${cmdHash}-${pwdHash}`)
}
module.exports = { getStoreKey }
