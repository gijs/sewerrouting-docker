/**
 * SewerStore
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var SewerConstants = require('../constants/SewerConstants');
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

var _scenario = 1;
var _distance = 0;
var _mapClickedObj = {};
var _profile = [];
var _location = [];
var _bottomlevelprofile = [];
var _lengthprofile = [];
var _hideshow = 'hidden';

function setMapClickedObject(object) {
	_mapClickedObj = object;
}

function getProfile() {
	return _profile;
}
function setProfile(data) {
	_profile = data;
}

function getMapLocation() {
	return _location;
}
function setMapLocation(data) {
	_location = data;
}


function getShowHide() {
	if(_profile.profile.length === 0) {
		_hideshow = 'hidden';
	} else{
		_hideshow = 'show';
	}
	return _hideshow;
}

var SewerStore = merge(EventEmitter.prototype, {
	getShowHide: function() {
		return _hideshow;
	},
	getProfile: function() {
		return _profile;
	},
	getMapLocation: function() {
		return _location;
	},
	getMapClickedObject: function() {
		return _mapClickedObj;
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
		case SewerConstants.CHART_HOVER_SET_MAP:
			setMapLocation(action.text);
			break;
		case SewerConstants.SET_PROFILE:
			setProfile(action.text);
			break;
		case SewerConstants.CLICK_MAP:
			setMapClickedObject(action.text);
			break;
		default:
			return true;
	}
	SewerStore.emitChange();
	return true;
});


module.exports = SewerStore;