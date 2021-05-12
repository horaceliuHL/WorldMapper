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
		getAllLandmarks: async (_, args) => { //https://www.geeksforgeeks.org/preorder-traversal-of-n-ary-tree-without-recursion/
			const { _id } = args;
			const objectId = new ObjectId(_id);
			let found = await Region.findOne({_id: objectId});
			let storeFinalList = []
			let nodes = []
			nodes.push(found._id)
			while (nodes.length !== 0){
				let curr = nodes.shift()
				if (curr !== null){
					let temp = await Region.findOne({_id: curr});
					let land = temp.landmarks.map(i => i + ' - ' + temp.name)
					storeFinalList = storeFinalList.concat(land);
					for (let i = 0; i < temp.regions.length; i++){
						nodes.push(temp.regions[i])
					}
				}
			}
			return storeFinalList;
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
		switchParents: async (_, args) => {
			const { _id, currentParentId, newParentId } = args;
			const objectId = new ObjectId(_id);
			const objectId1 = new ObjectId(currentParentId);
			const objectId2 = new ObjectId(newParentId);
			let updated;

			let checkWhere = false;
			let found = await Region.findOne({_id: objectId});
			if (found === null) {
				found = await Map.findOne({_id: objectId});
				checkWhere = true;
			}
			if (checkWhere === true) updated = await Map.updateOne({_id: objectId}, { parentId: objectId2 })
			else updated = await Region.updateOne({_id: objectId}, { parentId: objectId2 })

			checkWhere = false;
			found = await Region.findOne({_id: objectId1});
			if (found === null) {
				found = await Map.findOne({_id: objectId1});
				checkWhere = true;
			}
			updatedChildren = found.regions
			let tempIndex = updatedChildren.indexOf(objectId)
			updatedChildren.splice(tempIndex, 1)
			if (checkWhere === true){
				updated = await Map.updateOne({_id: objectId1}, { regions: updatedChildren })
			} else {
				updated = await Region.updateOne({_id: objectId1}, { regions: updatedChildren })
			} 

			checkWhere = false;
			found = await Region.findOne({_id: objectId2});
			if (found === null) {
				found = await Map.findOne({_id: objectId2});
				checkWhere = true;
			}
			updatedChildren = found.regions
			updatedChildren.push(objectId)
			if (checkWhere === true){
				updated = await Map.updateOne({_id: objectId2}, { regions: updatedChildren })
			} else {
				updated = await Region.updateOne({_id: objectId2}, { regions: updatedChildren })
			}

			if (updated) return true
			else return false
		},
		addLandmark: async (_, args) => {
			const { _id, name } = args;
			const objectId = new ObjectId(_id);
			let found = await Region.findOne({_id: objectId});
			let updatedLandmarks = found.landmarks
			if (updatedLandmarks.indexOf(name) === -1) updatedLandmarks.push(name)
			let updated = await Region.updateOne({_id: objectId}, { landmarks: updatedLandmarks })
			if (updated) return true
			else return false
		},
		deleteLandmark: async (_, args) => {
			const { _id, name } = args;
			const objectId = new ObjectId(_id);
			let found = await Region.findOne({_id: objectId});
			let updatedLandmarks = found.landmarks
			let tempIndex = updatedLandmarks.indexOf(name)
			updatedLandmarks.splice(tempIndex, 1)
			let updated = await Region.updateOne({_id: objectId}, { landmarks: updatedLandmarks })
			if (updated) return true
			else return false
		},
		editLandmark: async (_, args) => {
			const { _id, name, newName } = args;
			const objectId = new ObjectId(_id);
			let found = await Region.findOne({_id: objectId});
			let updatedLandmarks = found.landmarks
			let tempIndex = updatedLandmarks.indexOf(name)
			updatedLandmarks[tempIndex] = newName
			let updated = await Region.updateOne({_id: objectId}, { landmarks: updatedLandmarks })
			if (updated) return true
			else return false
		}

	}
}