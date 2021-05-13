import React, {useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import NavbarOptions from './navbar/NavbarOptions.js';
import UpdateAccount from './modals/Update.js';
import AddIcon from '@material-ui/icons/Add';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CreateIcon from '@material-ui/icons/Create';
import { useMutation, useQuery } 		from '@apollo/client';
import { GET_DB_REGIONS, GET_ALL_PARENT_REGIONS, GET_DB_MAPS, GET_ALL_LANDMARKS } 				from '../cache/queries';
import * as mutations 					from '../cache/mutations';
import { 
	SwitchParents_Transaction,
    AddLandmark_Transaction,
    DeleteLandmark_Transaction,
    EditLandmark_Transaction,
  jsTPS} 				from '../utils/jsTPS';
import LandmarkItems from './LandmarkItems.js';
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
    let allRegions = []
    let allMaps = []
    let allPossibleChangeParents = []
    let allLandmarks = []

    const { regionId } = useParams()

    const [SwitchParents] = useMutation(mutations.SWITCH_PARENTS)
    const [AddLandmark] = useMutation(mutations.ADD_LANDMARK)
    const [DeleteLandmark] = useMutation(mutations.DELETE_LANDMARK)
    const [EditLandmark] = useMutation(mutations.EDIT_LANDMARK)

    const [showUpdate, toggleShowUpdate] 		= useState(false);
    const [showEditingParent, setShowEditingParent] = useState(false);

    const [hasTransUndo, showHasTransUndo] = useState(false)
    const [hasTransRedo, showHasTransRedo] = useState(false)

    const [editLandmark, setEditLandmark] = useState('')

    const [flagPath, setFlagPath] = useState(false)
    const [actualPath, setActualPath] = useState()

    const auth = props.user === null ? false : true;

    const { loading:loading1, error:error1, data:data1, refetch:refetch1 } = useQuery(GET_DB_MAPS);
	// if(loading1) { console.log(loading1, 'loading'); }
	if(error1) { console.log(error1, 'error'); }
	if(data1) { allMaps = data1.getAllMaps; }

    const { loading:loading2, error:error2, data:data2, refetch:refetch2 } = useQuery(GET_ALL_PARENT_REGIONS, {
        variables: {_id: regionId},
    });
    // if(loading2) { console.log(loading2, 'loading'); }
	if(error2) { console.log(error2, 'error'); }
	if(data2) { 
        if (data2.getAllParentRegions) parentRegions = data2.getAllParentRegions; 
    }

    const { loading:loading3, error:error3, data:data3, refetch:refetch3 } = useQuery(GET_ALL_LANDMARKS, {
        variables: {_id: regionId},
    });
	if(error3) { console.log(error3, 'error'); }
	if(data3) { 
        if (data3.getAllLandmarks){
            let tempLandmarks = data3.getAllLandmarks; 
            allLandmarks = tempLandmarks.slice()
            allLandmarks.sort((a, b) => {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            })
        }
    }

    const { loading, error, data, refetch } = useQuery(GET_DB_REGIONS);
    // if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
        allRegions = data.getAllRegions;
        siblingRegions = data.getAllRegions; 
        currentRegion = siblingRegions.find(region => region._id === regionId)
        if (currentRegion !== undefined){
            siblingRegions = siblingRegions.filter(region => {
                return region.parentId === currentRegion.parentId;
            });   
        }
    }

    useEffect(() => {
        try{
            let flagPath = '';
            for (let i = 0; i < parentRegions.length; i++){
                flagPath += parentRegions[i].name + '/';
            }
            var image = new Image();
            var url_image = flagPath.substring(0, flagPath.length - 1) +  ' Flag.png';
            console.log(url_image)
            image.src = require(`../${url_image}`)
            console.log(url_image)
            setFlagPath(true)
            setActualPath(image.src)
        } catch (e) {
            setFlagPath(false)
        }
    })

    useEffect(() => {
        window.addEventListener('keydown', handlePressed);
        return () => {
            window.removeEventListener('keydown', handlePressed);
        }
    })

    useEffect(() => {
        props.tps.clearAllTransactions();
    }, [])
    
    const handlePressed = (e) => {
        if(e.key === 'z' && e.ctrlKey === true){
            tpsUndo()
        } 
        else if(e.key === 'y' && e.ctrlKey === true){
            tpsRedo()
        }
    }

    const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
        const hasUndoVal = await props.tps.hasTransactionToUndo();
        const hasRedoVal = await props.tps.hasTransactionToRedo();
        showHasTransUndo(hasUndoVal);
        showHasTransRedo(hasRedoVal)
		refetchRegions(refetch);
        refetchParentRegions(refetch2);
        refetchLandmarks(refetch3);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
        const hasUndoVal = await props.tps.hasTransactionToUndo();
        const hasRedoVal = await props.tps.hasTransactionToRedo();
        showHasTransUndo(hasUndoVal);
        showHasTransRedo(hasRedoVal)
		refetchRegions(refetch);
        refetchParentRegions(refetch2);
        refetchLandmarks(refetch3);
		return retVal;
	}

    const refetchRegions = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			allRegions = data.getAllRegions;
            siblingRegions = data.getAllRegions; 
            currentRegion = siblingRegions.find(region => region._id === regionId)
            if (currentRegion !== undefined){
                siblingRegions = siblingRegions.filter(region => {
                    return region.parentId === currentRegion.parentId;
                });   
            }
		}
	}

    const refetchParentRegions = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data2.getAllParentRegions) parentRegions = data2.getAllParentRegions; 
	}

    const refetchLandmarks = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data3.getAllLandmarks){
            let tempLandmarks = data3.getAllLandmarks; 
            allLandmarks = tempLandmarks.slice()
            allLandmarks.sort((a, b) => {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            })
        }
	}


    const findPossibleParents = async () => {
        let counter = 0;
        if (currentRegion === undefined) return
        let tempRegion = currentRegion;
        while (counter <= 20){
            let tempHello = allRegions.filter(region => {
                return region._id === tempRegion.parentId
            })
            if (tempHello.length === 0){
                tempHello = allMaps.filter(region => {
                    return region._id === tempRegion.parentId
                })
                tempRegion = tempHello[0]
                break;
            } else {
                tempRegion = tempHello[0]
                counter += 1;
            }
        }
        if (tempRegion !== undefined){
            let tempIndex = allMaps.indexOf(tempRegion)
            allPossibleChangeParents.push(allMaps[tempIndex])
            let tempStorage =  allMaps[tempIndex].regions
            let tempStorage1 = []
            for (let i = 0; i < counter; i++){
                for (let j = 0; j < tempStorage.length; j++){
                    let findRegion =  allRegions.filter(region => {
                        return region._id === tempStorage[j]
                    })
                    allPossibleChangeParents.push(findRegion[0])
                    let findIndex =  allRegions.indexOf(findRegion[0])
                    tempStorage1 = tempStorage1.concat(allRegions[findIndex].regions)
                }
                tempStorage = tempStorage1
                tempStorage1 = []
            }
        }
    }
    findPossibleParents()

    const setShowUpdate = () => {
        toggleShowUpdate(!showUpdate)
    }

    const navToPrevSibling = () => {
        let tempIndex = siblingRegions.indexOf(currentRegion)
        if (tempIndex > 0) history.push("/viewer/" + siblingRegions[tempIndex - 1]._id)
    }

    const navToNextSibling = () => {
        let tempIndex = siblingRegions.indexOf(currentRegion)
        if (tempIndex < siblingRegions.length - 1) history.push("/viewer/" + siblingRegions[tempIndex + 1]._id)
    }

    const handleChangeParent = (e) => {
        setShowEditingParent(false)
        let transaction = new SwitchParents_Transaction(currentRegion._id, currentRegion.parentId, e.target.value, SwitchParents);
        props.tps.addTransaction(transaction);
        tpsRedo();
    }

    const addNewLandmark = () => {
        if (editLandmark !== ''){
            let temp = editLandmark + ' - ' + currentRegion.name
            if (allLandmarks.indexOf(temp) === -1){
                let transaction = new AddLandmark_Transaction(currentRegion._id, editLandmark, AddLandmark, DeleteLandmark);
                props.tps.addTransaction(transaction);
                tpsRedo();
                setEditLandmark('');
            }
        }
    }

    const handleDeleteLandmark = (name) => {
        let transaction = new DeleteLandmark_Transaction(currentRegion._id, name, AddLandmark, DeleteLandmark);
        props.tps.addTransaction(transaction);
        tpsRedo();
    }

    const handleChangeLandmark = (name, newName) => {
        let transaction = new EditLandmark_Transaction(currentRegion._id, name, newName, EditLandmark);
        props.tps.addTransaction(transaction);
        tpsRedo();
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
        <div className="navSiblings">
            <ArrowBackIcon className="prevSibling" onClick={navToPrevSibling}/>
            <ArrowForwardIcon className="nextSibling" onClick={navToNextSibling}/>
        </div>
        <div className="flexContainerviewer">
            <div className="leftSideViewer">
                <div className="undoRedoViewer"> 
                {
                    hasTransUndo ? <UndoIcon className="undoArrowViewer" onClick={tpsUndo}></UndoIcon>
                    : <div></div>
                }
                {
                    hasTransRedo ? <RedoIcon className="redoArrowViewer" onClick={tpsRedo}></RedoIcon>
                    : <div></div>
                }
                </div>
                <img className="flagViewer" src={actualPath}></img>
                {
                    (parentRegions.length > 0 && currentRegion) ? 
                    <div className="regionInfoViewer">
                        <div className="regionNameViewer">Region Name: {currentRegion.name}</div>
                        <div className="parentRegionViewer">Parent Region: &nbsp;
                            <div className="clickParentViewer" onClick={() => history.push('/' + currentRegion.parentId)}>{parentRegions[parentRegions.length - 2].name}</div>
                            {
                                showEditingParent ? <select className="editingParentRegionViewer" onBlur={handleChangeParent} defaultValue={currentRegion.parentId} autoFocus>
                                    {
                                        allPossibleChangeParents && allPossibleChangeParents.map(item => (
                                            <option value={item._id}>{item.name}</option>
                                        ))
                                    }
                                </select>
                                : <CreateIcon className="editParentRegionViewer" onClick={() => setShowEditingParent(true)}/>
                            }
                        </div>
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
                            allLandmarks && allLandmarks.map(x => (
                                <LandmarkItems x={x} currentRegion={currentRegion} delLand={handleDeleteLandmark} editLand={handleChangeLandmark} flagPath={flagPath}/>
                            ))
                        }
                    </div>
                    <div className="regionLandmarksAddViewer">
                        <AddIcon className="plusViewer" onClick={addNewLandmark}></AddIcon>
                        <input className="regionLandmarksEdit" onChange={(e) => setEditLandmark(e.target.value)} defaultValue={editLandmark}></input>
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