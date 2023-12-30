const store = new Map();

class Storage{
    constructor(){

    }

    static saveSession (id, obj) {
        store.set(id, obj);
    }

    static findSession(id){
        return store.get(id);
        
    }

    static findAllSession(){
        return [...store.values()]
    }

    static setDisconnection(id) {
        const obj = store.get(id);
        obj.connected = false;
    }

    static setReConnection(id) {
        console.log(id, 'from setreconnection');
        const obj = store.get(id);
        if(!obj){
            throw new Error('Fetched user session id not valid');
        }
        obj.connected = true;
    }

    static findUserToAdd(userID){
        const existingUsers = [...store.values()];
        let user = existingUsers.find(arr => {
            return arr.userID==userID;
        })
        if(!user){
            console.log('no user fount');
            throw new Error('userId not valid');
        }
        return user;
    }
}

module.exports = Storage