const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

// Store the database inside the application data folder so it is completely local
const dbPath = path.join(app.getPath('userData'), 'clients_offline.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT, email TEXT)");
});

module.exports = db;
