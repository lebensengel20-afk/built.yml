const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

// Store the database file safely in the application data folder
const dbPath = path.join(app.getPath('userData'), 'clients_offline.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Structural update: Added notes and reg_date text tracking columns
    db.run(`
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT, 
            phone TEXT, 
            email TEXT, 
            notes TEXT, 
            reg_date TEXT
        )
    `);
});

module.exports = db;
