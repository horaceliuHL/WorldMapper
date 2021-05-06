import React, {useState, useEffect} from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {useHistory} from 'react-router-dom'
import '../css/spreadsheetitems.css'

const SpreadsheetItems = (props) => {
    let history = useHistory();
    const [editName, setEditName] = useState(props.region.name)
    const [editCapital, setEditCapital] = useState(props.region.capital)
    const [editLeader, setEditLeader] = useState(props.region.leader)

    let clickOrEdit = {
        clicked: 0,
        editRegionName: false,
    }

    const changeKeyPlace = (e) => {
        if (editName !== props.region.name) props.editStuff(props.region._id, 'name', props.region.name, editName)
        else if (editCapital !== props.region.capital) props.editStuff(props.region._id, 'capital', props.region.capital, editCapital)
        else if (editLeader !== props.region.leader) props.editStuff(props.region._id, 'leader', props.region.leader, editLeader)
        if (e.key === 'ArrowUp'){
            props.changing(props.arrowV - 1, props.arrowH)
        } else if (e.key === 'ArrowDown'){
            props.changing(props.arrowV + 1, props.arrowH)
        } else if (e.key === 'ArrowLeft'){
            props.changing(props.arrowV, props.arrowH - 1)
        } else if (e.key === 'ArrowRight'){
            props.changing(props.arrowV, props.arrowH + 1)
        }
    }


    return (
        <div className="regionItemSpreadsheet">
            <div className="regionItemCloseIconSpreadsheet" onClick={() => {
                props.setShowDelete1(props.region._id)
            }}><CloseIcon className="regionItemCloseIconSpreadsheet1"></CloseIcon></div>
            {
                (props.arrowH === 1 && props.arrowV === props.index) ? <input className="regionItemNameSpreadsheet1" onBlur={(e) => {
                    props.changing(-2, -2)
                    let old = props.region.name
                    let updated = 'Region'
                    if (e.target.value !== '') updated = e.target.value
                    props.editStuff(props.region._id, 'name', old, updated)
                }} onChange={(e) => setEditName(e.target.value)} onKeyDown={changeKeyPlace} defaultValue={props.region.name} autoFocus />
                : <div className="regionItemNameSpreadsheet" onClick={() => {
                        clickOrEdit.clicked = clickOrEdit.clicked + 1
                        setTimeout(() => {
                            if (clickOrEdit.clicked === 1){
                                history.push("/" + props.region._id)
                            } else if (clickOrEdit.clicked === 2){
                                props.changing(props.index, 1)
                            }
                            clickOrEdit.clicked = 0
                        }, 400)
                    }}>{props.region.name}</div>
            }
            {
                (props.arrowH === 2 && props.arrowV === props.index) ? <input className="regionItemCapitalSpreadsheet1" onBlur={(e) => {
                    props.changing(-2, -2)
                    let old = props.region.capital
                    let updated = 'Capital'
                    if (e.target.value !== '') updated = e.target.value
                    props.editStuff(props.region._id, 'capital', old, updated)
                }} onChange={(e) => setEditCapital(e.target.value)} onKeyDown={changeKeyPlace} defaultValue={props.region.capital} autoFocus />
                :  <div className="regionItemCapitalSpreadsheet" onDoubleClick={() => {
                        props.changing(props.index, 2)
                    }}>{props.region.capital}</div>
            }
            {
                (props.arrowH === 3 && props.arrowV === props.index) ? <input className="regionItemLeaderSpreadsheet1" onBlur={(e) => {
                    props.changing(-2, -2)
                    let old = props.region.leader
                    let updated = 'Leader'
                    if (e.target.value !== '') updated = e.target.value
                    props.editStuff(props.region._id, 'leader', old, updated)
                }} onChange={(e) => setEditLeader(e.target.value)} onKeyDown={changeKeyPlace} defaultValue={props.region.leader} autoFocus/>
                : <div className="regionItemLeaderSpreadsheet" onDoubleClick={() => {
                        props.changing(props.index, 3)
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