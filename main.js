const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db');

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 850,
    height: 700,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
    }
  });
  win.loadFile('index.html');
}

// Function to pull all clients and sync the frontend view
function sendUpdatedClients() {
    db.all("SELECT * FROM clients ORDER BY id DESC", [], (err, rows) => {
        if (!err) {
            win.webContents.send('render-clients', rows);
        } else {
            console.error("Database read error:", err);
        }
    });
}

// Event: Add New Client
ipcMain.on('add-client', (event, data) => {
    const stmt = db.prepare("INSERT INTO clients (name, phone, email, notes, reg_date) VALUES (?, ?, ?, ?, ?)");
    stmt.run(data.name, data.phone, data.email, data.notes, data.reg_date, () => {
        sendUpdatedClients();
    });
    stmt.finalize();
});

// Event: Update Existing Client
ipcMain.on('update-client', (event, data) => {
    const stmt = db.prepare("UPDATE clients SET name = ?, phone = ?, email = ?, notes = ? WHERE id = ?");
    stmt.run(data.name, data.phone, data.email, data.notes, data.id, () => {
        sendUpdatedClients();
    });
    stmt.finalize();
});

// Event: Delete Client Record
ipcMain.on('delete-client', (event, id) => {
    const stmt = db.prepare("DELETE FROM clients WHERE id = ?");
    stmt.run(id, () => {
        sendUpdatedClients();
    });
    stmt.finalize();
});

// Event: Initial Data Request on Launch
ipcMain.on('get-clients', () => {
    sendUpdatedClients();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
