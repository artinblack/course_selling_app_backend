const mongoose = require('mongoose') ; 
const Schema = mongoose.Schema ; 
const ObjectId = Schema.ObjectId ; 

const User = new Schema({
    email : {
        type : String , 
        unique : true 
    } , 
    password : String , 
    firstname : String , 
    lastname : String , 
})

const Admin = new Schema({
    email : { 
        type : String, 
        unique : true , 
    }, 
    password : String, 
    firstname : String , 
    lastname : String 
}) 

const Course = new Schema({
    title : String , 
    description : String , 
    price : Number , 
    imageUrl : String , 
    creatorId : ObjectId
})

const Purchases = new Schema({
    userId : ObjectId ,
    courseId : ObjectId
})

const adminModel = mongoose.model('admin',Admin) ; 
const userModel = mongoose.model('user',User) ; 
const courseModel = mongoose.model('course',Course) ; 
const purchasesModel = mongoose.model('purchases',Purchases) ; 

module.exports = { 
    adminModel , 
    userModel , 
    courseModel , 
    purchasesModel , 
}