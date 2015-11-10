/**
 * @jsx React.DOM
 */

require("!style!css!./Map.css");
require("!style!css!../node_modules/leaflet-routing-machine/css/leaflet-routing-machine.css");

var SewerActions = require('../actions/SewerActions');
var React = require('react');
var ReactPropTypes = React.PropTypes;
var Popover = require('react-bootstrap').Popover;
var Table = require('react-bootstrap').Table;
var mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
var d3 = require('d3');
var $ = require('jquery');

var debug = require('debug')('Map.js');

mapboxgl.accessToken = 'pk.eyJ1IjoibmVsZW5zY2h1dXJtYW5zIiwiYSI6ImhkXzhTdXcifQ.3k2-KAxQdyl5bILh_FioCw';


var Map = React.createClass({

	getDefaultProps: function () {
	   return {};
	},

	componentDidMount: function() {
		var map = new mapboxgl.Map({
		    container: 'map',
		    style: 'mapbox://styles/mapbox/streets-v8',
		    center: [4.9688,52.5034],
		    zoom: 13
		});
		map.addControl(new mapboxgl.Navigation());

		map.on('style.load', function () {
			$.ajax({
				url: "/api/v1/network",
				cache: false
			})
			.done(function( network ) {
				// debugger;
				var network = {
				  "type": "FeatureCollection",
				  "features": network.features
				};
			    map.addSource("network", {
			    	"type": "geojson",
			    	"data": network
			    });			
			    map.addLayer({
			        "id": "network",
			        "type": "line",
			        "source": "network",
			        "layout": {
			            "line-join": "round",
			            "line-cap": "round"
			        },
			        "paint": {
			            "line-color": "#888",
			            "line-width": 1
			        }
			    });			    
			});			
			$.ajax({
				url: "/api/v1/manholes",
				cache: false
			})
			.done(function( manholes ) {
				// debugger;
				var manholes = {
				  "type": "FeatureCollection",
				  "features": manholes.features
				};
			    map.addSource("markers", {
			    	"type": "geojson",
			    	"data": manholes
			    });			
			    map.addLayer({
			        "id": "markers",
			        "type": "symbol",
		            "interactive": true,
			        "source": "markers",
			        "layout": {
						"icon-image": "circle-15"
			        }
			    });		
			    map.update();	    
			});						
		});

	    map.on('mousemove', function (e) {
	        map.featuresAt(e.point, {radius: 5}, function (err, features) {
	            if (err) throw err;
	            // console.log(features);
                var ids = features.map(function (feat) { return feat.properties.id });
                console.log('--->', ids);
     //            if(ids.length > 0) {
     //            	// debugger;
					// map.setFilter('markers', [ 'all', ids[0]]);
     //            }
               

	        });
	    });


		window.map = this.map;
	},
	render: function() {
		return (
			<div className="mapwrapper">
				<div className="Map" id="map"></div>		
			</div>
		)
	}
});

module.exports = Map;