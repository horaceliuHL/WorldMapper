import React, {useState} from 'react';
import NavbarOptions from './navbar/NavbarOptions.js';
import UpdateAccount from './modals/Update.js';


const Mapscreen = (props) => {
    const [showUpdate, toggleShowUpdate] 		= useState(false);
    const auth = props.user === null ? false : true;

    const setShowUpdate = () => {
        toggleShowUpdate(!showUpdate)
    }

    return(
        <>
        <NavbarOptions
                fetchUser={props.fetchUser} auth={auth} name={props.user.name} setShowUpdate={setShowUpdate}
               />
        <div>
            hello world
        </div>
        {
            showUpdate && (<UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} />)
        }
        </>
    )
}

export default Mapscreen;