import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			name
			password
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $name: String!) {
		register(email: $email, password: $password, name: $name) {
			email
			password
			name
		}
	}
`;

export const UPDATE = gql`
	mutation Update($email: String!, $password: String!, $name: String!, $id: String!, $oldEmail: String!) {
		update(email: $email, password: $password, name: $name, id: $id, oldEmail: $oldEmail) {
			email
			password
			name
		}
	}
`;

export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

// export const DELETE_ITEM = gql`
// 	mutation DeleteItem($itemId: String!, $_id: String!) {
// 		deleteItem(itemId: $itemId, _id: $_id) {
// 			_id
// 			id
// 			description
// 			due_date
// 			assigned_to
// 			completed
// 		}
// 	}
// `;

// export const UPDATE_ITEM_FIELD = gql`
// 	mutation UpdateItemField($_id: String!, $itemId: String!, $field: String!, $value: String!, $flag: Int!) {
// 		updateItemField(_id: $_id, itemId: $itemId, field: $field, value: $value, flag: $flag) {
// 			_id
// 			id
// 			description
// 			due_date
// 			assigned_to
// 			completed
// 		}
// 	}
// `;

// export const REORDER_ITEMS = gql`
// 	mutation ReorderItems($_id: String!, $itemId: String!, $direction: Int!) {
// 		reorderItems(_id: $_id, itemId: $itemId, direction: $direction) {
// 			_id
// 			id
// 			description
// 			due_date
// 			assigned_to
// 			completed
// 		}
// 	}
// `;

export const QUICK_MODIFY_MAP = gql`
	mutation QuickModifyMap($_id: String!) {
		quickModifyMap(_id: $_id)
	}
`;

export const ADD_MAP = gql`
	mutation AddMap($map: MapInput!) {
		addMap(map: $map) 
	}
`;

export const DELETE_MAP = gql`
	mutation DeleteMap($_id: String!) {
		deleteMap(_id: $_id)
	}
`;

export const UPDATE_MAP_FIELD = gql`
	mutation UpdateMapField($_id: String!, $field: String!, $value: String!) {
		updateMapField(_id: $_id, field: $field, value: $value)
	}
`;

export const ADD_REGION = gql`
  mutation AddRegion($region: RegionInput!) {
    addRegion(region: $region)
  }
`;

export const DELETE_REGION = gql`
	mutation DeleteRegion($_id: String!) {
		deleteRegion(_id: $_id){
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

export const EDIT_REGION = gql`
  mutation EditRegion($_id: String, $field: String, $value: String) {
    editRegion(_id: $_id, field: $field, value: $value)
  }
`;

export const SORT_NAME = gql`
	mutation SortName($_id: String) {
		sortName(_id: $_id)
	}
`;

export const UNSORT_NAME = gql`
	mutation UnsortName($_id: String, $list: [String]) {
		unsortName(_id: $_id, list: $list)
	}
`;

export const SORT_CAPITAL = gql`
	mutation SortCapital($_id: String) {
		sortCapital(_id: $_id)
	}
`;

export const UNSORT_CAPITAL = gql`
	mutation UnsortCapital($_id: String, $list: [String]) {
		unsortCapital(_id: $_id, list: $list)
	}
`;

export const SORT_LEADER = gql`
	mutation SortLeader($_id: String) {
		sortLeader(_id: $_id)
	}
`;

export const UNSORT_LEADER = gql`
	mutation UnsortLeader($_id: String, $list: [String]) {
		unsortLeader(_id: $_id, list: $list)
	}
`;

export const SWITCH_PARENTS = gql`
	mutation SwitchParents($_id: String, $currentParentId: String, $newParentId: String) {
		switchParents(_id: $_id, currentParentId: $currentParentId, newParentId: $newParentId)
	}
`;

