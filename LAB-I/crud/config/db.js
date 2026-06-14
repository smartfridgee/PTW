const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

// Ścieżka do pliku bazy danych (data.db w głównym katalogu projektu)
const dbPath = path.resolve(__dirname, '..', 'data.db');
const db = new DatabaseSync(dbPath);

// Automatycznie upewniamy się, że tabela dla aut istnieje
db.prepare(`
    CREATE TABLE IF NOT EXISTS car (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand TEXT,
        model TEXT,
        content TEXT
    )
`).run();

module.exports = db;