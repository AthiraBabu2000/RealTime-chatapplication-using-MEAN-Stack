const express = require('express');
const router = express.Router();

const userModel = require('../models/user')

// show selected user only
router.get('/chat/:id', async(req, res)=>{
    try {
        let id = req.params.id
    console.log("id from chat api ",id)
    let user = await userModel.find({_id:id})
    res.send(user)
    } catch (error) {
        console.log(error)
    }
    
})

// show all users in the chat list
router.get('/users', async(req, res)=>{
    try {
        console.log("ok")
    let data = await userModel.find();
    // console.log(data)
    res.send(data)
    } catch (error) {
        console.log(error)
    }
    
})



// select single user with user name
router.post('/logined_user', async(req, res)=>{
    try {
        // console.log("function called-------------------");
        // console.log("from frontend ", req.body.sender);
        let name = req.body.sender
        let user = await userModel.findOne({userName : name},{password : 0})
        if(user){
            console.log(user);
            res.send(user)
        }else{
            console.log("No user found");
            res.status(404) 
        }
    } catch (error) {
        console.log(error)
    }
})


// for muting a user
router.put('/mute_users', async(req, res)=>{
    try {
        console.log("from frontend ", req.body);
        let name = req.body.data.sender
        let mutedUser = req.body.data.recipient
        muted = await userModel.updateOne({userName : name},{$push: {mutedUsers : mutedUser}})
        console.log(muted);
        if(muted.acknowledged == true){
            res.json({success:true,message:"Muted"})
        }else{
            res.json({success:failed,message:"mute failed"})
        }
    } catch (error) {
        console.log(error);  
    }
})

// for unmuting a user
router.put('/unmute_users', async(req, res)=>{
    try {
        console.log("from frontend ", req.body);
        let name = req.body.data.sender
        let mutedUser = req.body.data.recipient
        unMuted = await userModel.updateOne({userName : name},{$pull : {mutedUsers : mutedUser}})
        console.log(unMuted);
        if(unMuted.acknowledged == true){
            res.json({success:true,message:"Unmuted"})
        }else{
            res.json({success:failed,message:"unmute Failed"})
        }
    } catch (error) {
        console.log(error);
    }
})

// for blocking a user
router.post('/block_users', async(req, res)=>{
    try {
        console.log("from block : ", req.body);
        let name = req.body.data.sender
        let blockedUser = req.body.data.recipient
        blocked = await userModel.updateOne({userName : name},{$push: {blockedUsers : blockedUser}})
        console.log(blocked);
        if(blocked.acknowledged == true){
            res.json({success:true,message:"Blocked"})
        }else{
            res.json({success:failed,message:"Block Failed"})
        }
    } catch (error) {
        console.log(error);
    }
})

// for unblocking a user
router.post('/unblock_users', async(req, res)=>{
    try {
        console.log("from block : ", req.body);
        let name = req.body.data.sender
        let blockedUser = req.body.data.recipient
        unBlocked = await userModel.updateOne({userName : name},{$pull: {blockedUsers : blockedUser}})
        console.log(unBlocked);
        if(unBlocked.acknowledged == true){
            res.json({success:true,message:"Unblocked"})
        }else{
            res.json({success:failed,message:"Unblock failed"})
        }
    } catch (error) {
        console.log(error);
    }
})





module.exports = router