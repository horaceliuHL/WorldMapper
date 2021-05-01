import { gql } from "@apollo/client";

export const GET_DB_USER = gql`
	query GetDBUser {
		getCurrentUser {
			_id
			name
			email
		}
	}
`;

export const GET_DB_MAPS = gql`
	query GetDBMaps {
		getAllMaps {
			_id
			id
			name
			owner
			regions
		}
	}
`;

export const GET_DB_REGIONS = gql`
	query GetDBRegions {
		getAllRegions {
			_id
			id
			parentId
			name
			capital
			leader
			flag
			landmarks
			regions
		}
	}
`;

export const GET_MAP_BY_ID = gql`
	query GetMapById($_id: String!) {
		getMapById(_id: $_id) {
			_id
			id
			name
			owner
			regions
		}
	}
`

