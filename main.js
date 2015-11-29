var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var globalShortcut = require('global-shortcut');
var fs = require('fs');
var pathMod = require('path');
const dialog = require('electron').dialog;

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var windows = [];

var captureShortcuts = function() {
  globalShortcut.register('Ctrl+N', function() {
    createWindow();
  });

  globalShortcut.register('Ctrl+Shift+N', function() {
    file = dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {
          name: 'Markdown File (*.md)',
          extensions: ['md']
        },
        {
          name: 'All Files',
          extensions: ['*']
        }
      ]
    })

    if (file !== undefined) {
      createWindow(file[0]);
    }
  });
};

var createWindow = function(file) {

  defaultFile = __dirname + '/editor/default-content.md';
  file = file === undefined ? defaultFile : file;
  isDefault = file === defaultFile;

  fs.open(file, 'r', function(err, fileToRead){
    if (!err){
      fs.readFile(file, {encoding: 'utf-8'}, function(err,data){
        if (!err){
          // Create the browser window.
          mainWindow = new BrowserWindow({width: 1200, height: 600});
          mainWindow.on('closed', function() {
            mainWindow = null;
          });

          mainWindow.webContents.on('did-finish-load', function() {
            mainWindow.webContents.send('markdown-content', JSON.stringify({
              filePath: file,
              fileName: pathMod.basename(file),
              contents: data,
              isDefault: isDefault
            }));
          });

          mainWindow.webContents.openDevTools();
          mainWindow.loadURL('file://' + __dirname + '/editor/index.html');
          windows.push(mainWindow);
        }else{
          console.log(err);
        }
      });
    }else{
      console.log(err);
    }
  });
};


// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  captureShortcuts();
  createWindow();
});