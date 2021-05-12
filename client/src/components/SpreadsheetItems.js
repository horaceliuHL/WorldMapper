import React, {useState, useEffect} from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {useHistory} from 'react-router-dom';
// import Image from 'react-bootstrap/Image'
import '../css/spreadsheetitems.css'

const SpreadsheetItems = (props) => {
    let history = useHistory();
    const [editName, setEditName] = useState(props.region.name)
    const [editCapital, setEditCapital] = useState(props.region.capital)
    const [editLeader, setEditLeader] = useState(props.region.leader)
    const [flagPath, setFlagPath] = useState(false)
    const [actualPath, setActualPath] = useState()

    // let tempPath = '../The World/Middle East/Armenia Flag.png'
    // let hello = require(`${props.flagPath + props.region.name} Flag.png`)
    // var image = new Image();
    // image.src = hello
    // if (image.width !== 0){
    //     flagPath = true
    // }

    let tempPath = '../The World/Middle East/Armenia Flag.png'
    console.log(window.location)

    // useEffect(() => {
    //     try{
    //     var image = new Image();
    //     var url_image = props.flagPath + props.region.name +  ' Flag.png';
    //     console.log(url_image)
        
    //     image.src = require(`${url_image}`)
    //     console.log("here")
    //     // if (image.width == 0) {
    //     //     setFlagPath(false)
    //     // } else {
    //         setFlagPath(true)
    //         setActualPath(image.src)
    //         console.log("gotten to here")
    //     // }
    // } catch (e) {
    //     setFlagPath(false)
    // }
    //     // try{
    //     //     let src = props.flagPath + props.region.name + ' Flag.png';
    //     //     setFlagPath(src)
    //     // } catch (err){
    //     //     console.log("flag path not found")
    //     // }
    // })
    

    // let actualFlagPath = props.flagPath + props.region.name + ' Flag.png';

    let clickOrEdit = {
        clicked: 0,
        editRegionName: false,
    }

    const changeKeyPlace = (e) => {
        if (editName !== props.region.name) {
            let temp = editName
            if (temp === '') temp = 'Name'
            props.editStuff(props.region._id, 'name', props.region.name, temp)
        }
        else if (editCapital !== props.region.capital){
            let temp = editCapital
            if (temp === '') temp = 'Capital'
            props.editStuff(props.region._id, 'capital', props.region.capital, temp)
        } 
        else if (editLeader !== props.region.leader){
            let temp = editLeader
            if (temp === '') temp = 'Leader'
            props.editStuff(props.region._id, 'leader', props.region.leader, temp)
        } 
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
                                props.clearAll()
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
            {
                flagPath === false  ? <img src={require('../The World/Middle East/Armenia Flag.png')} onError={() => {setFlagPath(false)}} />
                : <div className="regionItemFlagSpreadsheet">{props.region.flag}</div>
            }
            <div className="regionItemLandmarksSpreadsheet" onClick={() => {
                props.clearAll();
                history.push("/viewer/" + props.region._id);
            }}>{props.region.landmarks.toString()}</div>
        </div>

    )
}

export default SpreadsheetItems;