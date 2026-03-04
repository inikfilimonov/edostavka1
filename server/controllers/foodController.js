const uuid = require('uuid')
const path = require('path');
const {Food} = require('../models/models')
const ApiError = require('../error/ApiError')

class FoodController {
    async create(req, res, next) {
        try {
            const {name, price, placeId, typeId, info} = req.body
            const {image} = req.files
            let fileName = uuid.v4() + ".jpg"
            image.mv(path.resolve(__dirname, '..', 'static', fileName))
            
            const food = await Food.create({name, price, placeId, typeId, image: fileName})
            
            return res.json(food)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        const {placeId, typeId} = req.query
        let foods;
        if (!placeId && !typeId) {
            foods = await Food.findAll()
        }
        if (placeId && !typeId) {
            foods = await Food.findAll({where: {placeId}})
        }
        if (!placeId && typeId) {
            foods = await Food.findAll({where: {typeId}})
        }
        if (placeId && typeId) {
            foods = await Food.findAll({where: {typeId, placeId}})
        }
        return res.json(foods)
    }

    async getOne(req, res) {
        
    }
}

module.exports = new FoodController()
