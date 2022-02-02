const {createCmd} = require('./tools/cmd-launch')
const template = [
    {
        label: 'Tools',
        submenu: [
            {
                label: 'Create Command-line Launcher...',
                click() {
                    createCmd()
                    console.log('create command-line launcher')
                }
            },
        ]
    }
]
function createMenu(app) {
    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                {
                    label: 'Quit',
                    accelerator: 'CmdOrCtrl+Q',
                    click() {
                        app.quit();
                    }
                }
            ]
        });
    }
    console.log(template)
    return template
}
module.exports = { createMenu }