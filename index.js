const express= require("express")
const { connect } = require("./config/db")
const { userRoutes } = require("./route/user.route")
const { authenticate } = require("./middleware/authentication.middleware")
const { restaurantRouter } = require("./route/restaurant.route")
const { orderRouter } = require("./route/order.route")

const app=express()

app.use(express.json())

app.get('/',(ask,give)=>{
    give.send("Food Delivery App Backend")
})

app.use('/api',userRoutes)

app.use(authenticate)
app.use('/api/restaurants',restaurantRouter)

app.use('/api/orders',orderRouter)

app.listen(4000,()=>{
    try {
        connect
        console.log("Connected to the DB & Server is running at 4000...");
    } catch (error) {
        console.log("Error in connecting to the DB");
    }
})