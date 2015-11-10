/**
 * SewerActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var SewerConstants = require('../constants/SewerConstants');


var SewerActions = {

	chartHoverSetsMapPosition: function(data) {
		AppDispatcher.handleViewAction({
			actionType: SewerConstants.CHART_HOVER_SET_MAP,
			text: data
		});
	},
	setProfile: function(data) {
		AppDispatcher.handleViewAction({
			actionType: SewerConstants.SET_PROFILE,
			text: data
		});
	},
	mapClick: function(data) {
		AppDispatcher.handleViewAction({
			actionType: SewerConstants.CLICK_MAP,
			text: data
		});
	},
	setSewerHoverPosition: function(lat, lng) {
		AppDispatcher.handleViewAction({
			actionType: SewerConstants.SET_HOVER_POS,
			text: {'lat': lat, 'lng': lng}
		});
	}

};

module.exports = SewerActions;