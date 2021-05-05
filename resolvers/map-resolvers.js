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
		getAllChildrenRegions: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			let findParent = await Region.findOne({_id: objectId})
			if (findParent === null) findParent = await Map.findOne({_id: objectId})
			let childrenRegions = []
			for (let i = 0; i < findParent.regions.length; i++){
				childrenRegions[i] = await Region.findOne({_id: new ObjectId(findParent.regions[i])})
			}
			return childrenRegions
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
			if(deleted) return actualRegion;
			else return actualRegion;
		},
		editRegion: async (_, args) => {
			const { _id, field, value } = args;
			const objectId = new ObjectId(_id)
			let updated;
			if (field === 'name') updated = await Region.updateOne({_id: objectId}, {name: value});
			else if (field === 'capital') updated = await Region.updateOne({_id: objectId}, {capital: value});
			else if (field === 'leader') updated = await Region.updateOne({_id: objectId}, {leader: value});
			if (updated) return true
			else return false
		},
		sortName: async (_, args) => {
			const { _id } = args;
			const listId = new ObjectId(_id);
			let checkWhere = false;
			let found = await Region.findOne({_id: listId});
			if (found === null) {
				found = await Map.findOne({_id: listId});
				checkWhere = true;
			}
			let listItems = found.regions;
			let listItemsCheck = [];
			for (let i = 0; i < listItems.length; i++){
				let findRegion = await Region.findOne({_id: new ObjectId(listItems[i])});
				let tempItem = {
					_id: findRegion._id,
					id: findRegion.id,
					parentId: findRegion.parentId,
					name: findRegion.name,
					capital: findRegion.capital,
					leader: findRegion.leader,
					flag: findRegion.flag,
					landmarks: findRegion.landmarks,
					regions: findRegion.regions,
				}
				listItemsCheck[i] = tempItem
			}
			listItemsCheck = listItemsCheck.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
			let sorted = true;
			for (let i = 0; i < listItems.length; i++){
				if (listItems[i] != listItemsCheck[i]._id) sorted = false;
			}
			if (sorted === true) listItems = listItemsCheck.reverse().map(a => a._id);
			else listItems = listItemsCheck.map(a => a._id)
			let updated;
			if (checkWhere === true) updated = await Map.updateOne({_id: listId}, { regions: listItems })
			else updated = await Region.updateOne({_id: listId}, { regions: listItems })
			if (updated) return (listItems);
			else return (found.regions)
		},
		unsortName: async (_, args) => {
			const { _id, list } = args;
			const objectId = new ObjectId(_id);
			let checkWhere = false;
			let found = await Region.findOne({_id: objectId});
			if (found === null) {
				found = await Map.findOne({_id: objectId});
				checkWhere = true;
			}
			if (checkWhere === true) updated = await Map.updateOne({_id: objectId}, { regions: list })
			else updated = await Region.updateOne({_id: objectId}, { regions: list })
			if (updated) return (list);
			else return (found.regions);
		},
		sortCapital: async (_, args) => {
			const { _id } = args;
			const listId = new ObjectId(_id);
			let checkWhere = false;
			let found = await Region.findOne({_id: listId});
			if (found === null) {
				found = await Map.findOne({_id: listId});
				checkWhere = true;
			}
			let listItems = found.regions;
			let listItemsCheck = [];
			for (let i = 0; i < listItems.length; i++){
				let findRegion = await Region.findOne({_id: new ObjectId(listItems[i])});
				let tempItem = {
					_id: findRegion._id,
					id: findRegion.id,
					parentId: findRegion.parentId,
					name: findRegion.name,
					capital: findRegion.capital,
					leader: findRegion.leader,
					flag: findRegion.flag,
					landmarks: findRegion.landmarks,
					regions: findRegion.regions,
				}
				listItemsCheck[i] = tempItem
			}
			listItemsCheck = listItemsCheck.sort((a, b) => a.capital.toLowerCase().localeCompare(b.capital.toLowerCase()))
			let sorted = true;
			for (let i = 0; i < listItems.length; i++){
				if (listItems[i] != listItemsCheck[i]._id) sorted = false;
			}
			if (sorted === true) listItems = listItemsCheck.reverse().map(a => a._id);
			else listItems = listItemsCheck.map(a => a._id)
			let updated;
			if (checkWhere === true) updated = await Map.updateOne({_id: listId}, { regions: listItems })
			else updated = await Region.updateOne({_id: listId}, { regions: listItems })
			if (updated) return (listItems);
			else return (found.regions)
		},
		unsortCapital: async (_, args) => {
			const { _id, list } = args;
			const objectId = new ObjectId(_id);
			let checkWhere = false;
			let found = await Region.findOne({_id: objectId});
			if (found === null) {
				found = await Map.findOne({_id: objectId});
				checkWhere = true;
			}
			if (checkWhere === true) updated = await Map.updateOne({_id: objectId}, { regions: list })
			else updated = await Region.updateOne({_id: objectId}, { regions: list })
			if (updated) return (list);
			else return (found.regions);
		},
		sortLeader: async (_, args) => {
			const { _id } = args;
			const listId = new ObjectId(_id);
			let checkWhere = false;
			let found = await Region.findOne({_id: listId});
			if (found === null) {
				found = await Map.findOne({_id: listId});
				checkWhere = true;
			}
			let listItems = found.regions;
			let listItemsCheck = [];
			for (let i = 0; i < listItems.length; i++){
				let findRegion = await Region.findOne({_id: new ObjectId(listItems[i])});
				let tempItem = {
					_id: findRegion._id,
					id: findRegion.id,
					parentId: findRegion.parentId,
					name: findRegion.name,
					capital: findRegion.capital,
					leader: findRegion.leader,
					flag: findRegion.flag,
					landmarks: findRegion.landmarks,
					regions: findRegion.regions,
				}
				listItemsCheck[i] = tempItem
			}
			listItemsCheck = listItemsCheck.sort((a, b) => a.leader.toLowerCase().localeCompare(b.leader.toLowerCase()))
			let sorted = true;
			for (let i = 0; i < listItems.length; i++){
				if (listItems[i] != listItemsCheck[i]._id) sorted = false;
			}
			if (sorted === true) listItems = listItemsCheck.reverse().map(a => a._id);
			else listItems = listItemsCheck.map(a => a._id)
			let updated;
			if (checkWhere === true) updated = await Map.updateOne({_id: listId}, { regions: listItems })
			else updated = await Region.updateOne({_id: listId}, { regions: listItems })
			if (updated) return (listItems);
			else return (found.regions)
		},
		unsortLeader: async (_, args) => {
			const { _id, list } = args;
			const objectId = new ObjectId(_id);
			let checkWhere = false;
			let found = await Region.findOne({_id: objectId});
			if (found === null) {
				found = await Map.findOne({_id: objectId});
				checkWhere = true;
			}
			if (checkWhere === true) updated = await Map.updateOne({_id: objectId}, { regions: list })
			else updated = await Region.updateOne({_id: objectId}, { regions: list })
			if (updated) return (list);
			else return (found.regions);
		},
	
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