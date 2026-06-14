const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

router.get('/', (req, res, next) => {
    try {
        const cars = Car.findAll();
        res.render('cars/index', {
            cars: cars
        });
    } catch (err) {
        next(err);
    }
});

router.get('/create', (req, res, next) => {
    try {
        const car = new Car();
        res.render('cars/create', {
            car: car
        });
    } catch (err) {
        next(err);
    }
});

router.post('/create', (req, res, next) => {
    try {
        const requestCar = req.body.car;
        if (requestCar) {
            const car = Car.fromArray(requestCar);
            car.save();
            return res.redirect('/cars');
        }
        res.redirect('/cars/create');
    } catch (err) {
        next(err);
    }
});

router.get('/edit/:id', (req, res, next) => {
    try {
        const carId = req.params.id;
        const car = Car.find(carId);

        if (!car) {
            const err = new Error(`Missing car with id ${carId}`);
            err.status = 404;
            return next(err);
        }

        res.render('cars/edit', {
            title: `Edit Car Entry ${car.getBrand()} ${car.getModel()} (${car.getId()})`,
            bodyClass: 'edit',
            car: car
        });
    } catch (err) {
        next(err);
    }
});

router.post('/edit', (req, res, next) => {
    try {
        const carId = req.body.id;
        const car = Car.find(carId);

        if (!car) {
            const err = new Error(`Missing car with id ${carId}`);
            err.status = 404;
            return next(err);
        }

        const requestCar = req.body.car;
        if (requestCar) {
            car.fill(requestCar);
            car.save();
            return res.redirect('/cars');
        }
    } catch (err) {
        next(err);
    }
});

router.get('/show/:id', (req, res, next) => {
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
});

router.post('/delete', (req, res, next) => {
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
});

module.exports = router;