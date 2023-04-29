const mongoose=require("mongoose")

const schema=mongoose.Schema({
    name: String,
    email: String,
    password: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String
    }
  })

const UserModel=mongoose.model("users",schema)

module.exports={
    UserModel
}