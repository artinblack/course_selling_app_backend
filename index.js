const express = require('express') ;
require('dotenv').config() ; 
const app = express() ; 
const cors = require('cors') ; 
const mongoose = require('mongoose') ; 

const userRouter = require('./routes/user') ; 
const courseRouter = require('./routes/course')
const adminRouter = require('./routes/admin')
// const { adminModel , userModel , courseModel , purchasesModel } = require('./db/db')


app.use(express.json()) ; 
app.use(cors()) ; 

app.use("/user", userRouter) ; 
app.use("/course", courseRouter) ; 
app.use('/admin', adminRouter) ;

async function main() { 
    await mongoose.connect(process.env.MONGO_URL) ; 
    app.listen(3000) ; 
    console.log('listening on port 3000'); 
}

main() ; 
