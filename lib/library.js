'use strict';

var routes = require('./routes');
var library = module.exports;

library.init = function(params, callback) {
	require('./websockets');
	routes.init(params, callback);
};

library.adminMenu = function(menu, callback) {
	menu.plugins.push({
		route: '/plugins/category-join-group',
		icon: 'fa-pencil',
		name: 'Category Groups'
	});

	callback(null, menu);
};


