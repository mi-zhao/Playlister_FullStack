import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api, { updatePlaylistById } from '../api'
import AddSong_Transaction from '../transactions/AddSong_Transaction';
import DeleteSong_Transaction from '../transactions/DeleteSong_Transaction';
import EditSong_Transaction from '../transactions/EditSong_Transaction';
import MoveSong_Transaction from '../transactions/MoveSong_Transaction';
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_EDIT_SONG_ACTIVE: "SET_EDIT_SONG_ACTIVE"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        idToDelete: null,
        playlistName: "",
        currentSongIndex: ""
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    idToDelete: null,
                    playlistName: null,
                    currentSongIndex: null,
                    currentSongArtist: "",
                    currentSongTitle: "",
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs, 
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    idToDelete: null,
                    playlistName: null,
                    currentSongIndex: null,
                    currentSongArtist: "",
                    currentSongTitle: "",
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    idToDelete: null,
                    playlistName: null,
                    currentSongIndex: null,
                    currentSongArtist: "",
                    currentSongTitle: "",
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    idToDelete: null,
                    playlistName: null,
                    currentSongIndex: null,
                    currentSongArtist: "",
                    currentSongTitle: "",
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    idToDelete: payload._id,
                    playlistName: payload.name,
                    currentSongIndex: null,
                    currentSongArtist: "",
                    currentSongTitle: "",
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    idToDelete: null,
                    playlistName: null,
                    currentSongIndex: null,
                    currentSongArtist: "",
                    currentSongTitle: "",
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    idToDelete: null,
                    playlistName: null,
                    currentSongIndex: null,
                    currentSongArtist: "",
                    currentSongTitle: "",
                });
            }
            case GlobalStoreActionType.SET_EDIT_SONG_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    idToDelete: store.idToDelete,
                    playlistName: store.playlistName,
                    currentSongIndex: payload.index,
                    currentSongArtist: payload.artist,
                    currentSongTitle: payload.title,
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    store.createNewList = function () {
        async function asyncCreateNewList() {
            let newlist = {
                name: "Untitled",
                songs: []
            }
            let response = await api.createPlaylist(newlist);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: playlist
                });
                // Edit mode right after list is made:
                store.history.push("/playlist/" + playlist._id) // Changes browser/client URL (Ex. history.push(‘/‘) changes to https://localhost:3000/)
            }
        }
        asyncCreateNewList();
        tps.clearAllTransactions();
        store.checkUndoRedo();
    }

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        if (newName !== ""){
            // GET THE LIST
            async function asyncChangeListName(id) {
                let response = await api.getPlaylistById(id);
                if (response.data.success) {
                    let playlist = response.data.playlist;
                    playlist.name = newName;
                    console.log(response.data.idNamePairs)  // see if this changed:
                    async function updateList(playlist) {
                        response = await api.updatePlaylistById(playlist._id, playlist);
                        if (response.data.success) {
                            console.log(response.data)
                            async function getListPairs(playlist) {
                                response = await api.getPlaylistPairs();
                                if (response.data.success) {
                                    let pairsArray = response.data.idNamePairs;
                                    storeReducer({
                                        type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                        payload: {
                                            idNamePairs: pairsArray,
                                            playlist: playlist
                                        }
                                    });
                                }
                            }
                            getListPairs(playlist);
                        }
                    }
                    updateList(playlist);
                }
            }
            asyncChangeListName(id);
        }
    }

    store.setMarkedPlaylist = function (idNamePair) {
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: idNamePair
        })
        store.enableDeleteListModal();
    }

    store.callDeleteList = function () {
        store.hideDeleteListModal();
        store.deleteList(store.idToDelete);
    }

    store.deleteList = function (id) {
        async function asyncDeleteList(id) {
            let response = await api.deletePlaylistById(id)
            if (response.data.success) {
                store.loadIdNamePairs();    // Refresh playlist
                store.history.push("/")
            }
        }
        asyncDeleteList(id);
    }

    store.enableDeleteListModal = function () {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
    }

    store.hideDeleteListModal = function () {
        document.getElementById("delete-list-modal").classList.remove("is-visible");
        // store.checkUndoRedo();
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
        store.disableEditToolBarButtons();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
        tps.clearAllTransactions();
        store.checkUndoRedo();
    }

    store.moveSongTransaction = function (from, to) {
        let transaction = new MoveSong_Transaction(store, from ,to);
        tps.addTransaction(transaction);
        store.checkUndoRedo();
    }

    store.moveSong = function (from, to) {
        const fromSong = store.currentList.songs[from]
        const toSong = store.currentList.songs[to]

        const playlist = store.currentList
        playlist.songs[from] = toSong
        playlist.songs[to] = fromSong
    
        async function asyncMoveSong() {
            let response = await updatePlaylistById(store.currentList._id, playlist)
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                })
            }
        }
        asyncMoveSong();
    }

    store.addSongTransaction = function () {
        let transaction = new AddSong_Transaction(store, this.currentList.songs.length);
        tps.addTransaction(transaction);
        store.checkUndoRedo();
    }

    store.addSong = function (song) {
        const playlist = store.currentList;
        playlist.songs.push(song)
        async function asyncAddSong() {
            let response = await api.updatePlaylistById(store.currentList._id, playlist)
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                })
            } 
        }
        asyncAddSong();
    }

    store.deleteSongTransaction = function () {
        let transaction = new DeleteSong_Transaction(store, store.currentSongIndex)
        tps.addTransaction(transaction);
        store.checkUndoRedo();
    }

    store.deleteSong = function(index) {
        const playlist = store.currentList;
        playlist.songs.splice(index, 1);

        async function asyncDeleteSong() {
            let response = await api.updatePlaylistById(store.currentList._id, playlist)
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                })
                store.hideDeleteSongModal();
            }
        }
        asyncDeleteSong();
    }

    store.undoDeleteSong = function(index, song) {
        const playlist = store.currentList
        playlist.songs.splice(index, 0, song);

        async function asyncUndoDeleteSong() {
            let response = await api.updatePlaylistById(store.currentList._id, playlist)
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                })
            }
        }
        asyncUndoDeleteSong();
    }

    store.showDeleteSongModal = function(index) {
        let song = {
            index: index,
            title: store.currentList.songs[index].title,
            artist: store.currentList.songs[index].artist,
        }
        storeReducer({
            type: GlobalStoreActionType.SET_EDIT_SONG_ACTIVE,
            payload: song
        });
        document.getElementById("delete-song-modal").classList.add("is-visible");
        store.disableEditToolBarButtons();
    }

    store.hideDeleteSongModal = function () {
        document.getElementById("delete-song-modal").classList.remove("is-visible");
        store.checkUndoRedo();
    }

    store.editSongTransaction = function () {
        let playlist = store.currentList

        let originalsong = {
            id: playlist.songs[store.currentSongIndex]._id,
            title: playlist.songs[store.currentSongIndex].title,
            artist: playlist.songs[store.currentSongIndex].artist,
            youTubeId: playlist.songs[store.currentSongIndex].youTubeId,
        }

        let newsong = {
            id: playlist.songs[store.currentSongIndex]._id,
            title: document.getElementById("songtitle").value,
            artist: document.getElementById("songartist").value,
            youTubeId: document.getElementById("youtubeid").value,
        }

        let transaction = new EditSong_Transaction(store, store.currentSongIndex, originalsong, newsong);
        tps.addTransaction(transaction);
        store.checkUndoRedo();
    }

    store.editSong = function (index, title, artist, youtubeid) {
        const playlist = store.currentList
        playlist.songs[index].title = title
        playlist.songs[index].artist = artist
        playlist.songs[index].youTubeId = youtubeid

        console.log("playlist", playlist.songs[store.currentSongIndex])

        async function asyncEditSong() {
            let response = await api.updatePlaylistById(store.currentList._id, playlist)
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                })
                store.hideEditSongModal();
            }
        }
        asyncEditSong()
    }

    store.showEditSongModal = function (index) {
        let title = store.currentList.songs[index].title
        let artist = store.currentList.songs[index].artist
        let youTubeId = store.currentList.songs[index].youTubeId

        let song = {
            index: index,
            title: title,
            artist: artist,
        }
        storeReducer({
            type: GlobalStoreActionType.SET_EDIT_SONG_ACTIVE,
            payload: song
        });

        document.getElementById("songtitle").value = title;
        document.getElementById("songartist").value = artist;
        document.getElementById("youtubeid").value = youTubeId;
        document.getElementById("edit-song-modal").classList.add("is-visible");
        store.disableEditToolBarButtons();
    }

    store.hideEditSongModal = function () {
        document.getElementById("edit-song-modal").classList.remove("is-visible");
        store.checkUndoRedo();
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = () => {
        if (tps.hasTransactionToUndo()) {
            tps.undoTransaction();
        }
        store.checkUndoRedo();
    }
    // THIS FUNCTION BEGINS THE PROCESS OF PERFORMING A REDO
    store.redo = () => {
        if (tps.hasTransactionToRedo()) {
            tps.doTransaction();
        }
        store.checkUndoRedo();
    }

    store.checkUndoRedo = function () {
        document.getElementById("add-song-button").disabled = false;
        document.getElementById("close-button").disabled = false;

        let undoButton = document.getElementById("undo-button");
        let redoButton = document.getElementById("redo-button");

        if (tps.getUndoSize() === 0) {
            undoButton.disabled = true;
        }
        else {
            undoButton.disabled = false;
        }
        
        if (tps.getRedoSize() === 0) {
            redoButton.disabled = true
        }
        else {
            redoButton.disabled = false;
        }
    }

    store.disableEditToolBarButtons = function () {
        document.getElementById("undo-button").disabled = true;
        document.getElementById("redo-button").disabled = true;
        document.getElementById("close-button").disabled = true;
        document.getElementById("add-song-button").disabled = true;
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
        store.disableEditToolBarButtons();
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}