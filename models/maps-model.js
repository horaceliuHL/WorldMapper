const { model, Schema, ObjectId } = require('mongoose');
const Region = require('./region-model').schema;

const mapsSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
		id: {
			type: Number,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		owner: {
			type: String,
			required: true
		},
		regions: [Region],
	},
	{ timestamps: true }
);

const Map = model('Map', mapsSchema);
module.exports = Map;