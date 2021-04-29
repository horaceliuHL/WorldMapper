import React, {useState} from 'react';
import NavbarOptions from './navbar/NavbarOptions.js';
import UpdateAccount from './modals/Update.js';
import '../css/mapscreen.css';


const Mapscreen = (props) => {
    const [showUpdate, toggleShowUpdate] 		= useState(false);
    const auth = props.user === null ? false : true;

    const setShowUpdate = () => {
        toggleShowUpdate(!showUpdate)
    }

    const createNewMap = (props) => {
        console.log("Map created!")
    }

    return(
        <>
        <NavbarOptions
                fetchUser={props.fetchUser} auth={auth} user={props.user} setShowUpdate={setShowUpdate}
               />
        <div className="mapbloc">
            <div className="mapheader">
                Your Maps
            </div>
            <div className="flex">
                <div className="actualMaps">
                Maps
                </div>
                <div className="pictures">
                    <img></img>
                    <div className="createMap" onClick={createNewMap}>
                        Create New Map
                    </div>
                </div>
            </div>
        </div>
        {
            showUpdate && (<UpdateAccount fetchUser={props.fetchUser} user={props.user} setShowUpdate={setShowUpdate} />)
        }
        </>
    )
}

export default Mapscreen;