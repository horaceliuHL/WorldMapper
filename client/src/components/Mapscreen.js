import React, {useState} from 'react';
import { Redirect } from "react-router-dom";
import NavbarOptions from './navbar/NavbarOptions.js';
import UpdateAccount from './modals/Update.js';
import Delete from './modals/Delete.js';
import Del from '@material-ui/icons/Delete';
import '../css/mapscreen.css';
import { useMutation, useQuery } 		from '@apollo/client';
import { GET_DB_MAPS } 				from '../cache/queries';
import * as mutations 					from '../cache/mutations';


const Mapscreen = (props) => {
    let mapsList = [];
    const [showUpdate, toggleShowUpdate] 		= useState(false);
    const [showDelete, toggleShowDelete] 		= useState(false);
    const [delMapId, setDelMapId] = useState('')
    const [activeMap, setActiveMap] 		= useState({});
    const [AddMap] 			= useMutation(mutations.ADD_MAP);
    const [DeleteMap] 			= useMutation(mutations.DELETE_MAP);

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
        toggleShowDelete(false)
        toggleShowUpdate(!showUpdate)
    }
    const setShowDelete = () => {
        toggleShowUpdate(false)
        toggleShowDelete(!showDelete)
    }

    const createNewMap = async () => {
        const toDoLen = mapsList.length
        let id = 1;
        if (toDoLen !== 0){
            for (let i = 0; i < toDoLen; i++){
                if (mapsList[i].id >= id) id = mapsList[i].id + Math.round(Math.random(0, 100)) + 1;
            }
        }
        let list = {
            _id: '',
            id: id,
            name: 'Untitled',
            owner: props.user._id,
            regions: [],
        }
        const { data } = await AddMap({ variables: { map: list }, refetchQueries: [{ query: GET_DB_MAPS }] });
        await refetchMaps(refetch);
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
                        <div className="flex">
                            <div className="eachMap" onClick={() => (
                                <Redirect/>
                            )}>{map.name}</div>
                            <Del className="delMap material-icons"
                                onClick={() => { setDelMapId(map._id); 
                                                toggleShowUpdate(false); 
                                                toggleShowDelete(!showDelete);}}>del</Del>
                        </div>
                    ))
                }
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
        {
            showDelete && (<Delete deleteMap={deleteMap} id={delMapId} setShowDelete={setShowDelete} />)
        }
        </>
    )
}

export default Mapscreen;