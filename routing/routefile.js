const express = require('express');
const router = express.Router();
const SavedUser = require("../DataModels/saveduser");
const {saveNewUserInfo, fetchUsersDetails, addUserToUsersDetails} = require("../Query/saveduserquery")
const {findMessagesForUser, addMessagesForUser, getAllMessagesForUser} = require("../Query/messagesquery");

// Define routes for the 'posts' path
router.post('/adduser', async(req, res, next) => {
    
});

router.post('/fetchusers', async(req, res, next) => {
    const userID = req.body.userID;
    if(!userID){
        res.status(404).json({message: 'Request Not Valid'});
    }
    const users = await fetchUsersDetails(userID);

    res.status(200).json({data: users, message: 'Users Fetched Successfully'});
});

router.post('/addusers', async(req, res, next) => {
    const userID = req.body.userID;
    const newUser = req.body.user;
    if(!userID){
        res.status(404).json({message: 'Request Not Valid'});
    }
    const usersData = await fetchUsersDetails(userID);
    
    let updatedUsers = [...usersData.users];
    updatedUsers.push(newUser);

    addUserToUsersDetails(userID, updatedUsers);

});

router.post('/fetchmessages', async(req, res, next) => {
    const senderID = req.body.senderID;
    console.log(senderID, 'from fetchmessages');

    let data = await getAllMessagesForUser(senderID);
    console.log(data, 'from /fetchmessage');
    if(data){
        res.status(200).json({data: data, message: 'Messages found successfully'});
    }
    else{
        res.status(404).json({message: 'Not found!'});
    }
});



module.exports = router;