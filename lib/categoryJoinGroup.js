'use strict';

var async = require('async');
var winston = require('winston');

var db = require.main.require('./src/database');
var categories = require.main.require('./src/categories');
var groups = require.main.require('./src/groups');
var categoryJoinGroup = {};

categoryJoinGroup.isMember = function(uid, cid, callback) {
	categories.getCategoryById({'cid':cid, 'uid':uid}, function(err, category){
		db.isSortedSetMember('category-name:' + category.name + ':member:uids', uid, callback);
	});
};

categoryJoinGroup.join = function(uid, cid, callback) {
	categories.getCategoryById({'cid':cid, 'uid':uid}, function(err, category){
		if (!err) {
			groups.join(category.name, uid, function(err) {
				if (!err) {
					db.sortedSetAdd('category-name:' + category.name + ':member:uids', Date.now(), uid, callback);
				}
			});
		}
	});
};

categoryJoinGroup.leave = function(uid, cid, callback) {
	categories.getCategoryById({'cid':cid, 'uid':uid}, function(err, category){
		if (!err) {
			groups.leave(category.name, uid, function(err) {
				if (!err) {
					db.sortedSetRemove('category-name:' + category.name + ':member:uids', uid, callback);
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

module.exports = categoryJoinGroup;
