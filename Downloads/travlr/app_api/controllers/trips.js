const mongoose = require('mongoose');
const trips = mongoose.model('trips');

const fetchTrips = async (req, res) => {
    if (!!req.params.tripCode) {
        try {
            res.json(await trips.findOne({ 'code': req.params.tripCode}));
        } catch (e) {
            res.status(404).send(`No trip found for code ${req.params.tripCode}`);
        }
        return;
    }
    res.json(await trips.find({}));
};

const addTrip = async (req, res) => {
    const newTrip = req.body;

    if (!newTrip) {
        res.status(400).send('No trip record found in body of request');
        return;
    }

    try {
        const savedTrip = await trips.create(newTrip);

        res.status(201).json(savedTrip);
    } catch (e) {
        res.status(400).json(e);
    }
};

const updateTrip = async (req, res) => {
    const tripCode = req.params.tripCode;
    let trip = req.body;

    trip = Object.assign(trip, {tripCode});

    try {
        const updatedTrip = await trips.findOneAndUpdate({'code': tripCode}, trip, {new: true});

        if (updatedTrip == null) {
            res.status(404).send({message: `No trip was found for code: ${tripCode}`});
            return;
        }

        res.status(200).json(updatedTrip);
    } catch (e) {
        res.status(500).json(2);
    }
}

const deleteTrip = async (req, res) => {
    try {
        if (!req.params.tripCode) {
            res.status(400).send(':tripCode is a required parameter');
            return;
        }

        if ((await trips.deleteOne({ 'code': req.params.tripCode })) < 0) {
            res.status(404).send(`No trip found with tripCode ${req.params.tripCode}`);
            return;
        }
        res.status(200).send();
    } catch (e) {
        res.status(500).json(e);
    }
};

module.exports = {
    fetchTrips,
    addTrip,
    updateTrip,
    deleteTrip
};