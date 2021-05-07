const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		id: Int!
		name: String!
		owner: String!
		regions: [String]
	}
	type Region {
		_id: String!
		id: Int!
		parentId: String!
		name: String!
		capital: String!
		leader: String!
		flag: String!
		landmarks: [String]
		regions: [String]
	}
	extend type Query {
		getAllMaps: [Map]
		getMapById(_id: String!): Map 
		getAllRegions: [Region]
		getAllParentRegions(_id: String): [ParentInput]
		getAllChildrenRegions(_id: String): [Region]
	}
	extend type Mutation {
		quickModifyMap(_id: String): Boolean
		addMap(map: MapInput!): String
		deleteMap(_id: String!): Boolean
		updateMapField(_id: String!, field: String!, value: String!): String
		addRegion(region: RegionInput!): String
		deleteRegion(_id: String!): Region
		editRegion(_id: String, field: String, value: String): Boolean
		sortName(_id: String): [String]
		unsortName(_id: String, list: [String]): [String]
		sortCapital(_id: String): [String]
		unsortCapital(_id: String, list: [String]): [String]
		sortLeader(_id: String): [String]
		unsortLeader(_id: String, list: [String]): [String]
		switchParents(_id: String, currentParentId: String, newParentId: String): Boolean
	}
	type ParentInput {
		_id: String
		name: String
	}
	input FieldInput {
		_id: String
		field: String
		value: String
	}
	input MapInput {
		_id: String
		id: Int
		name: String
		owner: String
		regions: [String]
	}
	input RegionInput {
		_id: String
		id: Int
		parentId: String
		name: String
		capital: String
		leader: String
		flag: String
		landmarks: [String]
		regions: [String]
	}
`;

module.exports = { typeDefs: typeDefs }