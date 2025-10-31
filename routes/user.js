const express = require('express') ; 
const router = express.Router() ; 
const { userModel , purchasesModel , courseModel } = require('../db/db') ; 
const { JWT_USER_PASSWORD } = require('../config') ; 
const { userMiddleware } = require('../middlewares/usermiddleware');
// const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt') 


router.post('/signup', async (req,res) => { 
    const { email , password , firstName , lastName } = req.body ; 
    

    try { 
        const hashedPassword = await bcrypt.hash(password,10); 
        await userModel.create({
            email : email , 
            password : hashedPassword , 
            firstname : firstName , 
            lastname : lastName , 
        })

        res.json({
            msg : "Signup succeeded !!"
        })

    } catch(e) { 
        res.status(403).json({
            error : "Can't connect to Database !!"
        })
    }
})


router.post('/signin', async (req,res) => { 
    const { email , password  } = req.body ; 

    try { 
        const user = await userModel.findOne({
            email : email , 
        })
        const passwordmatch = bcrypt.compare(password,user.password) ; 

        if(user && passwordmatch) { 

            const token = jwt.sign({
                id : user._id , 
            },JWT_USER_PASSWORD)
            
            res.json({
                token : token ,
                msg : "You are signed in !!"
            })
        } else { 
            res.status(403).json({
                msg : "Incorrect Credentials !!"
            })
        }
    } catch(e) { 
        res.status(404).json({
            msg : "NOT FOUND !!"
        })
    }

    

})

router.get("/purchases",userMiddleware, async (req,res) => { 
    const userId = req.userId  ; 
    
    try { 
        const purchases = await purchasesModel.find({
            userId
        }) 

        let purchasedCourseIds = [] ; 

        for (let i = 0 ; i < purchases.length ; i++ ) { 
            purchasedCourseIds.push(purchases[i].courseId) ; 
        }

        const courseData = await courseModel.find({
            _id : { 
                $in : purchasedCourseIds
            }
        })
        
        res.json({
            purchases,
            courseData
        })

    } catch(e) { 
        res.json({
            msg : 'Unable to get purchases '
        })
    }
})

// router.post('/purchases',(req,res) => { 
//     // you would expect the user to pay you money 
//     res.json({
//         msg : "willing to purchase"
//     })
// })

module.exports = router ; 