const {saveNewUserInfo, fetchUsersDetails, addUserToUsersDetails} = require("../Query/saveduserquery")
const {findMessagesForUser, addMessagesForUser} = require("../Query/messagesquery");

const addUserFunction = async(userID, userDetails) => {
    const usersData = await fetchUsersDetails(userID);
    
    let updatedUsers = [...usersData.users];
    updatedUsers.push(userDetails);

    const response = await addUserToUsersDetails(userID, updatedUsers);


    return true;
}

const validityCheckForExistingUsers = (userID, users) => {
    let flag = users.users.find(user => {
        return user.userID == userID
    })

    if(!flag){
        return false;
    }
    return true;
}

const addMessageFunction = async(senderID, receiverID, message) => {

    let data = await findMessagesForUser(senderID, receiverID);

    let updatedData;
    if(data){
        updatedData = [...data.msgs, message];
    }
    else{
        updatedData = message;  
    }
    
    let result = await addMessagesForUser(senderID, receiverID, updatedData);

}

module.exports = {addUserFunction, validityCheckForExistingUsers, addMessageFunction};