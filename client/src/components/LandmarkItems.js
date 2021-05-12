import React, {useState} from 'react';
import CloseIcon from '@material-ui/icons/Close';
import '../css/landmarkitems.css'

const LandmarkItems = (props) => {
    const [changingLandmark, setChangingLandmark] = useState(false)
    return (
        <>
            {
                props.currentRegion.landmarks.indexOf(props.x.split(' - ')[0]) === -1 ? 
                    <div className="eachLandmark1"><CloseIcon className="closeLandmark1"/>{props.x}</div>
                : <>{
                    changingLandmark ? <input className="inputLandmark" onBlur={(e) => {
                        props.editLand(props.x.split(' - ')[0], e.target.value);
                        setChangingLandmark(false);
                    }} defaultValue={props.x.split(' - ')[0]} autoFocus></input>
                    : <div className="eachLandmark"><CloseIcon className="closeLandmark" onClick={() => props.delLand(props.x.split(' - ')[0])}/> <div onDoubleClick={() => setChangingLandmark(true)}>{props.x.split(' - ')[0]}</div></div>
                }</>
            }
        </>
    )
}

export default LandmarkItems;