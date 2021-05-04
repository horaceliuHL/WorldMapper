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
	}
	extend type Mutation {
		quickModifyMap(_id: String): Boolean
		addMap(map: MapInput!): String
		deleteMap(_id: String!): Boolean
		updateMapField(_id: String!, field: String!, value: String!): String
		addRegion(region: RegionInput!): String
		deleteRegion(_id: String!): Boolean
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