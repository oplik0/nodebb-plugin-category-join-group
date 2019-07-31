'use strict';

var async = require('async');
var winston = require('winston');

var db = require.main.require('./src/database');
var categories = require.main.require('./src/categories');
var groups = require.main.require('./src/groups');
var categoryJoinGroup = {};

categoryJoinGroup.isMember = function(uid, cid, callback) {
	categories.getCategoryById({'cid':cid, 'uid':uid}, function(err, category){
			groups.isPending(uid, category.name, function(err, isPending){
				if(!isPending) {
					groups.isMember(uid, category.name, callback);
				}
				else {
					callback(true)
				}
			});
		});
};

categoryJoinGroup.join = function(uid, cid, callback) {
	categories.getCategoryById({'cid':cid, 'uid':uid}, function(err, category){
		if (!err) {
			groups.isPrivate(category.name, function(err, isPrivate) {
				if(isPrivate) {
					groups.requestMembership(category.name, uid, callback);
				}
				else {
					groups.join(category.name, uid, callback);
				}
			});
		}
	});
};

categoryJoinGroup.leave = function(uid, cid, callback) {
	categories.getCategoryById({'cid':cid, 'uid':uid}, function(err, category){
		if (!err) {
			groups.isPending(uid, category.name, function(err, isPending){
				if(!isPending) {
					groups.leave(category.name, uid, callback);
				}
				else {
					groups.rejectMembership(category.name, uid, callback);
				}
			});
		}
	});
};

categoryJoinGroup.onUserDelete = function (data) {
	async.waterfall([
		function (next) {
			db.getSortedSetRange('categories:category-name', 0, -1, next);
		},
		function (cids, next) {
			async.eachSeries(cids, function (cid, next) {
				categoryJoinGroup.leave(data.uid, cid, next);
			}, next);
		}
	], function (err) {
		if (err) {
			winston.error(err);
		}
	});
};

categoryJoinGroup.exists = function(uid, cid, callback) {
	categories.getCategoryById({'cid':cid, 'uid':uid}, function(err, category){
		if (!err){
			groups.exists(category.name, callback);
		}
	});
};
module.exports = categoryJoinGroup;
