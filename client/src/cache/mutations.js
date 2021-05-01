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

// export const SORT_TASKS = gql`
//   mutation SortTasks($_id: String!) {
//     sortTasks(_id: $_id){
//       _id
//     }
//   }
// `;

// export const UNSORT_TASKS = gql`
//   mutation UnsortTasks($_id: String!, $list: [ItemInput]!) {
//     unsortTasks(_id: $_id, list: $list){
//       _id
//     }
//   }
// `;

// export const SORT_DATE = gql`
//   mutation SortDate($_id: String!) {
//     sortDate(_id: $_id){
//       _id
//     }
//   }
// `;

// export const UNSORT_DATE = gql`
//   mutation UnsortDate($_id: String!, $list: [ItemInput]!) {
//     unsortDate(_id: $_id, list: $list){
//       _id
//     }
//   }
// `;

// export const SORT_STATUS = gql`
//   mutation SortStatus($_id: String!) {
//     sortStatus(_id: $_id){
//       _id
//     }
//   }
// `;

// export const UNSORT_STATUS = gql`
//   mutation UnsortStatus($_id: String!, $list: [ItemInput]!) {
//     unsortStatus(_id: $_id, list: $list){
//       _id
//     }
//   }
// `;

// export const SORT_ASSIGNED = gql`
//   mutation SortAssigned($_id: String!) {
//     sortAssigned(_id: $_id){
//       _id
//     }
//   }
// `;

// export const UNSORT_ASSIGNED = gql`
//   mutation UnsortAssigned($_id: String!, $list: [ItemInput]!) {
//     unsortAssigned(_id: $_id, list: $list){
//       _id
//     }
//   }
// `;
