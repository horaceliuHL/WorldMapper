import React, {useState} from 'react';
import {useParams} from 'react-router-dom'
import NavbarOptions from './navbar/NavbarOptions.js';
import UpdateAccount from './modals/Update.js';
import '../css/regionspreadsheet.css';


const RegionSpreadsheet = (props) => {
    const [showUpdate, toggleShowUpdate] 		= useState(false);

    const { regionId } = useParams()

    const auth = props.user === null ? false : true;

    const setShowUpdate = () => {
        toggleShowUpdate(!showUpdate)
    }

    console.log(regionId)

    return(
        <>
        <NavbarOptions
                fetchUser={props.fetchUser} auth={auth} user={props.user} setShowUpdate={setShowUpdate}
               />
        <div className="entireSpreadsheet">
            <div className="flexSpreadsheet">
                <div className="plusSpreadsheet">Plus</div>
                <div className="undoArrowSpreadsheet">Arrow</div>
                <div className="redoArrowSpreadsheet">Arrow</div>
                <div className="currentRegionSpreadsheet">Region Name</div>
            </div>
            <div className="spreadsheetOverall">
                <div className="headerSpreadsheet">
                    <div className="headerNameSpreadsheet">Name</div>
                    <div className="headerCapitalSpreadsheet">Capital</div>
                    <div className="headerLeaderSpreadsheet">Leader</div>
                    <div className="headerFlagSpreadsheet">Flag</div>
                    <div className="headerLandmarksSpreadsheet">Landmarks</div>
                </div>
                <div className="itemsSpreadsheet"></div>
            </div>
           
        </div>
        {
            showUpdate && (<UpdateAccount fetchUser={props.fetchUser} user={props.user} setShowUpdate={setShowUpdate} />)
        }
        </>
    )
}

export default RegionSpreadsheet;