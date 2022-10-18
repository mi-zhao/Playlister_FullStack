import { useContext } from 'react'
import { GlobalStoreContext} from '../store'

function DeleteSongModal() {
    const { store } = useContext(GlobalStoreContext);

    function confirmDeleteSong() {
        store.deleteSongTransaction(store.currentSongIndex);
    }

    function hideDeleteSongModal() {
        store.hideDeleteSongModal();
    }

    return (
        <div className="modal" id="delete-song-modal" data-animation="slideInOutLeft">
            <div className="modal-dialog">
                <div className="modal-north">
                    Delete Song?
                </div>
                <div className="dialog-header">
                    Do you wish to permanently delete the song {store.currentSongTitle} by {store.currentSongArtist}?
                </div>
                <div className="confirm-cancel-container">
                    <input type="button" id="delete-confirm" className="confirm-cancel-button" onClick={confirmDeleteSong} value="Confirm"></input>
                    <input type="button" id="delete-cancel" className="confirm-cancel-button" onClick={hideDeleteSongModal} value="Cancel"></input>
                </div>
            </div>
        </div>
    );
}

export default DeleteSongModal;