// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
window.onload = () => {
    console.log('onload')
    const btn = document.getElementById('btn')
    btn.onclick = () => {
        console.log('click')
        document.getElementById('btn').setAttribute("value", "clicked")
        window.ipcRenderer.send('click', '66666')
    }
    window.ipcRenderer.on('click1', (event, arg) => {
        console.log('click in renderer process')
        document.getElementById('btn').setAttribute("value", "click in renderer process")
    })

}