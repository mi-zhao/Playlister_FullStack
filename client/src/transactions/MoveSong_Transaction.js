import jsTPS_Transaction from "../common/jsTPS.js"

export default class MoveSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, from, to) {
        super();
        this.store = initStore;
        this.from = from
        this.to = to
    }

    doTransaction() {
        this.store.moveSong(this.from, this.to);
    }
    
    undoTransaction() {
        this.store.moveSong(this.to, this.from);
    }
}