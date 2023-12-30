const Message = require("../DataModels/messages");

const findMessagesForUser = async(senderID, receiverID) => {
    try{
        const messages = Message.findOne({
            attributes: ['msgs'],
            where: {
                fromID: senderID,
                toID: receiverID
            },
            raw: true
        })

        if(!messages) return null;
        return messages;
    }
    catch(err){
        return null;
    }
}

const getAllMessagesForUser = async(senderID) => {
    try{
        const messages = await Message.findAll({
            attributes: ['msgs', 'toID'],
            where: {
                fromID: senderID
            },
            raw: true
        })

        if(messages.length==0) return null;
        console.log(messages);
        return messages;
    }
    catch(err){
        console.log(err, 'coming from findMessagesForUser');
    }
}

const addMessagesForUser = async(senderID, receiverID, updatedMessages) => {
    let messages = await findMessagesForUser(senderID, receiverID);
    console.log(updatedMessages);
    if(!messages){
        const newMessage = Message.build({
            fromID: senderID, 
            toID: receiverID,
            msgs: [updatedMessages]
        });
        return newMessage.save()
        .then(res => {
            return true;
        })
        .catch(err => {
            return false;
        })
    }
    else{
        try{
            let updatedMessage = await Message.update(
                {
                    msgs: [...updatedMessages]
                },
                { 
                    where: {
                        fromID: senderID,
                        toID: receiverID
                    }
                }
            );
            
            if(!updatedMessage){
                throw new Error('Something went wrong!');
            }
            return true;
        }
        catch(err){
            return false;
        }
    }
    
}

module.exports = {findMessagesForUser, addMessagesForUser, getAllMessagesForUser};