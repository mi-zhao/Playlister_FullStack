import jsTPS_Transaction from "../common/jsTPS.js"

export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, index) {
        super();
        this.store = initStore;
        this.songIndex = index 
        this.song = {
            artist: "Untitled",
            title: "Unknown",
            youTubeId: "EpX1_YJPGAY"
        }
    }

    doTransaction() {
        this.store.addSong(this.song);
    }
    
    undoTransaction() {
        this.store.deleteSong(this.songIndex);
    }
}