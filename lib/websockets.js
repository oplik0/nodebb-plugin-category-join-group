'use strict';


var sockets = require.main.require('./src/socket.io/plugins');
var categoryJoinGroup = require('./categoryJoinGroup');

sockets.categoryJoinGroup = {};

sockets.categoryJoinGroup.join = function(socket, data, callback) {
	if (!socket.uid || !data || !data.cid) {
		return callback(new Error('[[error:invalid-data]]'));
	}
	categoryJoinGroup.join(socket.uid, data.cid, callback);
};

sockets.categoryJoinGroup.leave = function(socket, data, callback) {
	if (!socket.uid || !data || !data.cid) {
		return callback(new Error('[[error:invalid-data]]'));
	}

	categoryJoinGroup.leave(socket.uid, data.cid, callback);
};

sockets.categoryJoinGroup.isMember = function(socket, data, callback) {
	if (!socket.uid || !data) {
		return callback(new Error('[[error:invalid-data]]'));
	}
	if (!data.cid) {
		return callback();
	}
	categoryJoinGroup.isMember(socket.uid, data.cid, callback);
};
sockets.categoryJoinGroup.exists = function(socket, data, callback) {
	if (!socket.uid || !data) {
		return callback(new Error('[[error:invalid-data]]'));
	}
	if (!data.cid) {
		return callback();
	}
	categoryJoinGroup.exists(socket.uid, data.cid, callback)
}