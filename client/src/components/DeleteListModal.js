import { useContext } from 'react'
import { GlobalStoreContext} from '../store'

function DeleteListModal() {
    const { store } = useContext(GlobalStoreContext);

    function confirmDeleteList() {
        store.callDeleteList();
    }

    function hideDeleteListModal() {
        store.hideDeleteListModal();
    }

    return (
        <div className="modal" id="delete-list-modal" data-animation="slideInOutLeft">
            <div className="modal-dialog">
                <div className="dialog-header">
                    Do you wish to permanently delete the {store.playlistName} playlist?
                </div>
                <div className="confirm-cancel-container">
                    <input type="button" id="delete-confirm" className="confirm-cancel-button" onClick={confirmDeleteList} value="Confirm"></input>
                    <input type="button" id="delete-cancel" className="confirm-cancel-button" onClick={hideDeleteListModal} value="Cancel"></input>
                </div>
            </div>
        </div>
    );
}

export default DeleteListModal;