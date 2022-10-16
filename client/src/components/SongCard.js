import React, { useContext, useState } from 'react'
import { GlobalStoreActionType, GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";

    const state = {
        dragfrom: "",
        dragto: ""
    }

    function handleDeleteSong() {
        store.showDeleteSongModal(index);
    }

    function handleDoubleClick() {
        store.showEditSongModal(index);
    }

    function handleDragStart(event) {
        // Started dragging
        event.dataTransfer.setData("song", event.target.id);
    }

    function handleDragOver(event) {
        // Dragging over song
        event.preventDefault();
    }

    function handleDragLeave(event) {
        // Leaving song
        event.preventDefault();
        
    }

    function handleDragEnd(event) {
        // Dropped dragging
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1, target.id.indexOf("-") + 2);
        let sourceId = event.dataTransfer.getData("song");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1, target.id.indexOf("-") + 2);

        store.moveSong(sourceId, targetId);
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDoubleClick={handleDoubleClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable={true}
        >
            {index + 1}.{" "}
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                onClick={handleDeleteSong}
                value={"\u2715"}
            />
        </div>
    );
}

export default SongCard;