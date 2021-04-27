const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		id: Int!
		name: String!
		owner: String!
		regions: [Region]
	}
	type Region {
		_id: String!
		id: Int!
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
		regions: [RegionInput]
	}
	input RegionInput {
		_id: String
		id: Int
		name: String
		capital: String
		leader: String
		flag: String
		landmarks: [String]
		regions: [String]
	}
`;

module.exports = { typeDefs: typeDefs }