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
    const btn_start = document.getElementById('btn_start')
    const btn_create = document.getElementById('btn_create')
    const btn_save = document.getElementById('btn_save')
    const text_title = document.getElementById('title')
    btn_start.onclick = () => {
        console.log('click')
        btn_start.setAttribute("value", "running")
        window.ipcRenderer.send('cmd', {
            cmd: env.argv,
            dir: env.pwd
        })
        log = ""
    }

    btn_create.onclick = () => {
        window.ipcRenderer.send('create', {
            cmd: env.argv.slice(1),
            dir: env.pwd,
            title: text_title.value,
        })
    }
    btn_save.onclick = () => {
        window.ipcRenderer.send('save', {
            cmd: env.argv.slice(1),
            dir: env.pwd,
            title: text_title.value,
        })
    }
    text_title.onblur = (_, ev) => {
        printLog(`onblur:${text_title.value}`)
    }


    window.ipcRenderer.on('cmd-close', (event, arg) => {
        printLog(log)
        btn_start.setAttribute("value", "start")
    })
    window.ipcRenderer.on('cmd-data', (event, arg) => {
        log += arg
    })


    window.ipcRenderer.on('window-info', (event, arg) => {
        printLog(arg)
        env = arg
        document.getElementById('title').value = env.title
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
        logDom.innerHTML = preLog + '\n' + str
        logWrapperDom.scrollTop = logWrapperDom.scrollHeight
        console.log(logDom.scrollHeight)
    } else if (mode === 'overwrite') {
        logDom.innerHTML = str
    }

}