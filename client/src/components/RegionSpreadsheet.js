import React, {useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom'
import NavbarOptions from './navbar/NavbarOptions.js';
import UpdateAccount from './modals/Update.js';
import DelRegion from './modals/DelRegion.js';
import AddIcon from '@material-ui/icons/Add';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import { useMutation, useQuery } 		from '@apollo/client';
import { GET_DB_REGIONS, GET_MAP_BY_ID, GET_ALL_PARENT_REGIONS, GET_CHILDREN_REGIONS} 				from '../cache/queries';
import * as mutations 					from '../cache/mutations';
import { 
	AddRegion_Transaction, 
    DeleteRegion_Transaction,
    EditItem_Transaction,
    ReorderTasks_Transaction,
  jsTPS} 				from '../utils/jsTPS';

import '../css/regionspreadsheet.css';
import SpreadsheetItems from './SpreadsheetItems.js';


const RegionSpreadsheet = (props) => {
    let history = useHistory();

    let actualRegion = {};
    actualRegion.name = '';
    let regionsList = []
    let parentRegions = []
    const [AddRegion] 			= useMutation(mutations.ADD_REGION);
    const [showUpdate, toggleShowUpdate] 		= useState(false);
    const [showDelete, toggleShowDelete] 		= useState(false);

    const [DeleteRegion] 			= useMutation(mutations.DELETE_REGION);
    const [deleteRegionId, setDeleteRegionId] = useState('')

    const [arrowH, setArrowH] = useState(-1);
    const [arrowV, setArrowV] = useState(-1);

    const [hasTransUndo, showHasTransUndo] = useState(false)
    const [hasTransRedo, showHasTransRedo] = useState(false)

    const [EditRegion] = useMutation(mutations.EDIT_REGION)
    const [SortName] = useMutation(mutations.SORT_NAME)
    const [UnsortName] = useMutation(mutations.UNSORT_NAME)
    const [SortCapital] = useMutation(mutations.SORT_CAPITAL)
    const [UnsortCapital] = useMutation(mutations.UNSORT_CAPITAL)
    const [SortLeader] = useMutation(mutations.SORT_LEADER)
    const [UnsortLeader] = useMutation(mutations.UNSORT_LEADER)


    const { regionId } = useParams()

    const { loading:loading1, error:error1, data:data1, refetch:refetch1 } = useQuery(GET_MAP_BY_ID, {
        variables: {_id: regionId},
    });
    // if(loading1) { console.log(loading1, 'loading'); }
	if(error1) { console.log(error1, 'error'); }
	if(data1) { 
        if (data1.getMapById) actualRegion = data1.getMapById; 
    }

    const { loading:loading2, error:error2, data:data2, refetch:refetch2 } = useQuery(GET_ALL_PARENT_REGIONS, {
        variables: {_id: regionId},
    });
    // if(loading2) { console.log(loading2, 'loading'); }
	if(error2) { console.log(error2, 'error'); }
	if(data2) { 
        if (data2.getAllParentRegions) parentRegions = data2.getAllParentRegions; 
    }

    const { loading:loading3, error:error3, data:data3, refetch:refetch3} = useQuery(GET_DB_REGIONS);
    // if(loading3) { console.log(loading3, 'loading'); }
	if(error3) { console.log(error3, 'error'); }
	if(data3) { 
        let tempList = data3.getAllRegions; 
        if (actualRegion.name === ''){
            actualRegion = tempList.find(region => region._id === regionId)
        }  
    }

    const { loading, error, data, refetch  } = useQuery(GET_CHILDREN_REGIONS, {
        variables: {_id: regionId},
    });
    // if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
        regionsList = data.getAllChildrenRegions; 
    }

    const auth = props.user === null ? false : true;

    const refetchRegions = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			regionsList = data.getAllChildrenRegions;
		}
	}

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

    const changing = (vertical, horizontal) => {
        if (vertical >= 0 && vertical < regionsList.length) setArrowV(vertical);
        if (horizontal >= 1 && horizontal <= 3) setArrowH(horizontal);
        if (vertical === -2) setArrowV(vertical)
        if (horizontal === -2) setArrowH(horizontal)
    }

    const setShowUpdate = () => {
        toggleShowDelete(false)
        toggleShowUpdate(!showUpdate)
    }

    const setShowDelete = () => {
        toggleShowUpdate(false)
        toggleShowDelete(!showDelete)
    }
    
    const setShowDelete1 = (_id) => {
        setDeleteRegionId(_id)
        toggleShowUpdate(false)
        toggleShowDelete(!showDelete)
    }

    const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
        const hasUndoVal = await props.tps.hasTransactionToUndo();
        const hasRedoVal = await props.tps.hasTransactionToRedo();
        showHasTransUndo(hasUndoVal);
        showHasTransRedo(hasRedoVal)
		refetchRegions(refetch);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
        const hasUndoVal = await props.tps.hasTransactionToUndo();
        const hasRedoVal = await props.tps.hasTransactionToRedo();
        showHasTransUndo(hasUndoVal);
        showHasTransRedo(hasRedoVal)
		refetchRegions(refetch);
		return retVal;
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
        let transaction = new AddRegion_Transaction(newRegion.id, newRegion, AddRegion, DeleteRegion);
		props.tps.addTransaction(transaction);
		tpsRedo();
    }

    const deleteRegion = async (_id) => {
        let transaction = new DeleteRegion_Transaction(_id, {}, AddRegion, DeleteRegion);
		props.tps.addTransaction(transaction);
		tpsRedo();
    }

    const editStuff = (id, field, old, updated) => {
        let transaction = new EditItem_Transaction(id, field, old, updated, EditRegion);
        props.tps.addTransaction(transaction);
        tpsRedo();
    }

    const reorderName = () => {
        let items = []
        for (let i = 0; i < regionsList.length; i++){
            items[i] = regionsList[i]._id
        }
        let transaction = new ReorderTasks_Transaction(regionId, items, SortName, UnsortName);
        props.tps.addTransaction(transaction);
        tpsRedo();
    }

    const reorderCapital = () => {
        let items = []
        for (let i = 0; i < regionsList.length; i++){
            items[i] = regionsList[i]._id
        }
        let transaction = new ReorderTasks_Transaction(regionId, items, SortCapital, UnsortCapital);
        props.tps.addTransaction(transaction);
        tpsRedo();
    }

    const reorderLeader = () => {
        let items = []
        for (let i = 0; i < regionsList.length; i++){
            items[i] = regionsList[i]._id
        }
        let transaction = new ReorderTasks_Transaction(regionId, items, SortLeader, UnsortLeader);
        props.tps.addTransaction(transaction);
        tpsRedo();
    }

    return(
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
                        : (x === parentRegions[0]) ? <div className="navbarClickDiv" onClick={() => {
                            props.tps.clearAllTransactions();
                            history.push('/' + x._id);
                            }}>{x.name}</div> 
                        : <div className="navbarClickDiv" onClick={() => {
                            props.tps.clearAllTransactions();
                            history.push('/' + x._id);
                            }}> &nbsp;-&gt; {x.name} </div>
                    }
                    </>
                ))
            }
        </div>
        <div className="entireSpreadsheet">
            <div className="flexSpreadsheet">
                <AddIcon className="plusSpreadsheet" onClick={addRegion}></AddIcon>
                {
                    hasTransUndo ? <UndoIcon className="undoArrowSpreadsheet" onClick={tpsUndo}></UndoIcon>
                    : <div className="undoArrowSpreadsheetStandin"></div>
                }
                {
                    hasTransRedo ? <RedoIcon className="redoArrowSpreadsheet" onClick={tpsRedo}></RedoIcon>
                    : <div className="redoArrowSpreadsheetStandin"></div>
                }
                <div className="currentRegionSpreadsheet">Region Name: </div>
                {
                    actualRegion ? <div className="currentRegionNameSpreadsheet">{actualRegion.name}</div>
                    : <div className="currentRegionNameSpreadsheet"> </div>
                }
                
            </div>
            <div className="spreadsheetOverall">
                <div className="headerSpreadsheet">
                    <div className="headerNameSpreadsheet" onClick={reorderName}>Name &#10225;</div>
                    <div className="headerCapitalSpreadsheet" onClick={reorderCapital}>Capital &#10225;</div>
                    <div className="headerLeaderSpreadsheet" onClick={reorderLeader}>Leader &#10225;</div>
                    <div className="headerFlagSpreadsheet">Flag &#10225;</div>
                    <div className="headerLandmarksSpreadsheet">Landmarks &#10225;</div>
                </div>
                <div className="itemsSpreadsheet">{
                    regionsList.length !== 0 && regionsList.map((region, index) => (
                        <SpreadsheetItems region={region} setShowDelete1={setShowDelete1} editStuff={editStuff} index={index}
                            changing={changing} arrowV={arrowV} arrowH={arrowH} clearAll={() => props.tps.clearAllTransactions()}
                        />    
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