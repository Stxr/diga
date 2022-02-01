// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
window.onload = () => {
    console.log('onload')
    window.ipcRenderer.send('onload')
    var log = ""
    var env = {}
    const btn = document.getElementById('btn')
    btn.onclick = () => {
        console.log('click')
        document.getElementById('btn').setAttribute("value", "running")
        window.ipcRenderer.send('cmd', {
            cmd: env.argv.slice(1),
            dir: env.pwd
        })
        log = ""
    }
    window.ipcRenderer.on('cmd-close', (event, arg) => {
        printLog(log)
        document.getElementById('btn').setAttribute("value", "start")
    })
    window.ipcRenderer.on('cmd-data', (event, arg) => {
        log += arg
    })


    window.ipcRenderer.on('window-info', (event, arg) => {
        printLog(arg)
        env = arg
    })
}
function printLog(str, mode = 'append', domId = 'log', domWrapper = "log-wrapper") {
    console.log(str)
    if (str instanceof Array) {
        str = str.map((item, index) => {
            return `${index}: "${item}"`
        }).join('\n')
    } else if (str instanceof Object) {
        str = JSON.stringify(str, null, 2)
    }
    const logDom = document.getElementById(domId)
    const logWrapperDom = document.getElementById(domWrapper)
    const preLog = logDom.innerHTML
    if (mode === 'append') {
        logDom.innerHTML = preLog + str
        logWrapperDom.scrollTop = logWrapperDom.scrollHeight
        console.log(logDom.scrollHeight)
    } else if (mode === 'overwrite') {
        logDom.innerHTML = str
    }

}