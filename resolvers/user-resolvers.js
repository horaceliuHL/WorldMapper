const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs');
const User = require('../models/user-model');
const tokens = require('../utils/tokens');

module.exports = {
	Query: {
		getCurrentUser: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return({}) }
			const found = await User.findOne(_id);
			if(found) return found;
		},
	},
	Mutation: {
		login: async (_, args, { res }) => {	
			const { email, password } = args;

			const user = await User.findOne({email: email});
			if(!user) return({});

			const valid = await bcrypt.compare(password, user.password);
			if(!valid) return({});
			// Set tokens if login info was valid
			const accessToken = tokens.generateAccessToken(user);
			const refreshToken = tokens.generateRefreshToken(user);
			res.cookie('refresh-token', refreshToken, { httpOnly: true , sameSite: 'None', secure: true}); 
			res.cookie('access-token', accessToken, { httpOnly: true , sameSite: 'None', secure: true}); 
			return user;
		},
		register: async (_, args, { res }) => {
			const { email, password, name } = args;
			const alreadyRegistered = await User.findOne({email: email});
			if(alreadyRegistered) {
				console.log('User with that email already registered.');
				return(new User({
					_id: '',
					name: '',
					email: 'already exists', 
					password: '',}));
			}
			const hashed = await bcrypt.hash(password, 10);
			const _id = new ObjectId();
			const user = new User({
				_id: _id,
				name: name,
				email: email, 
				password: hashed,
			})
			const saved = await user.save();
			// After registering the user, their tokens are generated here so they
			// are automatically logged in on account creation.
			const accessToken = tokens.generateAccessToken(user);
			const refreshToken = tokens.generateRefreshToken(user);
			res.cookie('refresh-token', refreshToken, { httpOnly: true , sameSite: 'None', secure: true}); 
			res.cookie('access-token', accessToken, { httpOnly: true , sameSite: 'None', secure: true}); 
			return user;
		},
		update: async (_, args, { res }) => {
			const { email, password, name } = args;
			const alreadyRegistered = await User.findOne({email: email});
			if(alreadyRegistered) {
				const hashed = await bcrypt.hash(password, 10);
				const updated = await User.updateOne({email: email}, { email: email, password: hashed, name: name });
				if (updated) return true
				else return false
			} else {
				console.log('User not found');
				return 'does not exist';
			}
		},
		logout:(_, __, { res }) => {
			res.clearCookie('refresh-token');
			res.clearCookie('access-token');
			return true;
		}
	}
}