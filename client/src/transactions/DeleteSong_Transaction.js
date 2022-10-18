import jsTPS_Transaction from "../common/jsTPS.js"

export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, index) {
        super();
        this.store = initStore;
        this.index = index
        this.deletedSong = {
            id: this.store.currentList.songs[index]._id,
            title: this.store.currentList.songs[index].title,
            artist: this.store.currentList.songs[index].artist,
            youTubeId: this.store.currentList.songs[index].youTubeId
        }
    }

    doTransaction() {
        this.store.deleteSong(this.index);
    }
    
    undoTransaction() {
        this.store.undoDeleteSong(this.index, this.deletedSong);
    }
}