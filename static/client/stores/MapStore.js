/**
 * MapStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var MapConstants = require('../constants/MapConstants');
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

var _location = [];


function getMapLocation() {
	return _location;
}
function setMapLocation(data) {
	_location = data;
}



var MapStore = merge(EventEmitter.prototype, {
	getMapLocation: function() {
		return _location;
	},
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},
	addChangeListener: function(callback) {
	    this.on(CHANGE_EVENT, callback);
	},
	removeChangeListener: function(callback) {
	    this.removeListener(CHANGE_EVENT, callback);
	}
});

AppDispatcher.register(function(payload) {

	var action = payload.action;
	var text;

	switch(action.actionType) {
		case MapConstants.CHART_HOVER_SET_MAP:
			setMapLocation(action.text);
			break;
		default:
			return true;
	}
	MapStore.emitChange();
	return true;
});


module.exports = MapStore;