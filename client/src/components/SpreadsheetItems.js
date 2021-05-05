import React, {useState} from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {useHistory} from 'react-router-dom'
import '../css/spreadsheetitems.css'

const SpreadsheetItems = (props) => {
    let history = useHistory();
    const [editName, setEditName] = useState(false);
    const [editCapital, setEditCapital] = useState(false);
    const [editLeader, setEditLeader] = useState(false);

    let clickOrEdit = {
        clicked: 0,
        editRegionName: false,
    }

    return (
        <div className="regionItemSpreadsheet">
            <div className="regionItemCloseIconSpreadsheet" onClick={() => {
                props.setShowDelete1(props.region._id)
            }}><CloseIcon className="regionItemCloseIconSpreadsheet1"></CloseIcon></div>
            {
                (editName === true) ? <input className="regionItemNameSpreadsheet1" onBlur={(e) => {
                    setEditName(false)
                    let old = props.region.name
                    let updated = 'Region'
                    if (e.target.value !== '') updated = e.target.value
                    props.editStuff(props.region._id, 'name', old, updated)
                }} defaultValue={props.region.name} />
                : <div className="regionItemNameSpreadsheet" onClick={() => {
                        clickOrEdit.clicked = clickOrEdit.clicked + 1
                        setTimeout(() => {
                            if (clickOrEdit.clicked === 1){
                                history.push("/" + props.region._id)
                            } else if (clickOrEdit.clicked === 2){
                                setEditCapital(false)
                                setEditLeader(false)
                                setEditName(true)
                            }
                            clickOrEdit.clicked = 0
                        }, 400)
                    }}>{props.region.name}</div>
            }
            {
                (editCapital === true) ? <input className="regionItemCapitalSpreadsheet1" onBlur={(e) => {
                    setEditCapital(false)
                    let old = props.region.capital
                    let updated = 'Capital'
                    if (e.target.value !== '') updated = e.target.value
                    props.editStuff(props.region._id, 'capital', old, updated)
                }} defaultValue={props.region.capital} />
                :  <div className="regionItemCapitalSpreadsheet" onDoubleClick={() => {
                        setEditCapital(true)
                        setEditName(false)
                        setEditLeader(false)
                    }}>{props.region.capital}</div>
            }
            {
                (editLeader === true) ? <input className="regionItemLeaderSpreadsheet1" onBlur={(e) => {
                    setEditLeader(false)
                    let old = props.region.leader
                    let updated = 'Leader'
                    if (e.target.value !== '') updated = e.target.value
                    props.editStuff(props.region._id, 'leader', old, updated)
                }} defaultValue={props.region.leader} />
                : <div className="regionItemLeaderSpreadsheet" onDoubleClick={() => {
                        setEditCapital(false)
                        setEditName(false)
                        setEditLeader(true)
                    }}>{props.region.leader}</div>
            }
            <div className="regionItemFlagSpreadsheet">{props.region.flag}</div>
            <div className="regionItemLandmarksSpreadsheet" onClick={() => {
                history.push("/viewer/" + props.region._id);
            }}>{props.region.landmarks}</div>
        </div>

    )
}

export default SpreadsheetItems;