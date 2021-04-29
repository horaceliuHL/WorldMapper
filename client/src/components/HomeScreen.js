import React, {useState} from 'react';
import { WNavbar, WNavItem } from 'wt-frontend';
import NavbarOptions from './navbar/NavbarOptions.js'
import Login 							from './modals/Login';
import Delete 							from './modals/Delete';
import CreateAccount 					from './modals/CreateAccount';
import {Image, Navbar} from 'react-bootstrap'
import '../css/homescreen.css'

const HomeScreen = (props) => {
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);

    const auth = props.user === null ? false : true;

    const setShowLogin = () => {
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
	};

    return (
        <>
            <NavbarOptions
                fetchUser={props.fetchUser} auth={auth} 
                setShowCreate={setShowCreate} setShowLogin={setShowLogin}/>

            <div className="home">
                <Image></Image>
                <h3 className="welcomeText">Welcome To The World Data Mapper</h3>
            </div>

			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} setShowLogin={setShowLogin} />)
			}
        </>
    )
}

export default HomeScreen