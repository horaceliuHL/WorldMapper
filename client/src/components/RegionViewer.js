import React, {useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import NavbarOptions from './navbar/NavbarOptions.js';
import UpdateAccount from './modals/Update.js';
import AddIcon from '@material-ui/icons/Add';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import { useMutation, useQuery } 		from '@apollo/client';
import { GET_DB_REGIONS, GET_ALL_PARENT_REGIONS } 				from '../cache/queries';
import '../css/regionviewer.css';

const RegionViewer = (props) => {
    let history = useHistory();

    let currentRegion = {
        name: '',
        parentId: '',
        capital: '',
        leader: '',
        regions: [],
        landmarks: [],
    }
    let siblingRegions = []
    let parentRegions = []

    const { regionId } = useParams()

    const [showUpdate, toggleShowUpdate] 		= useState(false);

    const auth = props.user === null ? false : true;

    const { loading:loading2, error:error2, data:data2, refetch:refetch2 } = useQuery(GET_ALL_PARENT_REGIONS, {
        variables: {_id: regionId},
    });
    if(loading2) { console.log(loading2, 'loading'); }
	if(error2) { console.log(error2, 'error'); }
	if(data2) { 
        if (data2.getAllParentRegions) parentRegions = data2.getAllParentRegions; 
    }

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

    return (
        <>
        <NavbarOptions
                fetchUser={props.fetchUser} auth={auth} user={props.user} setShowUpdate={setShowUpdate}
        />
        <div className="navbarDirections">
            {
                parentRegions && parentRegions.map(x => (
                    <>
                    {
                        (x === parentRegions[parentRegions.length - 1]) ? <div></div>
                        : (x === parentRegions[0]) ? <div className="navbarClickDiv" onClick={() => history.push('/' + x._id)}>{x.name}</div> 
                        : <div className="navbarClickDiv" onClick={() => history.push('/' + x._id)}> &nbsp;-&gt; {x.name} </div>
                    }
                    </>
                ))
            }
        </div>
        <div className="flexContainerviewer">
            <div className="leftSideViewer">
                <div className="undoRedoViewer">
                    <UndoIcon className="undoArrowViewer"></UndoIcon>
                    <RedoIcon className="redoArrowViewer"></RedoIcon>
                </div>
                <img className="flagViewer"></img>
                {
                    parentRegions.length > 0 ? 
                    <div className="regionInfoViewer">
                        <div className="regionNameViewer">Region Name: {currentRegion.name}</div>
                        <div className="parentRegionViewer">Parent Region: &nbsp;<div className="clickParentViewer" onClick={() => history.push('/' + currentRegion.parentId)}>{parentRegions[parentRegions.length - 2].name}</div></div>
                        <div className="regionCapitalViewer">Region Capital: {currentRegion.capital}</div>
                        <div className="regionLeaderViewer">Region Leader: {currentRegion.leader}</div>
                        <div className="subregionsViewer"># of Sub Regions: {currentRegion.regions.length}</div>
                    </div> 
                    : <div></div>
                }
                
            </div>
            <div className="rightSideViewer">
                <div className="regionLandmarksHeader">Region Landmarks:</div>
                <div className="regionLandmarksBox">
                    <div className="regionLandmarksListViewer">
                        {
                            currentRegion && currentRegion.landmarks.map(x => (
                                <div>{x}</div>
                            ))
                        }
                    </div>
                    <div className="regionLandmarksAddViewer">
                        <AddIcon className="plusViewer"></AddIcon>
                        <input></input>
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

export default RegionViewer