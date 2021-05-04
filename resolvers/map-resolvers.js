const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/maps-model');
const Region = require('../models/region-model');

// The underscore param, "_", is a wildcard that can represent any value;
// here it is a stand-in for the parent parameter, which can be read about in
// the Apollo Server documentation regarding resolvers

module.exports = {
	Query: {
		getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			let maps = await Map.find({owner: _id});
			maps = maps.sort((a, b) => b.updatedAt - a.updatedAt)
			console.log(maps[0].updatedAt)
			if(maps) return (maps);

		},
		getMapById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			if(map) return map;
		},
		getAllRegions: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const region = await Region.find();
			if(region) return (region);

		},
		getAllParentRegions: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			let parentInfo = [];
			let counter = 0;
			let tempId = objectId
			let findParent = await Region.findOne({_id: objectId})
			while (findParent !== null){
				parentInfo[counter] = {
					_id: findParent._id,
					name: findParent.name,
				}
				counter += 1;
				tempId = findParent.parentId
				findParent = await Region.findOne({_id: tempId})
			}
			findParent = await Map.findOne({_id: tempId})
			parentInfo[parentInfo.length] = {
				_id: findParent._id,
				name: findParent.name,
			}
			parentInfo.reverse()
			return parentInfo
		},
	},
	Mutation: {
		quickModifyMap: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			const updated = await Map.updateOne({_id: objectId}, {name: map.name});
			if (updated) return true
			else return false

		},
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
				regions: []
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
		updateMapField: async (_, args) => {
			const { field, value, _id } = args;
			const objectId = new ObjectId(_id);
			const updated = await Map.updateOne({_id: objectId}, {[field]: value});
			if(updated) return value;
			else return "";
		},
		addRegion: async(_, args) => {
			const { region } = args;
			let objectId = new ObjectId();
      		if (region._id !== '') objectId = region._id;
			const { id, parentId, name, capital, leader, flag, landmarks, regions } = region;
			let actualId = new ObjectId(parentId)
			let findParent = await Map.findOne({_id: actualId})
			if (!findParent || findParent === null){
				findParent = await Region.findOne({_id: actualId})
				let updatedChildren = findParent.regions
				updatedChildren.push(objectId)
				const updated = await Region.updateOne({_id: actualId}, {regions: updatedChildren});
			} else {
				let updatedChildren = findParent.regions
				updatedChildren.push(objectId)
				const updated = await Map.updateOne({_id: actualId}, {regions: updatedChildren});
			}
			const newRegion = new Region({
				_id: objectId,
				id: id,
				parentId: parentId,
				name: name,
				capital: capital,
				leader: leader,
				flag: flag,
				landmarks: [],
				regions: []
			});
			const updated = await newRegion.save();
			if(updated) return objectId;
			else return ('Could not add region');
		},
		deleteRegion: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const actualRegion = await Region.findOne({_id: objectId})
			const { id, parentId, name, capital, leader, flag, landmarks, regions } = actualRegion;
			let actualId = new ObjectId(parentId)
			let findParent = await Map.findOne({_id: actualId})
			if (!findParent || findParent === null){
				findParent = await Region.findOne({_id: actualId})
				let updatedChildren = findParent.regions
				let tempIndex = updatedChildren.indexOf(objectId)
				updatedChildren.splice(tempIndex, 1)
				const updated = await Region.updateOne({_id: actualId}, {regions: updatedChildren});
			} else {
				let updatedChildren = findParent.regions
				let tempIndex = updatedChildren.indexOf(objectId)
				updatedChildren.splice(tempIndex, 1)
				const updated = await Map.updateOne({_id: actualId}, {regions: updatedChildren});
			}
			const deleted = await Region.deleteOne({_id: objectId});
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