const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.post('/signup', controller.signup);
router.post('/signin', controller.signin);
router.post('/observation', controller.observation);
router.get('/getobservation', controller.getobservation);
router.post('/create-link', controller.createLink);
router.post('/reset-password/:token', controller.setNewPassword);

module.exports = router;