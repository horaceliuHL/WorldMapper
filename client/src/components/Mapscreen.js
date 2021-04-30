import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import NavbarOptions from './navbar/NavbarOptions.js';
import UpdateAccount from './modals/Update.js';
import Delete from './modals/Delete.js';
import Del from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import '../css/mapscreen.css';
import { useMutation, useQuery } 		from '@apollo/client';
import { GET_DB_MAPS } 				from '../cache/queries';
import * as mutations 					from '../cache/mutations';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput } from 'wt-frontend';


const Mapscreen = (props) => {
    let history = useHistory();
    let mapsList = [];
    const [showUpdate, toggleShowUpdate] 		= useState(false);
    const [showDelete, toggleShowDelete] 		= useState(false);
    const [showCreateMap, toggleShowCreateMap] = useState(false);
    const [showEdit, toggleShowEdit] = useState(false)
    const [delMapId, setDelMapId] = useState('')
    const [editMapName, setEditMapName] = useState('')
    const [activeMap, setActiveMap] 		= useState({});
    const [AddMap] 			= useMutation(mutations.ADD_MAP);
    const [DeleteMap] 			= useMutation(mutations.DELETE_MAP);
    const [UpdateMapField] = useMutation(mutations.UPDATE_MAP_FIELD)
    const [newMapName, setNewMapName] = useState('')

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { mapsList = data.getAllMaps; }

    const auth = props.user === null ? false : true;

    const refetchMaps = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			mapsList = data.getAllMaps;
			if (activeMap._id) {
				let tempID = activeMap._id;
				let list = mapsList.find(list => list._id === tempID);
				setActiveMap(list);
			}
		}
	}


    const setShowUpdate = () => {
        toggleShowCreateMap(false)
        toggleShowDelete(false)
        toggleShowEdit(false)
        toggleShowUpdate(!showUpdate)
    }
    const setShowDelete = () => {
        toggleShowCreateMap(false)
        toggleShowUpdate(false)
        toggleShowEdit(false)
        toggleShowDelete(!showDelete)
    }
    const setShowCreateMap = () => {
        toggleShowUpdate(false)
        toggleShowDelete(false)
        toggleShowEdit(false)
        toggleShowCreateMap(!showCreateMap)
    }
    const setShowEdit = () => {
        toggleShowUpdate(false)
        toggleShowDelete(false)
        toggleShowEdit(!showEdit)
        toggleShowCreateMap(false)
    }

    const createNewMap = async () => {
        const toDoLen = mapsList.length
        let id = 1;
        if (toDoLen !== 0){
            for (let i = 0; i < toDoLen; i++){
                if (mapsList[i].id >= id) id = mapsList[i].id + Math.round(Math.random(0, 100)) + 1;
            }
        }
        let tempName = newMapName
        if (newMapName === '') tempName = 'Untitled'
        let list = {
            _id: '',
            id: id,
            name: tempName,
            owner: props.user._id,
            regions: [],
        }
        const { data } = await AddMap({ variables: { map: list }, refetchQueries: [{ query: GET_DB_MAPS }] });
        await refetchMaps(refetch);
        toggleShowCreateMap(false)
        if (data){
            let _id = data.addMap;
		    // setActiveMap(list)
        }
    }

    const deleteMap = async (_id) => {
        console.log(_id)
        DeleteMap({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_MAPS }] });
		refetch();
    }

    const updateMapName = (e) => {
		const { name, value } = e.target;
		setNewMapName(value);
	}

    const updateEditMapName = (e) => {
		const { name, value } = e.target;
		setEditMapName(value);
	}

    const editMapNameUpdate = async () => {
        await UpdateMapField({ variables: { _id: delMapId, field: 'name', value: editMapName }});
        await refetchMaps(refetch);
        toggleShowEdit(false)
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
                {
                    mapsList && mapsList.map(map => (
                        <div className="flex1">
                            <div className="eachMap" onClick={() => {
                                history.push('/' + map._id);
                            }}>{map.name}</div>
                            <CreateIcon className="creMap material-icons"
                                onClick={() => {
                                    setEditMapName(map.name);
                                    setDelMapId(map._id); 
                                    toggleShowCreateMap(false)
                                    toggleShowDelete(false)
                                    toggleShowUpdate(false)
                                    toggleShowEdit(!showEdit)
                                } }></CreateIcon>
                            <Del className="delMap material-icons"
                                onClick={() => { setDelMapId(map._id); 
                                                toggleShowUpdate(false); 
                                                toggleShowCreateMap(false);
                                                toggleShowEdit(false);
                                                toggleShowDelete(!showDelete);}}></Del> 
                        </div>
                    ))
                }
                </div>
                <div className="pictures">
                    <img></img>
                    <div className="createMap" onClick={setShowCreateMap}>
                        Create New Map
                    </div>
                </div>
            </div>
        </div>
        {
            showUpdate && (<UpdateAccount fetchUser={props.fetchUser} user={props.user} setShowUpdate={setShowUpdate} />)
        }
        {
            showDelete && (<Delete deleteMap={deleteMap} id={delMapId} setShowDelete={setShowDelete} />)
        }
        {
            showCreateMap && (<WModal className="login-modal" visible={true} cover={true} animation="slide-fade-top">
                                <WMHeader className="modal-header" onClose={setShowCreateMap}>
                                    <div className="modal-header-div">
                                        Create Map
                                    </div>
                                </WMHeader>
                                <WMMain className="main-login-modal">		 
                                    <WInput className="modal-input" onBlur={updateMapName} name='name' labelAnimation="up" barAnimation="solid" labelText="Map Name" wType="outlined" inputType='text' />
                                </WMMain>
                                <WMFooter>
                                    <WButton className="modal-button" onClick={createNewMap} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" >
                                        Create
                                    </WButton>
                                    <WButton className="modal-button1" onClick={setShowCreateMap} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" >
                                        Cancel
                                    </WButton>
                                </WMFooter>
                            </WModal>)
        }
        {
            showEdit && (<WModal className="login-modal" visible={true} cover={true} animation="slide-fade-top">
                                <WMHeader className="modal-header" onClose={setShowEdit}>
                                    <div className="modal-header-div3">
                                        Edit Map Name
                                    </div>
                                </WMHeader>
                                <WMMain className="main-login-modal">		 
                                    <WInput className="modal-input" onBlur={updateEditMapName} name='name' labelAnimation="up" barAnimation="solid" labelText="Map Name" wType="outlined" inputType='text' defaultValue={editMapName} />
                                </WMMain>
                                <WMFooter>
                                    <WButton className="modal-button" onClick={editMapNameUpdate} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" >
                                        Confirm
                                    </WButton>
                                    <WButton className="modal-button1" onClick={setShowEdit} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" >
                                        Cancel
                                    </WButton>
                                </WMFooter>
                            </WModal>)
        }
        </>
    )
}

export default Mapscreen;