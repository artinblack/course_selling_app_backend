const express = require('express') ; 
const router = express.Router() ; 
const { purchasesModel ,  courseModel } = require('../db/db') ; 
const { userMiddleware } = require('../middlewares/usermiddleware') ; 


router.post("/purchase",userMiddleware, async (req,res) => { 
    const userId = req.id ;
    const courseId = req.body.courseId ; 

    try { 
        await purchasesModel.create({
            userId , 
            courseId
        })
        res.json({
            message : "You have successfully bought the course"
        })
    } catch(e) { 
        res.json({
            message : "Unable to preview courses !!" , 
            error : e
        })
    }

    

    

})

router.get('/preview', async (req,res) => { 
    try { 
        const courses = await courseModel.find({})
        res.json({
            courses : courses
        })
    } catch(e) { 
        res.json({
            message : "Unable to preview courses !!" , 
            error : e
        })
    }

})

module.exports = router
