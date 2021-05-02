import React, {useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom'
import NavbarOptions from './navbar/NavbarOptions.js';
import UpdateAccount from './modals/Update.js';
import DelRegion from './modals/DelRegion.js';
import AddIcon from '@material-ui/icons/Add';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import CloseIcon from '@material-ui/icons/Close';
import { useMutation, useQuery } 		from '@apollo/client';
import { GET_DB_REGIONS, GET_MAP_BY_ID} 				from '../cache/queries';
import * as mutations 					from '../cache/mutations';

import '../css/regionspreadsheet.css';


const RegionSpreadsheet = (props) => {
    let history = useHistory();

    let actualRegion = '';
    let regionsList = []
    const [AddRegion] 			= useMutation(mutations.ADD_REGION);
    const [showUpdate, toggleShowUpdate] 		= useState(false);
    const [showDelete, toggleShowDelete] 		= useState(false);

    const [DeleteRegion] 			= useMutation(mutations.DELETE_REGION);
    const [deleteRegionId, setDeleteRegionId] = useState('')

    const { regionId } = useParams()

    const { loading:loading1, error:error1, data:data1, refetch:refetch1 } = useQuery(GET_MAP_BY_ID, {
        variables: {_id: regionId},
    });
    if(loading1) { console.log(loading1, 'loading'); }
	if(error1) { console.log(error1, 'error'); }
	if(data1) { 
        actualRegion = data1.getMapById; 
    }

    const { loading, error, data, refetch } = useQuery(GET_DB_REGIONS);
    if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
        regionsList = data.getAllRegions; 
        if (actualRegion === ''){
            actualRegion = regionsList.filter(region => {
                return region._id === regionId;
            });
        }
        regionsList = regionsList.filter(region => {
            return region.parentId === regionId;
        });   
    }
        

    const auth = props.user === null ? false : true;

    const refetchRegions = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			regionsList = data.getAllRegions;
		}
	}

    const setShowUpdate = () => {
        toggleShowDelete(false)
        toggleShowUpdate(!showUpdate)
    }

    const setShowDelete = () => {
        toggleShowUpdate(false)
        toggleShowDelete(!showDelete)
    }

    const addRegion = async () => {
		let lastID = 1;
		if (regionsList.length !== 0){
			for (let i = 0; i < regionsList.length; i++){
				if (regionsList[i].id >= lastID) lastID = regionsList[i].id + Math.round(Math.random(0, 100)) + 1;
			}
		}
		const newRegion = {
			_id: '',
			id: lastID,
            parentId: regionId,
			name: 'name',
            capital: 'capital',
            leader: 'leader',
            flag: 'flag',
            landmarks: [],
            regions: [],
		};
        const { data } = await AddRegion({ variables: { region: newRegion }, refetchQueries: [{ query: GET_DB_REGIONS }] });
        await refetchRegions(refetch);
    }

    const deleteRegion = async (_id) => {
        DeleteRegion({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_REGIONS }] });
		refetch();
    }

    return(
        <>
        <NavbarOptions
                fetchUser={props.fetchUser} auth={auth} user={props.user} setShowUpdate={setShowUpdate}
               />
        <div className="entireSpreadsheet">
            <div className="flexSpreadsheet">
                <AddIcon className="plusSpreadsheet" onClick={addRegion}></AddIcon>
                <UndoIcon className="undoArrowSpreadsheet"></UndoIcon>
                <RedoIcon className="redoArrowSpreadsheet"></RedoIcon>
                <div className="currentRegionSpreadsheet">Region Name: </div>
                <div className="currentRegionNameSpreadsheet">{actualRegion.name}</div>
            </div>
            <div className="spreadsheetOverall">
                <div className="headerSpreadsheet">
                    <div className="headerNameSpreadsheet">Name &#10225;</div>
                    <div className="headerCapitalSpreadsheet">Capital &#10225;</div>
                    <div className="headerLeaderSpreadsheet">Leader &#10225;</div>
                    <div className="headerFlagSpreadsheet">Flag &#10225;</div>
                    <div className="headerLandmarksSpreadsheet">Landmarks &#10225; </div>
                </div>
                <div className="itemsSpreadsheet">{
                    regionsList && regionsList.map(region => (
                        <div className="regionItemSpreadsheet">
                            <div className="regionItemCloseIconSpreadsheet" onClick={() => {
                                setDeleteRegionId(region._id)
                                toggleShowUpdate(false)
                                toggleShowDelete(!showDelete)
                            }}><CloseIcon className="regionItemCloseIconSpreadsheet1"></CloseIcon></div>
                            <div className="regionItemNameSpreadsheet" onClick={() => {
                                // history.push("/" + region._id)
                            }}>{region.name}</div>
                            <div className="regionItemCapitalSpreadsheet">{region.capital}</div>
                            <div className="regionItemLeaderSpreadsheet">{region.leader}</div>
                            <div className="regionItemFlagSpreadsheet">{region.flag}</div>
                            <div className="regionItemLandmarksSpreadsheet">{region.landmarks} asdf</div>
                        </div>
                        
                    ))
                }</div>
            </div>
           
        </div>
        {
            showUpdate && (<UpdateAccount fetchUser={props.fetchUser} user={props.user} setShowUpdate={setShowUpdate} />)
        }
        {
            showDelete && (<DelRegion deleteMap={deleteRegion} id={deleteRegionId} setShowDelete={setShowDelete} />)
        }
        </>
    )
}

export default RegionSpreadsheet;