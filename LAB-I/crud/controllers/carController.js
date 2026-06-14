const Car = require('../models/Car');

exports.indexAction = (req, res, next) => {
    try {
        const cars = Car.findAll();
        res.render('cars/index', {
            title: 'Post List',
            bodyClass: 'index',
            cars: cars
        });
    } catch (err) {
        next(err);
    }
};

exports.createAction = (req, res, next) => {
    try {
        if (req.method === 'POST') {
            const requestCar = req.body.car;
            if (requestCar) {
                const car = Car.fromArray(requestCar);
                car.save();
                return res.redirect('/cars');
            }
        }

        const car = new Car();
        res.render('cars/create', {
            title: 'Create Post',
            bodyClass: 'edit',
            car: car
        });
    } catch (err) {
        next(err);
    }
};

exports.editAction = (req, res, next) => {
    try {
        const carId = req.params.id || req.body.id;
        const car = Car.find(carId);

        if (!car) {
            const err = new Error(`Missing car with id ${carId}`);
            err.status = 404;
            return next(err);
        }

        if (req.method === 'POST') {
            const requestCar = req.body.car;
            if (requestCar) {
                car.fill(requestCar);
                car.save();
                return res.redirect('/cars');
            }
        }

        res.render('cars/edit', {
            title: `Edit Car Entry ${car.getBrand()} ${car.getModel()} (${car.getId()})`,
            bodyClass: 'edit',
            car: car
        });
    } catch (err) {
        next(err);
    }
};

exports.showAction = (req, res, next) => {
    try {
        const carId = req.params.id;
        const car = Car.find(carId);

        if (!car) {
            const err = new Error(`Missing car with id ${carId}`);
            err.status = 404;
            return next(err);
        }

        res.render('cars/show', {
            title: `${car.getBrand()} ${car.getModel()} (${car.getId()})`,
            bodyClass: 'show',
            car: car
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteAction = (req, res, next) => {
    try {
        const carId = req.body.id;
        const car = Car.find(carId);

        if (!car) {
            const err = new Error(`Missing car with id ${carId}`);
            err.status = 404;
            return next(err);
        }

        car.delete();
        res.redirect('/cars');
    } catch (err) {
        next(err);
    }
};