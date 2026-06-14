const db = require('../config/db');

class Car {
    constructor(data = {}) {
        this.id = data.id || null;
        this.brand = data.brand || null;
        this.model = data.model || null;
        this.content = data.content || null;
    }

    getId() { return this.id; }
    setId(id) { this.id = id; return this; }
    getBrand() { return this.brand; }
    setBrand(brand) { this.brand = brand; return this; }
    getModel() { return this.model; }
    setModel(model) { this.model = model; return this; }
    getContent() { return this.content; }
    setContent(content) { this.content = content; return this; }

    static fromArray(array) {
        return new Car(array);
    }

    fill(array) {
        if (array.id && !this.getId()) this.setId(Number(array.id));
        if (array.brand) this.setBrand(array.brand);
        if (array.model) this.setModel(array.model);
        if (array.content) this.setContent(array.content);
        return this;
    }

    static findAll() {
        const rows = db.prepare('SELECT * FROM car').all();
        return rows.map(row => Car.fromArray(row));
    }

    static find(id) {
        const row = db.prepare('SELECT * FROM car WHERE id = ?').get(Number(id));
        if (!row) return null;
        return Car.fromArray(row);
    }

    save() {
        if (!this.getId()) {
            const result = db.prepare('INSERT INTO car (brand, model, content) VALUES (?, ?, ?)')
                .run(this.getBrand(), this.getModel(), this.getContent());
            this.setId(result.lastInsertRowid);
        } else {
            db.prepare('UPDATE car SET brand = ?, model = ?, content = ? WHERE id = ?')
                .run(this.getBrand(), this.getModel(), this.getContent(), this.getId());
        }
    }

    delete() {
        db.prepare('DELETE FROM car WHERE id = ?').run(this.getId());
        this.setId(null);
        this.setBrand(null);
        this.setModel(null);
        this.setContent(null);
    }
}

module.exports = Car;