const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db');

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
    }
  });
  win.loadFile('index.html');
}

// Function to fetch and broadcast updated records
function sendUpdatedClients() {
    db.all("SELECT * FROM clients ORDER BY id DESC", [], (err, rows) => {
        if (!err) win.webContents.send('render-clients', rows);
    });
}

ipcMain.on('add-client', (event, data) => {
    const stmt = db.prepare("INSERT INTO clients (name, phone, email) VALUES (?, ?, ?)");
    stmt.run(data.name, data.phone, data.email, () => {
        sendUpdatedClients();
    });
    stmt.finalize();
});

ipcMain.on('get-clients', () => {
    sendUpdatedClients();
});

app.whenReady().then(createWindow);
