const SavedUser = require("../DataModels/saveduser");

const findSavedUserByUserID = async(userID) => {
    try{
        const searchedUser = SavedUser.findOne(
            {
                where: {
                    userID: userID
                }, 
                raw: true
            }
        )
        if(!searchedUser) return null;
        return searchedUser;
    }
    catch(err){
        throw err;
    }
}

const saveNewUserInfo = async(sessionID, userID, username, connected) => {
    const newUser = SavedUser.build({
        sessionID: sessionID,
        username: username,
        userID: userID,
        isConnected: connected,
        users: [{
            username: username,
            sessionID: sessionID, 
            userID: userID,
            self: true,
            name: ''
        }]
    })

    newUser.save()
    .then(res => {
        console.log('new user data saved');
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
}

const fetchUsersDetails = async(userID) => {
    const users = SavedUser.findOne(
    {
        attributes: ['users'],
        where: {
            userID: userID
        },
        raw: true
    }
    );

    if(!users) throw new Error('No User Found!, fetchUsersDetails');
    return users;

}


const addUserToUsersDetails = async(userID, users) => {
    SavedUser.update(
        {
            users: users
        },
        {
            where: {
                userID: userID
            }
        }
    )
    .then(res => {
        return 'sucessful';
    })
    .catch(err => console.log(err));
}


module.exports = { findSavedUserByUserID, saveNewUserInfo, fetchUsersDetails, addUserToUsersDetails}