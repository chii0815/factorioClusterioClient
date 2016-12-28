const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const ipc = ipcMain
const needle = require("needle")
const child_process = require('child_process');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
	// Create the browser window.
	win = new BrowserWindow({width: 1280, height: 800})

	// and load the index.html of the app.
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))
	
	// Open the DevTools.
	win.webContents.openDevTools()

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null
	})
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow()
	}
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipc.on('getServers', function (event, data) {
    //console.log(data)
	needle.get('localhost:8080/slaves', function(error, response, body) {
		if (!error) {
			event.sender.send('setServers', body)
		}
	});
});

ipc.on("launchFactorio", function(event, data){
	console.log("Preparing to launch factorio... "+data)
	// Todo: Check if factorio server is running at that port before launching factorio,
	// possibly using https://www.npmjs.com/package/portscanner
	
	// spawn factorio and tell it to connect to a server directly
	var gameprocess = child_process.spawn("./factorio/bin/x64/factorio", [
		"--mp-connect", data.ip+":"+data.port,
	]);
});