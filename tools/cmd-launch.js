const {} = require('child_process');
const path = require('path');
// create command line launcher
function createCmd() {
    
    const realPath = path.join(path.dirname(__dirname), 'bin/start');
    require('child_process').spawn('ln', ['-s', realPath, '/usr/local/bin/diga']);
    // __dirname
    // const result = require('child_process').spawnSync('echo', ['"$0"']);
    // console.log(result.stdout.toString());
    console.log(realPath)
}
module.exports = { createCmd }
