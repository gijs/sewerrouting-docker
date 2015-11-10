/**
 * MapActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var MapConstants = require('../constants/MapConstants');


var MapActions = {

	chartHoverSetsMapPosition: function(data) {
		AppDispatcher.handleViewAction({
			actionType: MapConstants.CHART_HOVER_SET_MAP,
			text: data
		});
	}

};

module.exports = MapActions;