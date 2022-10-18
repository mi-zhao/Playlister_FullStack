import jsTPS_Transaction from "../common/jsTPS.js"

export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, index, originalsong, newsong) {
        super();
        this.store = initStore;
        this.index = index
        this.originalsong = originalsong
        this.newsong = newsong
    }

    doTransaction() {
        this.store.editSong(this.index, this.newsong.title, this.newsong.artist, this.newsong.youTubeId);
    }
    
    undoTransaction() {
        this.store.editSong(this.index, this.originalsong.title, this.originalsong.artist, this.originalsong.youTubeId);
    }
}