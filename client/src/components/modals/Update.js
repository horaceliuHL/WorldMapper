import React, { useState } 	from 'react';
import { UPDATE }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const CreateAccount = (props) => {
	const [input, setInput] = useState({ email: '', password: '', name: '' });
	const [loading, toggleLoading] = useState(false);
	const [Update] = useMutation(UPDATE);

	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleUpdateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to update');
				return;
			}
		}
		const { loading, error, data } = await Update({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			toggleLoading(false);
			if(data.update === 'does not exist') {
				alert('User with that email does not exist');
			}
			else {
				props.fetchUser();
			}
			props.setShowUpdate(false);

		};
	};

	return (
        // Replace div with WModal

		<WModal className="signup-modal" visible={true} cover={true} animation="slide-fade-top">
			<WMHeader className="modal-header" onClose={() => props.setShowUpdate(false)}>
				<div className="modal-header-div1">
					Update
				</div>
			</WMHeader>

			{
				loading ? <div />
					: <WMMain>
							<WCol size="6">
								<WInput 
									className="" onBlur={updateInput} name="name" labelAnimation="up" 
									barAnimation="solid" labelText="Name" wType="outlined" inputType="text" 
								/>
							</WCol>

						<div className="modal-spacer">&nbsp;</div>
						<WInput 
							className="modal-input" onBlur={updateInput} name="email" labelAnimation="up" 
							barAnimation="solid" labelText="Email Address" wType="outlined" inputType="text" 
						/>
						<div className="modal-spacer">&nbsp;</div>
						<WInput 
							className="modal-input" onBlur={updateInput} name="password" labelAnimation="up" 
							barAnimation="solid" labelText="Password" wType="outlined" inputType="password" 
						/>
					</WMMain>
			}
      <WMFooter>
			<WButton className="modal-button" onClick={handleUpdateAccount} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
				Update Account
			</WButton>
			<WButton className="modal-button1" onClick={props.setShowUpdate} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" >
					Cancel
			</WButton>
      </WMFooter>
		</WModal>
	);
}

export default CreateAccount;
