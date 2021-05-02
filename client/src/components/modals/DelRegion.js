import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DelRegion = (props) => {

    const handleDelete = async () => {
        props.deleteMap(props.id);
        props.setShowDelete(false);
    }

    return (
        <WModal className="delete-modal" visible={true} cover={true} animation="slide-fade-top">
            <WMHeader className="modal-header" onClose={() => props.setShowDelete(false)}>
                    <div className="modal-header-div2">
                        Delete Region? All subregions will be deleted
                    </div>
			    </WMHeader>

            <WMMain>
                <WButton className="modal-button" onClick={handleDelete} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger">
                    Delete
				</WButton>
                <WButton className="modal-button1" onClick={() => props.setShowDelete(false)} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
                    Cancel
				</WButton>
            </WMMain>

        </WModal>
    );
}

export default DelRegion;