const express = require('express') ; 
const adminrouter = express.Router() ; 
const { adminModel, courseModel } = require('../db/db') ; 
// adminrouter.use(adminMiddleware) ; 
const jwt = require('jsonwebtoken') ; 
const bcrypt = require('bcrypt') ; 
const { JWT_ADMIN_PASSWORD } = require('../config') ; 
const { adminMiddleware } = require('../middlewares/adminmiddleware')  

adminrouter.post('/signup',async (req,res) => { 
    const { email , password , firstname , lastname } = req.body ; 

    
    try { 
        const hashedPassword = bcrypt.hash(password , 10) ; 
        await adminModel.create({
            email : email , 
            password : hashedPassword , 
            firstname : firstname , 
            lastname : lastname , 
        })
        res.json({
            msg : "Admin signup succeeded"
        })
    } catch(e) { 
        res.status(404).json({
            msg : "Unable to sign in !!"
        })
    }
})

adminrouter.post('/signin', async (req,res) => { 
    const {email,password} = req.body ; 

    try { 
        const admin = await adminModel.findOne({
            email : email
        })

        const passwordcompare = bcrypt.compare(password,admin.password) ; 

        if(admin && passwordcompare) { 
            const token = jwt.sign({
                id : admin._id ,
            },JWT_ADMIN_PASSWORD)

            res.json({
                token : token , 
                msg : "You are signed in"
            })
        }
        
    } catch(e) {
        res.status(404).json({
            msg : "Unable to sign-in !!"
        })
    }
    

    
})

adminrouter.post('/course',adminMiddleware, async (req,res) => { 
    const adminId = req.id

    const { title , description , price , imageUrl  } =  req.body ; 


    try { 
        const course = await courseModel.create({
            title : title , 
            description : description , 
            price : price , 
            imageUrl : imageUrl , 
            creatorId : adminId  
        })

        res.json({
            message : "Course creator" , 
            courseId : course._id , 
        })
    } catch(e) { 
        res.json({
            message : "Cannot post course try again !!"
        })
    }

})

adminrouter.put('/course',adminMiddleware, async (req,res) => { 
    const adminId = req.id

    const { title , description , price , imageUrl } = req.body ; 

    try { 
        const updateCourse = await courseModel.updateOne({
            _id : courseId , 
            creatorId : adminId
        },{
            title : title , 
            description : description ,
            imageUrl : imageUrl ,
            price : price
        })

        if(updateCourse) { 
            res.json({
                message : "Course updated" , 
                courseId : updateCourse._id 
            })
        } else { 
            res.json({
                message : "Cannot update course !!"
            })
        }
    } catch(e) { 
        res.status(404).json({
            message : "Cannot update course !!"
        })
    }

})

adminrouter.get('/course/bulk',adminMiddleware, async (req,res) => { 
    const adminId = req.id
    try { 
        const courses = await courseModel.find({
            creatorId : adminId
        })
        res.json({
            message : "Your courses !!" , 
            courses
        })
    } catch(e) { 
        res.json({
            message : "Cannot get courses !!"
        })
    }
    
})

module.exports = adminrouter ; 