const { spawn } = require('child_process');
function runCmd(cmdStr, dir, cb) {
    const { cmd, args } = getCmd(cmdStr)
    const result = spawn(cmd, args, {
        cwd: dir,
        shell: true,
        // stdio: 'inherit',
        detached: true
    })
    result.stdout.on('close', () => {
        cb && cb.onClose && cb.onClose()
    })

    result.stdout.on('data', (data) => {
        const strData = data.toString();
        cb && cb.onData && cb.onData(strData)
    })
}

function getCmd(cmd) {
    let args = []
    if (cmd instanceof Array) {
        args = cmd
    } else {
        args = cmd.split(' ')
    }
    return {
        cmd: args[0],
        args: args.slice(1) || []
    }
}
module.exports = { runCmd }

