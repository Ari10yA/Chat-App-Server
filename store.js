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
        const obj = store.get(id);
        obj.connected = true;
    }

}

module.exports = Storage