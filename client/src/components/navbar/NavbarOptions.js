import React                                from 'react';
import { LOGOUT }                           from '../../cache/mutations';
import { useMutation, useApolloClient }     from '@apollo/client';
import { useHistory } from "react-router-dom";
import {
    Navbar,
} from 'react-bootstrap';
import '../../css/navbar.css'

const LoggedIn = (props) => {
    let history = useHistory();

    const client = useApolloClient();
	const [Logout] = useMutation(LOGOUT);

    const handleLogout = async (e) => {
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.resetStore();
        }
    };

    return (
        <Navbar className="navbar">
            <Navbar.Brand bsPrefix="title" onClick={() => {history.push('/');}}>The World Data Mapper</Navbar.Brand>
            <Navbar.Text bsPrefix="name" onClick={props.setShowUpdate}>{props.user.name}</Navbar.Text>
            <Navbar.Text bsPrefix="logout" onClick={handleLogout}>Logout</Navbar.Text>
        </Navbar>
    );
};

const LoggedOut = (props) => {
    return (
        <>
        <Navbar bsPrefix="navbar" >
            <Navbar.Brand bsPrefix="title1">The World Data Mapper</Navbar.Brand>
            <Navbar.Text bsPrefix="create" onClick={props.setShowCreate}>Create Account</Navbar.Text>
            <Navbar.Text bsPrefix="login" onClick={props.setShowLogin}>Login</Navbar.Text>
        </Navbar>
        </>
    );
};


const NavbarOptions = (props) => {
    return (
        <>
            {
                props.auth === false ? <LoggedOut setShowLogin={props.setShowLogin} setShowCreate={props.setShowCreate} />
                : <LoggedIn fetchUser={props.fetchUser} logout={props.logout} user={props.user} setShowUpdate={props.setShowUpdate} />
            }
        </>

    );
};

export default NavbarOptions;