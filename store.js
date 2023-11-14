const store = new Map();

class Storage{
    constructor(){

    }

    static saveSession (id, obj) {
        store.set(id, obj);
        console.log('session stored');
    }

    static findSession(id){
        return store.get(id);
        
    }

    static findAllSession(){
        return [...store.values()]
    }

}

module.exports = Storage

// class InMemorySessionStore extends SessionStore {
//     constructor() {
//       super();
//       this.sessions = new Map();
//     }
  
//     findSession(id) {
//       return this.sessions.get(id);
//     }
  
//     saveSession(id, session) {
//       this.sessions.set(id, session);
//     }
  
//     findAllSessions() {
//       return [...this.sessions.values()];
//     }
//   }