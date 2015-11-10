(function() {
	'use strict';

	var L = require('leaflet');
	var $ = require('jquery');
	// Ignore camelcase naming for this file, since OSRM's API uses
	// underscores.
	/* jshint camelcase: false */

	L.Routing = L.Routing || {};

	L.Routing.Sewer = L.Class.extend({
		options: {
			serviceUrl: '/api/v1/route',
			geometryPrecision: 5
		},

		initialize: function(options) {
			L.Util.setOptions(this, options);
			this._hints = {
				locations: {}
			};
		},

		route: function(waypoints, callback, context) {
			var self = this;			
			var url = this._buildRouteUrl(waypoints);

			// L.Routing._jsonp(url, function(data) {
			// 	this._routeDone(data, waypoints, callback, context);
			// }, this, 'jsonp');

	        $.ajax({
	            url: url
	        }).done(function(data) {
	        	self._routeDone(data, waypoints, callback, context);
	        });
			

			return this;
		},

		_routeDone: function(response, waypoints, callback, context) {
			context = context || callback;
			if (response.status !== 0) {
				callback.call(context, {
					status: response.status,
					message: response.message
				});
				return;
			}

			var alts = [{
					name: response.route_name.join(', '),
					coordinates: this._decode(response.route_geometry, this.options.geometryPrecision),
					// instructions: this._convertInstructions(response.route_instructions),
					instructions: [],
					summary: this._convertSummary(response.route_summary),
					waypoints: response.via_points
				}],
			    i;

			if (response.alternative_geometries) {
				for (i = 0; i < response.alternative_geometries.length; i++) {
					alts.push({
						name: response.alternative_names[i].join(', '),
						coordinates: this._decode(response.alternative_geometries[i], this.options.geometryPrecision),
						instructions: this._convertInstructions(response.alternative_instructions[i]),
						summary: this._convertSummary(response.alternative_summaries[i]),
						waypoints: response.via_points
					});
				}
			}

			this._saveHintData(response, waypoints);
			callback.call(context, null, alts);
		},

		_buildRouteUrl: function(waypoints) {
			var locs = [],
			    locationKey,
			    hint;

			for (var i = 0; i < waypoints.length; i++) {
				locationKey = this._locationKey(waypoints[i].latLng);
				locs.push('loc=' + locationKey);

				hint = this._hints.locations[locationKey];
				if (hint) {
					locs.push('hint=' + hint);
				}
			}

			return this.options.serviceUrl + '?' +
				'instructions=true&' +
				locs.join('&') +
				(this._hints.checksum !== undefined ? '&checksum=' + this._hints.checksum : '');
		},

		_locationKey: function(location) {
			return location.lat + ',' + location.lng;
		},

		_saveHintData: function(route, waypoints) {
			var hintData = route.hint_data,
			    loc;
			this._hints = {
				checksum: hintData.checksum,
				locations: {}
			};
			for (var i = hintData.locations.length - 1; i >= 0; i--) {
				loc = waypoints[i].latLng;
				this._hints.locations[this._locationKey(loc)] = hintData.locations[i];
			}
		},

		// Adapted from
		// https://github.com/DennisSchiefer/Project-OSRM-Web/blob/develop/WebContent/routing/OSRM.RoutingGeometry.js
		_decode: function(encoded, precision) {
			var len = encoded.length,
			    index=0,
			    lat=0,
			    lng = 0,
			    array = [];

			precision = Math.pow(10, -precision);

			while (index < len) {
				var b,
				    shift = 0,
				    result = 0;
				do {
					b = encoded.charCodeAt(index++) - 63;
					result |= (b & 0x1f) << shift;
					shift += 5;
				} while (b >= 0x20);
				var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
				lat += dlat;
				shift = 0;
				result = 0;
				do {
					b = encoded.charCodeAt(index++) - 63;
					result |= (b & 0x1f) << shift;
					shift += 5;
				} while (b >= 0x20);
				var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
				lng += dlng;
				//array.push( {lat: lat * precision, lng: lng * precision} );
				array.push( [lat * precision, lng * precision] );
			}
			return array;
		},

		_convertSummary: function(osrmSummary) {
			return {
				totalDistance: osrmSummary.total_distance,
				totalTime: osrmSummary.total_time
			};
		},

		_convertInstructions: function(osrmInstructions) {
			var result = [],
			    i,
			    instr,
			    type,
			    driveDir;

			for (i = 0; i < osrmInstructions.length; i++) {
				instr = osrmInstructions[i];
				type = this._drivingDirectionType(instr[0]);
				driveDir = instr[0].split('-');
				if (type) {
					result.push({
						type: type,
						distance: instr[2],
						time: instr[4],
						road: instr[1],
						direction: instr[6],
						exit: driveDir.length > 1 ? driveDir[1] : undefined,
						index: instr[3]
					});
				}
			}

			return result;
		},

		_drivingDirectionType: function(d) {
			switch (parseInt(d, 10)) {
			case 1:
				return 'Straight';
			case 2:
				return 'SlightRight';
			case 3:
				return 'Right';
			case 4:
				return 'SharpRight';
			case 5:
				return 'TurnAround';
			case 6:
				return 'SharpLeft';
			case 7:
				return 'Left';
			case 8:
				return 'SlightRight';
			case 9:
				return 'WaypointReached';
			case 10:
				// TODO: "Head on"
				// https://github.com/DennisOSRM/Project-OSRM/blob/master/DataStructures/TurnInstructions.h#L48
				return 'Straight';
			case 11:
			case 12:
				return 'Roundabout';
			case 15:
				return 'DestinationReached';
			default:
				return null;
			}
		}
	});

	L.Routing.sewer = function(options) {
		return new L.Routing.Sewer(options);
	};
})();










// (function() {
// 	'use strict';

// 	var L = require('leaflet');
// 	var $ = require('jquery');

// 	L.Routing = L.Routing || {};

// 	L.Routing.Sewer = L.Class.extend({
// 		options: {
// 			serviceUrl: '/api/v1/route'
// 		},

// 		initialize: function(options) {
// 			L.Util.setOptions(this, options);
// 			this._hints = {
// 				locations: {}
// 			};
// 		},

// 		route: function(waypoints, callback, context, options) {
// 			var self = this;
// 			var url = this._buildRouteUrl(waypoints, options);

// 	        $.ajax({
// 	            url: url
// 	        }).done(function(data) {
// 	        	self._routeDone(data, waypoints, callback, context);
// 	        });

// 			return this;
// 		},

// 		_routeDone: function(response, inputWaypoints, callback, context) {
// 			var coordinates = [],
// 			    alts,
// 			    actualWaypoints,
// 			    i;

// 			context = context || callback;

// 			var stringcoords = response.route;

// 			stringcoords.map(function(sc) {
// 				console.log('sc:', sc);
// 				sc.coordinates.map(function(c) {
// 					coordinates.push(c[0], c[1]);
// 				});
// 			});

// 			console.log(coordinates);
// 			actualWaypoints = this._toWaypoints(coordinates);

// 			alts = [{
// 				name: 'test',
// 				coordinates: coordinates,
// 				instructions: this._convertInstructions(),
// 				waypoints: actualWaypoints,
// 				summary: this._convertSummary()
// 			}];
// 			// debugger;
// 			console.log('alts', alts);

// 			if (response.alternative_geometries) {
// 				for (i = 0; i < response.alternative_geometries.length; i++) {
// 					coordinates = response.route;
// 					alts.push({
// 						coordinates: coordinates
// 					});
// 				}
// 			}

// 			this._saveHintData(response, inputWaypoints);
// 			callback.call(context, null, alts);
// 		},

// 		_toWaypoints: function(vias) {
// 			var wps = [],
// 			    i;
// 			for (i = 0; i < vias.length; i++) {
// 				wps.push({
// 					latLng: L.latLng(vias[i])
// 				});
// 			}

// 			return wps;
// 		},

// 		_buildRouteUrl: function(waypoints, options) {
// 			var locs = [],
// 			    computeInstructions,
// 			    computeAlternative,
// 			    locationKey,
// 			    hint;

// 			for (var i = 0; i < waypoints.length; i++) {
// 				locationKey = this._locationKey(waypoints[i].latLng);
// 				locs.push('loc=' + locationKey);

// 				hint = this._hints.locations[locationKey];
// 				if (hint) {
// 					locs.push('hint=' + hint);
// 				}
// 			}

// 			computeAlternative = computeInstructions =
// 				!(options && options.geometryOnly);

// 			return this.options.serviceUrl + '?' + locs.join('&');
// 		},

// 		_locationKey: function(location) {
// 			return location.lat + ',' + location.lng;
// 		},

// 		_saveHintData: function(route, waypoints) {
// 			// var hintData = route.hint_data,
// 			//     loc;
// 			// this._hints = {
// 			// 	checksum: 1830839397,
// 			// 	locations: {}
// 			// };
// 			// for (var i = hintData.locations.length - 1; i >= 0; i--) {
// 			// 	loc = waypoints[i].latLng;
// 			// 	this._hints.locations[this._locationKey(loc)] = hintData.locations[i];
// 			// }
// 		},

// 		// Adapted from
// 		// https://github.com/DennisSchiefer/Project-OSRM-Web/blob/develop/WebContent/routing/OSRM.RoutingGeometry.js
// 		_decode: function(encoded, precision) {
// 			var len = encoded.length,
// 			    index=0,
// 			    lat=0,
// 			    lng = 0,
// 			    array = [];

// 			precision = Math.pow(10, -precision);

// 			while (index < len) {
// 				var b,
// 				    shift = 0,
// 				    result = 0;
// 				do {
// 					b = encoded.charCodeAt(index++) - 63;
// 					result |= (b & 0x1f) << shift;
// 					shift += 5;
// 				} while (b >= 0x20);
// 				var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
// 				lat += dlat;
// 				shift = 0;
// 				result = 0;
// 				do {
// 					b = encoded.charCodeAt(index++) - 63;
// 					result |= (b & 0x1f) << shift;
// 					shift += 5;
// 				} while (b >= 0x20);
// 				var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
// 				lng += dlng;
// 				//array.push( {lat: lat * precision, lng: lng * precision} );
// 				array.push( [lat * precision, lng * precision] );
// 			}
// 			return array;
// 		},

// 		_convertSummary: function() {
// 			return {
// 				totalDistance: 0,
// 				totalTime: 0
// 			};
// 		},

// 		_convertInstructions: function(sewerInstructions) {
// 			// var result = [],
// 			//     i,
// 			//     instr,
// 			//     type,
// 			//     driveDir;

// 			// for (i = 0; i < sewerInstructions.length; i++) {
// 			// 	instr = sewerInstructions[i];
// 			// 	type = this._drivingDirectionType(instr[0]);
// 			// 	driveDir = instr[0].split('-');
// 			// 	if (type) {
// 			// 		result.push({
// 			// 			type: type,
// 			// 			distance: instr[2],
// 			// 			time: instr[4],
// 			// 			road: instr[1],
// 			// 			direction: instr[6],
// 			// 			exit: driveDir.length > 1 ? driveDir[1] : undefined,
// 			// 			index: instr[3]
// 			// 		});
// 			// 	}
// 			// }

// 			return [];
// 		},

// 		_drivingDirectionType: function(d) {
// 			switch (parseInt(d, 10)) {
// 			case 1:
// 				return 'Straight';
// 			case 2:
// 				return 'SlightRight';
// 			case 3:
// 				return 'Right';
// 			case 4:
// 				return 'SharpRight';
// 			case 5:
// 				return 'TurnAround';
// 			case 6:
// 				return 'SharpLeft';
// 			case 7:
// 				return 'Left';
// 			case 8:
// 				return 'SlightRight';
// 			case 9:
// 				return 'WaypointReached';
// 			case 10:
// 				// TODO: "Head on"
// 				// https://github.com/DennisOSRM/Project-OSRM/blob/master/DataStructures/TurnInstructions.h#L48
// 				return 'Straight';
// 			case 11:
// 			case 12:
// 				return 'Roundabout';
// 			case 15:
// 				return 'DestinationReached';
// 			default:
// 				return null;
// 			}
// 		},

// 		_clampIndices: function(indices, coords) {
// 			var maxCoordIndex = coords.length - 1,
// 				i;
// 			for (i = 0; i < indices.length; i++) {
// 				indices[i] = Math.min(maxCoordIndex, Math.max(indices[i], 0));
// 			}
// 		}
// 	});

// 	L.Routing.sewer = function(options) {
// 		return new L.Routing.Sewer(options);
// 	};

// 	module.exports = L.Routing;
// })();