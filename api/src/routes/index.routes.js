const express = require('express')
const router = express.Router()

const controller = require('../controllers/index.controller')

router.get('/', controller.index)
router.get('/query/:key', controller.get)
router.post('/invoke', controller.set)

module.exports = router
