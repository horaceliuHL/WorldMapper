import React		from 'react';
import Homescreen 		from './components/HomeScreen.js';
import Mapscreen from './components/Mapscreen.js';
import { useQuery } 	from '@apollo/client';
import * as queries 	from './cache/queries';
import { jsTPS } 		from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
 
const App = () => {
	let user = null;
    let transactionStack = new jsTPS();
	
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);

    if(error) { console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { user = getCurrentUser;}
    }

	return(
		<BrowserRouter>
			<Switch>
				<Route exact path="/" render={() => (
					user ?  (<Route render={() => <Mapscreen fetchUser={refetch} user={user} />}/>) 
					: (<Route render={() => <Homescreen fetchUser={refetch} user={user} /> }/>)
				)}/>
				
			</Switch>
		</BrowserRouter>
	);
}

export default App;