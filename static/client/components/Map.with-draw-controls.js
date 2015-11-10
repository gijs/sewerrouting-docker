/**
 * @jsx React.DOM
 */

require("!style!css!./Map.css");
var SewerActions = require('../actions/SewerActions');
var React = require('react');
var ReactPropTypes = React.PropTypes;
var Popover = require('react-bootstrap').Popover;
var Table = require('react-bootstrap').Table;
var d3 = require('d3');
var $ = require('jquery');
var L = require('leaflet');
require('../utils/leaflet.utfgrid');
require('../utils/leaflet.almostover');
require('leaflet-geometryutil');
require('leaflet-draw');
require('leaflet-hash');


/*
 * Customizing Leaflet
 */

// L.Map.BoxZoom.prototype._onMouseUp = function(e) {
// 	console.log('overriding _onMouseUp!');
// 	this._finish();
// 	if (!this._moved) { return; }
// };

L.Map.mergeOptions({
    almostOver: true
});


L.Handler.AlmostOver = L.Handler.extend({

    includes: L.Mixin.Events,

    options: {
        distance: 25,   // pixels
        samplingPeriod: 50,  // ms
    },

    initialize: function (map) {
        this._map = map;
        this._layers = [];
        this._previous = null;
        this._marker = null;
        this._buffer = 0;

        // Reduce 'mousemove' event frequency
        this.__mouseMoveSampling = (function () {
            var timer = new Date();
            return function (e) {
                var date = new Date(),
                    filtered = (date - timer) < this.options.samplingPeriod;
                if (filtered || this._layers.length === 0) {
                    return;  // Ignore movement
                }
                timer = date;
                this._map.fire('mousemovesample', {latlng: e.latlng});
            };
        })();
    },

    addHooks: function () {
        this._map.on('mousemove', this.__mouseMoveSampling, this);
        this._map.on('mousemovesample', this._onMouseMove, this);
        this._map.on('click dblclick', this._onMouseClick, this);

        var map = this._map;
        function computeBuffer() {
            this._buffer = this._map.layerPointToLatLng([0, 0]).lat -
                           this._map.layerPointToLatLng([this.options.distance,
                                                         this.options.distance]).lat;
        }
        this._map.on('viewreset zoomend', computeBuffer, this);
        this._map.whenReady(computeBuffer, this);
    },

    removeHooks: function () {
        this._map.off('mousemovesample');
        this._map.off('mousemove', this.__mouseMoveSampling, this);
        this._map.off('click dblclick', this._onMouseClick, this);
    },

    addLayer: function (layer) {
        if (typeof layer.eachLayer == 'function') {
            layer.eachLayer(function (l) {
                this.addLayer(l);
            }, this);
        }
        else {
            if (typeof this.indexLayer == 'function') {
                this.indexLayer(layer);
            }
            this._layers.push(layer);
        }
    },

    removeLayer: function (layer) {
        if (typeof layer.eachLayer == 'function') {
            layer.eachLayer(function (l) {
                this.removeLayer(l);
            }, this);
        }
        else {
            if (typeof this.unindexLayer == 'function') {
                this.unindexLayer(layer);
            }
            var index = this._layers.indexOf(layer);
            this._layers.splice(index, 1);
        }
    },

    getClosest: function (latlng) {
        var snapfunc = L.GeometryUtil.closestLayerSnap,
            distance = this.options.distance;

        var snaplist = [];
        if (typeof this.searchBuffer == 'function') {
            snaplist = this.searchBuffer(latlng, this._buffer);
        }
        else {
            snaplist = this._layers;
        }
        return snapfunc(this._map, snaplist, latlng, distance, false);
    },

    _onMouseMove: function (e) {
        var closest = this.getClosest(e.latlng);
        if (closest) {
            if (!this._previous) {
                this._map.fire('almost:over', {layer: closest.layer,
                                               latlng: closest.latlng});
            }
            else if (L.stamp(this._previous.layer) != L.stamp(closest.layer)) {
                this._map.fire('almost:out', {layer: this._previous.layer});
                this._map.fire('almost:over', {layer: closest.layer,
                                               latlng: closest.latlng});
            }

            this._map.fire('almost:move', {layer: closest.layer,
                                           latlng: closest.latlng});
        }
        else {
            if (this._previous) {
                this._map.fire('almost:out', {layer: this._previous.layer});
            }
        }
        this._previous = closest;
    },

    _onMouseClick: function (e) {
        var closest = this.getClosest(e.latlng);
        if (closest) {
            this._map.fire('almost:' + e.type, {layer: closest.layer,
                                                latlng: closest.latlng});
        }
    },
});

if (L.LayerIndexMixin !== undefined) {
    L.Handler.AlmostOver.include(L.LayerIndexMixin);
}

L.Map.addInitHook('addHandler', 'almostOver', L.Handler.AlmostOver);


var Map = React.createClass({

	getDefaultProps: function () {
	   return {
	     drawControlPosition: 'topleft',
	     latlng: [
			52.5032, 4.9615	     	
	     ],
	     zoom: 14,
	     baseLayers: [
	     	{
				mapbox: L.tileLayer('http://{s}.tiles.mapbox.com/v3/nelenschuurmans.iaa98k8k/{z}/{x}/{y}.png', {
				    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
				    maxZoom: 22,
				    detectRetina: false
				}),
				satellite: L.tileLayer('http://{s}.tiles.mapbox.com/v3/nelenschuurmans.iaa79205/{z}/{x}/{y}.png', {
				    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
				    maxZoom: 19,
				    detectRetina: false
				}),
				oilslick: L.tileLayer('http://s3.amazonaws.com/oilslick/{z}/{x}/{y}.jpg', {
					attribution: 'Drew Roos',
					maxZoom: 11,
					detectRetina: false
				})
			}
	     ],
	     layers: [
	     	{
				sewer_network: L.tileLayer('/tiles/vector-sewer/{z}/{x}/{y}.png', {
				    maxZoom: 22,
				    detectRetina: false,
				    attribution: '&copy; <a href="http://www.nelen-schuurmans.nl/">Nelen &amp; Schuurmans</a>'
				})
	     	}
	     ]
	   };
	},
	handleGridClick: function(data) {
		// console.log('handleGridClick()!', data);
	    SewerActions.mapClick(data);
		return false; // Same as preventDefault()
	},
	componentDidMount: function() {

		window.distance = 1;
		window.max = 500;
		window.zoomToRoute = false;

		var from_data, to_data;
		var from_name, to_name;
		var routes = [];
		var start_popups = [];
		var end_popups = [];
		var circles = [];
		var startcircles = [];
		var mapClicked = 1;
		var startingPoint, finishPoint;

		// Instruct Leaflet to prefer canvas rendering
		window.L.PREFER_CANVAS = true; 


		this.map = L.map(this.getDOMNode(), {
			layers: [
				this.props.baseLayers[0].mapbox, 
				this.props.layers[0].sewer_network
			]
		}).setView(this.props.latlng, this.props.zoom);	

		window.map = this.map;


		var manholes_grid = new L.UtfGrid('/tiles/vector-grid/{z}/{x}/{y}.json', {
		    useJsonP: false,
		    maxZoom: 22
		});

		map.on('move', function(e) {
			$("#tooltip").hide();
		});

		// var handleGridClick = this.handleGridClick;
		manholes_grid.on('click', function (e) {  
			if(!e.data) return;
			var point = map.latLngToContainerPoint(e.latlng);
			var title = {title: e.data.display_name};
			var friction_type = {friction_type: e.data.friction_type};
			var friction_value = {friction_value: e.data.friction_value};
			var manhole_start_id = {manhole_start_id: e.data.manhole_start_id};
			var manhole_end_id = {manhole_end_id: e.data.manhole_end_id};

			var holderStyle = {height: 120};

			var popoverInstance = (
			    <div style={holderStyle}>
			      <Popover placement="right" positionLeft={point.x+5} positionTop={point.y-$("#tooltip").height()} title={title}>
			        <Table striped bordered hover>
			        	<tbody>
				        	<tr><td>Friction type</td><td>{friction_type}</td></tr>
				        	<tr><td>Friction value</td><td>{friction_value}</td></tr>
				        	<tr><td>Manhole start ID</td><td>{manhole_start_id}</td></tr>
				        	<tr><td>Manhole end ID</td><td>{manhole_end_id}</td></tr>
			        	</tbody>
					</Table>
			      </Popover>
			    </div>
			  );

			var html = "";
	        
	        html += "<label>" + e.data.display_name +" - "+ e.data.manhole_start_id + "</label>";
	        
	        $("#tooltip").html(html);

	        

			React.renderComponent(popoverInstance, document.getElementById('tooltip'));			
			$("#tooltip").show();
		});

		this.map.addLayer(manholes_grid);


		var MyCustomStartMarker = L.Icon.extend({
		    options: {
			    // iconRetinaUrl: '/static/client/images/marker-start-2x.png',
			    iconAnchor: [15, 47],
			    popupAnchor: [-3, -40],
		        iconUrl: '/static/client/images/marker-start.png',
		        shadowUrl: '/static/client/images/marker-shadow.png'
		    }
		});

		var MyCustomEndMarker = L.Icon.extend({
		    options: {
			    // iconRetinaUrl: '/static/client/images/marker-start-x2.png',
			    iconAnchor: [15, 47],
			    popupAnchor: [-3, -40],
		        iconUrl: '/static/client/images/marker-end.png',
		        shadowUrl: '/static/client/images/marker-shadow.png'
		    }
		});

		var drawControl = new L.Control.Draw({
		    draw: {
		        position: this.props.drawControlPosition,
		        circle: false,
		        rectangle: false,
		        polyline: false,
		        marker: {
		        	draggable: true,
		        	icon: new MyCustomStartMarker()
		        },
		        polygon: false // {
		            // allowIntersection: false,
		            // drawError: {
		                // color: '#b00b00',
		                // timeout: 1000
		            // },
		            // shapeOptions: {
		                // color: 'teal',
		                // fillOpacity: 0.7
		            // }
		        // }
		    },
		    edit: false
		});

		var drawnItems = new L.FeatureGroup();
		map.addLayer(drawnItems);		

		var markersArray = [];

		var sewerStyle = {
		    "color": "#000",
		    "weight": 5,
		    "opacity": 0.8
		};

		map.on('draw:created', function (e) {

		    var type = e.layerType,
		        layer = e.layer;

		    if (type === 'marker') {

		    	markersArray.push(e);

		    	if(markersArray.length % 2 === 0) {

		    		to_data = {
		    			'latto': e.layer._latlng.lat,
		    			'lngto': e.layer._latlng.lng
		    		};

			        $.ajax({
			            url: "/api/v1/computeroute?latfrom=" + 
			            	from_data.latfrom + 
			            	"&lngfrom=" + 
			            	from_data.lngfrom + 
			            	"&latto=" + 
			            	to_data.latto + 
			            	"&lngto=" + 
			            	to_data.lngto
			        }).done(function(data) {
						var lines = L.geoJson(data.route, { style: sewerStyle }).addTo(map);
						// map.fitBounds(lines.getBounds());
						map.almostOver.addLayer(lines);
						var circle = L.circleMarker([0, 0], {radius: 5, fillColor: 'white', fillOpacity: 1});

						map.on('almost:over', function (e) {
							map.addLayer(circle);
							e.layer.setStyle({color: 'orange'});
						});

						map.on('almost:move', function (e) {
							circle.setLatLng(e.latlng);
							// console.log('Moved on active segment, update graph: ', e.latlng);
							// SET POSITION IN A FLUX STORE HERE!!
							// SewerActions.setSewerHoverPosition(e.latlng.lat, e.latlng.lng);

						});

						map.on('almost:out', function (e) {
							$("#tooltip").hide();
							map.removeLayer(circle);
							e.layer.setStyle({weight: 5, color: '#000'});
						});

						map.on('almost:click', function (e) {
							e.layer.setStyle({weight: 10});
							console.log('Set graph to this segment:', e);
							SewerActions.setSewerHoverPosition(e.latlng.lat, e.latlng.lng);
						});
			        });

		    	} else {
		    		from_data = {
		    			'latfrom': e.layer._latlng.lat,
		    			'lngfrom': e.layer._latlng.lng
		    		};
		    	}
		    }
		    drawnItems.addLayer(layer);
		});

		this.map.addControl(drawControl);  
		var hash = new L.Hash(this.map);		    

		function clearMap() {
		    // Clears map of all layers, markers, lines and such.
		    for(i in map._layers) {
		        if(map._layers[i]._path != undefined) {
		            try {
		                map.removeLayer(map._layers[i]);
		            }
		            catch(e) {
		                console.log("Problem with " + e + map._layers[i]);
		            }
		        }
		    }
		}
		function clearRoutes() {
		    // Reset costs
		    route_cost = 0.0;

		    // Removes route polygons from map
		    for(var i in routes) { map.removeLayer(routes[i]); }
		    for(var i in start_popups) { map.removeLayer(start_popups[i]); }
		    for(var i in end_popups) { map.removeLayer(end_popups[i]); }
		}


		var baseLayers = {
		    "Topo": this.props.baseLayers[0].mapbox,
		    "Satellite": this.props.baseLayers[0].satellite
		    // "Oilslick": this.props.baseLayers[0].oilslick
		};

		var overlays = {
			"Riool": this.props.layers[0].sewer_network
		};


		L.control.layers(baseLayers, overlays).addTo(this.map);

		this.map.on('boxzoomend', function(e) {
			console.log('boxzoomend!!', e);
		});	
	},
	render: function() {
		return (
			<div className="mapwrapper">
				<div className="Map" id="map"></div>
			    <div className="alert alert-info" id="tooltip">
			      <p>Tooltip</p>
			    </div> 				
			</div>
		)
	}
});

module.exports = Map;