import { useContext } from 'react'
import { GlobalStoreContext} from '../store'

function EditSongModal() {
    const { store } = useContext(GlobalStoreContext);

    function updateSongContent() {
        store.editSongTransaction();
    }

    function hideEditSongModal() {
        store.hideEditSongModal();
    }

    return (
        <div className="modal" id="edit-song-modal" data-animation="slideInOutLeft">
            <div className="modal-dialog">
                <div className="edit-dialog-header">
                    Title<input type="text" id="songtitle"></input>
                    Artist<input type="text" id="songartist"></input>
                    YouTube ID<input type="text" id="youtubeid"></input>
                </div>
                <div className="confirm-cancel-container">
                    <input type="button" id="edit-confirm" className="confirm-cancel-button" value="Confirm" onClick={updateSongContent}></input>
                    <input type="button" id="edit-cancel" className="confirm-cancel-button" value="Cancel" onClick={hideEditSongModal}></input>
                </div>
            </div>
        </div>
    );
}

export default EditSongModal;