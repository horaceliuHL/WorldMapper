const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/maps-model');

// The underscore param, "_", is a wildcard that can represent any value;
// here it is a stand-in for the parent parameter, which can be read about in
// the Apollo Server documentation regarding resolvers

module.exports = {
	Query: {
		getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const maps = await Map.find({owner: _id});
			if(maps) return (maps);

		},
		getMapById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const todolist = await Map.findOne({_id: objectId});
			if(todolist) return todolist;
			else return ({});
		},
	},
	Mutation: {
	// 	/** 
	// 	 	@param 	 {object} args - a todolist id and an empty item object
	// 		@returns {string} the objectID of the item or an error message
	// 	**/
	// 	addItem: async(_, args) => {
	// 		const { _id, item, index } = args;
	// 		const listId = new ObjectId(_id);
	// 		const objectId = new ObjectId();
	// 		const found = await Map.findOne({_id: listId});
	// 		if(!found) return ('Map not found');
	// 		if(item._id === '') item._id = objectId
	// 		let listItems = found.items;
	// 		if(index < 0) listItems.push(item);
    //   	else listItems.splice(index, 0, item);
			
	// 		const updated = await Todolist.updateOne({_id: listId}, { items: listItems });

	// 		if(updated) return (item._id);
	// 		else return ('Could not add item');
	// 	},
		addMap: async (_, args) => {
			const { map } = args;
			let objectId = new ObjectId();
      		if (map._id !== '') objectId = map._id;
			const { id, name, owner, regions } = map;
			const newMap = new Map({
				_id: objectId,
				id: id,
				name: name,
				owner: owner,
				regions: regions
			});
			const updated = await newMap.save();
			if(updated) return objectId;
			else return ('Could not add map');
		},
		deleteMap: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const deleted = await Map.deleteOne({_id: objectId});
			if(deleted) return true;
			else return false;
		},
	// 	/** 
	// 	 	@param 	 {object} args - a todolist objectID and item objectID
	// 		@returns {array} the updated item array on success or the initial 
	// 						 array on failure
	// 	**/
	// 	deleteItem: async (_, args) => {
	// 		const  { _id, itemId } = args;
	// 		const listId = new ObjectId(_id);
	// 		const found = await Todolist.findOne({_id: listId});
	// 		let listItems = found.items;
	// 		listItems = listItems.filter(item => item._id.toString() !== itemId);
	// 		const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
	// 		if(updated) return (listItems);
	// 		else return (found.items);

	// 	},
		
	// 	/** 
	// 	 	@param 	 {object} args - a todolist objectID, field, and the update value
	// 		@returns {boolean} true on successful update, false on failure
	// 	**/
	// 	updateTodolistField: async (_, args) => {
	// 		const { field, value, _id } = args;
	// 		const objectId = new ObjectId(_id);
	// 		const updated = await Todolist.updateOne({_id: objectId}, {[field]: value});
	// 		if(updated) return value;
	// 		else return "";
	// 	},
	// 	/** 
	// 		@param	 {object} args - a todolist objectID, an item objectID, field, and
	// 								 update value. Flag is used to interpret the completed 
	// 								 field,as it uses a boolean instead of a string
	// 		@returns {array} the updated item array on success, or the initial item array on failure
	// 	**/
	// 	updateItemField: async (_, args) => {
	// 		const { _id, itemId, field,  flag } = args;
	// 		let { value } = args
	// 		const listId = new ObjectId(_id);
	// 		const found = await Todolist.findOne({_id: listId});
	// 		let listItems = found.items;
	// 		if(flag === 1) {
	// 			if(value === 'complete') { value = true; }
	// 			if(value === 'incomplete') { value = false; }
	// 		}
	// 		listItems.map(item => {
	// 			if(item._id.toString() === itemId) {	
					
	// 				item[field] = value;
	// 			}
	// 		});
	// 		const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
	// 		if(updated) return (listItems);
	// 		else return (found.items);
	// 	},
	// 	/**
	// 		@param 	 {object} args - contains list id, item to swap, and swap direction
	// 		@returns {array} the reordered item array on success, or initial ordering on failure
	// 	**/
	// 	reorderItems: async (_, args) => {
	// 		const { _id, itemId, direction } = args;
	// 		const listId = new ObjectId(_id);
	// 		const found = await Todolist.findOne({_id: listId});
	// 		let listItems = found.items;
	// 		const index = listItems.findIndex(item => item._id.toString() === itemId);
	// 		// move selected item visually down the list
	// 		if(direction === 1 && index < listItems.length - 1) {
	// 			let next = listItems[index + 1];
	// 			let current = listItems[index]
	// 			listItems[index + 1] = current;
	// 			listItems[index] = next;
	// 		}
	// 		// move selected item visually up the list
	// 		else if(direction === -1 && index > 0) {
	// 			let prev = listItems[index - 1];
	// 			let current = listItems[index]
	// 			listItems[index - 1] = current;
	// 			listItems[index] = prev;
	// 		}
	// 		const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
	// 		if(updated) return (listItems);
	// 		// return old ordering if reorder was unsuccessful
	// 		listItems = found.items;
	// 		return (found.items);

	// 	},
    // sortTasks: async (_, args) => {
    //   const { _id } = args;
    //   const listId = new ObjectId(_id);
	// 		const found = await Todolist.findOne({_id: listId});
	// 		let listItems = found.items;
    //   let listItemsCheck = [];
    //   for (let i = 0; i < listItems.length; i++){
    //     let tempItem = {
    //       _id: listItems[i]._id,
    //       id: listItems[i].id,
    //       description: listItems[i].description,
    //       due_date: listItems[i].due_date,
    //       assigned_to: listItems[i].assigned_to,
    //       completed: listItems[i].completed,
    //     }
    //     listItemsCheck[i] = tempItem
    //   }
    //   listItemsCheck = listItemsCheck.sort((a, b) => a.description.toLowerCase().localeCompare(b.description.toLowerCase()))
    //   let sorted = true;
    //   for (let i = 0; i < listItems.length; i++){
    //     if (listItems[i].id !== listItemsCheck[i].id) sorted = false;
    //   }
    //   if (sorted === true) listItems = listItemsCheck.reverse();
    //   else listItems = listItemsCheck
    //   const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
    //   if (updated) return (listItems);
    //   else return (found.items)
    // },
    // unsortTasks: async (_, args) => {
    //   const { _id, list } = args;
    //   const listId = new ObjectId(_id);
	// 		const found = await Todolist.findOne({_id: listId});
	// 		let listItems = found.items;
    //   for (let i = 0; i < listItems.length; i++){
    //     listItems[i] = list[i]
    //   }
    //   const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
    //   if (updated) return (listItems);
    //   else return (found.items);
    // },
    // sortDate: async (_, args) => {
    //   const { _id } = args;
    //   const listId = new ObjectId(_id);
	// 		const found = await Todolist.findOne({_id: listId});
	// 		let listItems = found.items;
    //   let listItemsCheck = [];
    //   for (let i = 0; i < listItems.length; i++){
    //     let tempItem = {
    //       _id: listItems[i]._id,
    //       id: listItems[i].id,
    //       description: listItems[i].description,
    //       due_date: listItems[i].due_date,
    //       assigned_to: listItems[i].assigned_to,
    //       completed: listItems[i].completed,
    //     }
    //     listItemsCheck[i] = tempItem
    //   }
    //   listItemsCheck = listItemsCheck.sort((a, b) => a.due_date.localeCompare(b.due_date))
    //   let sorted = true;
    //   for (let i = 0; i < listItems.length; i++){
    //     if (listItems[i].id !== listItemsCheck[i].id) sorted = false;
    //   }
    //   if (sorted === true) listItems = listItemsCheck.reverse();
    //   else listItems = listItemsCheck
    //   const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
    //   if (updated) return (listItems);
    //   else return (found.items)
    // },
    // unsortDate: async (_, args) => {
    //   const { _id, list } = args;
    //   const listId = new ObjectId(_id);
	// 		const found = await Todolist.findOne({_id: listId});
	// 		let listItems = found.items;
    //   for (let i = 0; i < listItems.length; i++){
    //     listItems[i] = list[i]
    //   }
    //   const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
    //   if (updated) return (listItems);
    //   else return (found.items);
    // },
    // sortStatus: async (_, args) => {
    //   const { _id } = args;
    //   const listId = new ObjectId(_id);
	// 		const found = await Todolist.findOne({_id: listId});
	// 		let listItems = found.items;
    //   let listItemsCheck = [];
    //   for (let i = 0; i < listItems.length; i++){
    //     let tempItem = {
    //       _id: listItems[i]._id,
    //       id: listItems[i].id,
    //       description: listItems[i].description,
    //       due_date: listItems[i].due_date,
    //       assigned_to: listItems[i].assigned_to,
    //       completed: listItems[i].completed,
    //     }
    //     listItemsCheck[i] = tempItem
    //   }
    //   listItemsCheck = listItemsCheck.sort((a, b) => a.completed - b.completed)
    //   let sorted = true;
    //   for (let i = 0; i < listItems.length; i++){
    //     if (listItems[i].id !== listItemsCheck[i].id) sorted = false;
    //   }
    //   if (sorted === true) listItems = listItemsCheck.reverse();
    //   else listItems = listItemsCheck
    //   const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
    //   if (updated) return (listItems);
    //   else return (found.items)
    // },
    // unsortStatus: async (_, args) => {
    //   const { _id, list } = args;
    //   const listId = new ObjectId(_id);
	// 		const found = await Todolist.findOne({_id: listId});
	// 		let listItems = found.items;
    //   for (let i = 0; i < listItems.length; i++){
    //     listItems[i] = list[i]
    //   }
    //   const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
    //   if (updated) return (listItems);
    //   else return (found.items);
    // },
    // sortAssigned: async (_, args) => {
    //   const { _id } = args;
    //   const listId = new ObjectId(_id);
	// 		const found = await Todolist.findOne({_id: listId});
	// 		let listItems = found.items;
    //   let listItemsCheck = [];
    //   for (let i = 0; i < listItems.length; i++){
    //     let tempItem = {
    //       _id: listItems[i]._id,
    //       id: listItems[i].id,
    //       description: listItems[i].description,
    //       due_date: listItems[i].due_date,
    //       assigned_to: listItems[i].assigned_to,
    //       completed: listItems[i].completed,
    //     }
    //     listItemsCheck[i] = tempItem
    //   }
    //   listItemsCheck = listItemsCheck.sort((a, b) => a.assigned_to.toLowerCase().localeCompare(b.assigned_to.toLowerCase()))
    //   let sorted = true;
    //   for (let i = 0; i < listItems.length; i++){
    //     if (listItems[i].id !== listItemsCheck[i].id) sorted = false;
    //   }
    //   if (sorted === true) listItems = listItemsCheck.reverse();
    //   else listItems = listItemsCheck
    //   const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
    //   if (updated) return (listItems);
    //   else return (found.items)
    // },
    // unsortAssigned: async (_, args) => {
    //   const { _id, list } = args;
    //   const listId = new ObjectId(_id);
	// 		const found = await Todolist.findOne({_id: listId});
	// 		let listItems = found.items;
    //   for (let i = 0; i < listItems.length; i++){
    //     listItems[i] = list[i]
    //   }
    //   const updated = await Todolist.updateOne({_id: listId}, { items: listItems })
    //   if (updated) return (listItems);
    //   else return (found.items);
    // },

	}
}