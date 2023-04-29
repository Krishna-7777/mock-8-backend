const express = require("express")
const jwt = require("jsonwebtoken");
const { RestModel } = require("../models/restaurant.model");
const { UserModel } = require("../models/user.model");
const { OrderModel } = require("../models/order.model");

const orderRouter = express.Router()

orderRouter.post('/', async (ask, give) => {
    let token = ask.headers.authorization;
    let { restaurant, items } = ask.body
    let payload = { restaurant }
    try {
        let user = (await jwt.decode(token)).id
        let restData = await RestModel.findById(restaurant);
        if (restData) {
            let fitems = [],totalPrice=0
            for (let i in restData.menu) {
                if (items[restData.menu[i]._id]!=undefined) {
                    let quantity=items[restData.menu[i]._id]
                    let object=restData.menu[i]
                    fitems.push(restData.menu[i])
                    totalPrice+=(restData.menu[i].price)*items[restData.menu[i]._id]
                }
            }
            let deliveryAddress=(await UserModel.findById(user)).address
            if (fitems.length) {
                payload.user=user
                payload.items=fitems
                payload.totalPrice=totalPrice
                payload.deliveryAddress=deliveryAddress
                payload.status="placed"
                let order=new OrderModel(payload)
                await order.save()
                give.status(201).send({ msg: "Order with Available items Placed!" })
            } else {
                give.status(404).send({ msg: "No item Found!" })
            }
        } else {
            give.status(404).send({ msg: "Restaurant not Found!" })
        }
    } catch (error) {
        console.log(error);
        give.status(403).send({ msg: "Error in placing the order!" })
    }
})

orderRouter.get('/:id',async(ask,give)=>{
    try {
        let data= await OrderModel.findById(ask.params.id)
        give.send(data)
    } catch (error) {
        give.status(403).send({ msg: "Error in getting order deatils!" })
    }
})

orderRouter.patch('/:id',async(ask,give)=>{
    try {
        let data= await OrderModel.findById(ask.params.id)
        let {status}=ask.body
        data.status=status
        await OrderModel.findByIdAndUpdate(ask.params.id,data)
        give.status(204).send({msg:`The order status has been updated to ${status}`})
    } catch (error) {
        give.status(403).send({ msg: "Error in updating order status!" })
    }
})

module.exports={
    orderRouter
}