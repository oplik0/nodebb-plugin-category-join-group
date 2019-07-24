'use strict';

var async = require('async');
var winston = require('winston');

var nconf = require.main.require('nconf');
var db = require.main.require('./src/database');
var meta = require.main.require('./src/meta');
var emailer = require.main.require('./src/emailer');
var notifications = require.main.require('./src/notifications');

var categoryNotifications = {};

categoryNotifications.isSubscribed = function(uid, cid, callback) {
	db.isSortedSetMember('cid:' + cid + ':subscribed:uids', uid, callback);
};

categoryNotifications.subscribe = function(uid, cid, callback) {
	db.sortedSetAdd('cid:' + cid + ':subscribed:uids', Date.now(), uid, callback);
};

categoryNotifications.unsubscribe = function(uid, cid, callback) {
	db.sortedSetRemove('cid:' + cid + ':subscribed:uids', uid, callback);
};


module.exports = categoryNotifications;
