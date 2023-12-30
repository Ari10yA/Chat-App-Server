const User = require('../DataModels/user');

const saveNewUser = async (username, sessionID, userID, connected) => {
    const newUser = User.build({
        sessionID: sessionID,
        username: username,
        userID: userID,
        isConnected: connected
    })
    newUser.save()
    .then((res) => {
        console.log('saved in database');
    })
    .catch((err) => {
        console.log(err);
    })
}

const findUserWithSessionID = async (id) => {
    try{
        const user = await User.findOne({
            where: {
                sessionID: id
            },
            raw: true
        });
        if(user) return user;
        else throw new Error('User not found');
    }
    catch(err){
        if(err.message == 'User not found'){
            throw err;
        }
        throw new Error('Error finding the user');
    }
}

const findAllUsers = async () => {
    try{
        const users = await User.findAll()
        if(users) return users;
        else throw new Error('No User Found');
    }
    catch(err){
        if(err.message == 'No User Found'){
            throw err;
        }
        throw new Error('Error finding users');
    }
}

const findUserWithUserID = async(userID) => {
    try{
        const user = await User.findOne({
            where: {
                userID: userID
            },
            raw: true
        });
        if(user) return user;
        else throw new Error('User not found');
    }
    catch(err){
        if(err.message == 'User not found'){
            throw err;
        }
        throw new Error('Error finding the user');
    }
}

const setReConnection = async(sessionID) => {
    try{
        const updatedUser = await User.update(
         {
            connected: true
         },   
        {    
            where: {
                sessionID: sessionID
            }
        });
        if(!updatedUser) throw new Error('User Not Found');
        return true;
    }
    catch(err){
        console.log(err);
    }
}   

const setDisconnection = async(sessionID) => {
    try{
        const updatedUser = await User.update(
         {
            connected: false
         },   
        {    
            where: {
                sessionID: sessionID
            }
        });
        if(!updatedUser) throw new Error('User Not Found');
        return true;
    }
    catch(err){
        console.log(err);
    }
}



module.exports = {findUserWithSessionID, saveNewUser, findAllUsers, findUserWithUserID, setReConnection, setDisconnection}