import React, {useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import NavbarOptions from './navbar/NavbarOptions.js';
import UpdateAccount from './modals/Update.js';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import { useMutation, useQuery } 		from '@apollo/client';
import { GET_DB_REGIONS } 				from '../cache/queries';
import '../css/regionviewer.css';

const RegionViewer = (props) => {
    let history = useHistory();

    let currentRegion = {
        name: '',
        parentId: '',
        capital: '',
        leader: '',
        regions: [],
    }
    let siblingRegions = []

    const { regionId } = useParams()

    const [showUpdate, toggleShowUpdate] 		= useState(false);

    const auth = props.user === null ? false : true;

    const { loading, error, data, refetch } = useQuery(GET_DB_REGIONS);
    if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
        siblingRegions = data.getAllRegions; 
        currentRegion = siblingRegions.find(region => region._id === regionId)
        siblingRegions = siblingRegions.filter(region => {
            return region.parentId === currentRegion.parentId;
        });   
    }

    const refetchRegions = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			siblingRegions = data.getAllRegions;
            siblingRegions = siblingRegions.filter(region => {
                return region.parentId === currentRegion.parentId;
            });
		}
	}

    const setShowUpdate = () => {
        toggleShowUpdate(!showUpdate)
    }

    console.log(currentRegion)
    console.log(currentRegion.regions.length)

    return (
        <>
        <NavbarOptions
                fetchUser={props.fetchUser} auth={auth} user={props.user} setShowUpdate={setShowUpdate}
        />
        <div className="flexContainerviewer">
            <div className="leftSideViewer">
                <UndoIcon className="undoArrowViewer"></UndoIcon>
                <RedoIcon className="redoArrowViewer"></RedoIcon>
                <img className="flagViewer"></img>
                <div className="regionInfoViewer">
                    <div className="regionNameViewer">Region Name: {currentRegion.name}</div>
                    <div className="parentRegionViewer">Parent Region: {currentRegion.parentId}</div>
                    <div className="regionCapitalViewer">Region Capital: {currentRegion.capital}</div>
                    <div className="regionLeaderViewer">Region Leader: {currentRegion.leader}</div>
                    <div className="subregionsViewer"># of Sub Regions: {currentRegion.regions.length}</div>
                </div>
            </div>
            <div className="rightSideViewer">
                <div className="regionLandmarksHeader">Region Landmarks</div>
                <div className="regionLandmarksBox">entire box lmaoo</div>
            </div>
        </div>
        {
            showUpdate && (<UpdateAccount fetchUser={props.fetchUser} user={props.user} setShowUpdate={setShowUpdate} />)
        }
        </>
    )

}

export default RegionViewer