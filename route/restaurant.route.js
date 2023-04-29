const express = require("express")
const { RestModel } = require("../models/restaurant.model")

const restaurantRouter = express.Router()

restaurantRouter.get('/', async (ask, give) => {
    try {
        let data = await RestModel.find({}, { _id: 1, name: 1, });
        give.status(200).send(data)
    } catch (error) {
        give.status(403).send({ msg: "Error in Showing available Restuarants!" })
    }
})

restaurantRouter.get('/:id', async (ask, give) => {
    try {
        let data = await RestModel.findById(ask.params.id, { _id: 0, name: 1, address: 1 });
        give.status(200).send(data)
    } catch (error) {
        give.status(403).send({ msg: "Error in Showing available Restuarants!" })
    }
})

restaurantRouter.get('/:id/menu', async (ask, give) => {
    try {
        let data = await RestModel.findById(ask.params.id, { menu: 1 });
        give.status(200).send(data)
    } catch (error) {
        give.status(403).send({ msg: "Error in Showing available Restuarants!" })
    }
})

restaurantRouter.post('/:id/menu', async (ask, give) => {
    try {
        let data = await RestModel.findById(ask.params.id);
        if (data) {
            data.menu.push(ask.body)
            await RestModel.findByIdAndUpdate(ask.params.id, data)
            give.status(201).send({ msg: "new item added" })
        } else {
            give.status(404), send({ msg: "Restaurant not Found!" })
        }
    } catch (error) {
        give.status(403).send({ msg: "Error in adding new item!" })
    }
})

restaurantRouter.delete('/:id/menu/:iid', async (ask, give) => {
    try {
        let data = await RestModel.findById(ask.params.id);
        if (data) {
            let flag = false
            for (let i in data.menu) {
                if (data.menu[i]._id == ask.params.iid) {
                    flag = true;
                    data.menu.splice(i, 1);
                    break;
                }
            }

            if (flag) {
                await RestModel.findByIdAndUpdate(ask.params.id,data)
                give.status(202).send({ msg: "Menu Item deleted" })
            } else {
                give.status(404).send({ msg: "Menu Item not found!" })
            }}else{
                give.status(404), send({ msg: "Restaurant not Found!" })
            }
        } catch (error) {
            give.status(403).send({ msg: "Error in adding new item!" })
        }
    })

module.exports = {
    restaurantRouter
}