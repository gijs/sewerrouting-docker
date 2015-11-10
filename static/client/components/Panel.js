/**
 * @jsx React.DOM
 */

var SewerActions = require('../actions/SewerActions');
var MapActions = require('../actions/MapActions');
var React = require('react');
var ReactPropTypes = React.PropTypes;
var d3 = require('d3');
var $ = require('jquery');
var _ = require('lodash');
var Chartist = require('chartist');
var c3 = require('c3');

var ModalTrigger = require('react-bootstrap').ModalTrigger;
var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;
var TabbedArea = require('react-bootstrap').TabbedArea;
var TabPane = require('react-bootstrap').TabPane;
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;

require("!style!css!./Panel.css");
require("!style!css!../node_modules/chartist/libdist/chartist.min.css");

var debug = require('debug')('Panel.js');

var Panel = React.createClass({

    getInitialState: function() {
    	return {
    		showHide: 'hidden',
    		height: 200
    	};
    },
    componentDidUpdate: function() {
    	var self = this;

    	var surfacelevelArray = self.props.profile.surface_level || [];
    	var bottomlevelArray = self.props.profile.bottom_level || [];
    	var lengthprofileArray = self.props.profile.length_profile || [];
    	var pipeDiameterArray = self.props.profile.pipe_diameter || [];

    	var bobStartArray = self.props.profile.bob_start || [];
    	var bobEndArray = self.props.profile.bob_end || [];
		var bbbStartArray = self.props.profile.bbb_start || [];
		var bbbEndArray = self.props.profile.bbb_end || [];

		var displaynamesArray = self.props.profile.display_names || [];
		var coordinatesArray = self.props.profile.route_coordinates || [];

		var chart = c3.generate({
			size: {
				height: (this.state.height-20)
			},
			axis: {
				y: {
					tick: {
						format: function (y) {
							return y.toFixed(2);
						}
					}
				},
				x: {
					tick: { 
						format: function (x) { 
							return displaynamesArray[x];
						} 
					}
				}
			},
		    data: {
		    	onmouseover: function(x) {
		            window.map.panTo([coordinatesArray[x.x][1], coordinatesArray[x.x][0]], {
		            	animate: false
		            });
		    	},
		        columns: [
		            $.merge(['Maaiveld (mNAP)'], surfacelevelArray),
		            $.merge(['Bovenkant buis'], bbbStartArray),
		            $.merge(['Diameter (m)'], pipeDiameterArray),
		            $.merge(['BOB'], bobStartArray),
		        ],
		        types: {
		            'Maaiveld (mNAP)': 'area-step',
		            'BBB': 'line',
		            'Diameter (m)': 'line',
		            'BOB': 'line'
		            // 'line', 'spline', 'step', 'area', 'area-step' are also available to stack
		        }
		    },
		    zoom: {
		    	enabled: true
		    }
		});	
    },
    enlargeChartPanel: function() {
    	if(this.state.height === 500) {
	    	this.setState({
	    		height: 200
	    	});    		
    	} else {
	    	this.setState({
	    		height: 500
	    	});    		
    	}
    },
	render: function() {
		var showhideclass = 'hidden';
		if(this.props.profile.length_profile && this.props.profile.length_profile.length > 0) {
			showhideclass = 'show';
		} else {
			showhideclass = 'hidden';
		}
		return (
			<div className={showhideclass} id="panel" style={{height: this.state.height}}>
					<Row>
						<Col xs={10} md={11}>
				            <div id="chart" className="chart ct-chart ct-perfect-fourth"></div>
						</Col>					
						<Col xs={2} md={1}>
				            <Button onClick={this.enlargeChartPanel}>
				              <i style={{cursor: 'pointer'}} className="fa fa-arrows-alt" />
				            </Button>						
				            <ModalTrigger modal={<InfoModal />}>
				              <Button>
				              	<i style={{cursor: 'pointer'}} className="fa fa-info-circle" />
				              </Button>
				            </ModalTrigger>
						</Col>
					</Row>
			</div>
		)
	}
});


var InfoModal = React.createClass({
  render: function() {
    return this.transferPropsTo(
        <Modal title="Lizard NXT: Sewer Routing Experiment" animation={true}>
          <div className="modal-body">

            <h3>Doel</h3>
            <p>Het doel van deze app is om te onderzoeken wat de visualisatie- en analysemogelijkheden zijn met de data van nederlandse rioolstelsels</p>

            <h3>Details:</h3>
            <ul>
              <li>Data is opgeslagen in een spatialite database</li>
              <li>Routering met Dijkstra of A-Star algoritme</li>
              <li>Achtergrondkaarten via <a href="http://www.mapbox.com/">Mapbox</a></li>
              <li>Rioolstelsel wordt met <a href="http://mapnik.org/">Mapnik</a> gerenderd</li>
              <li>Back-end is <a href="http://flask.pocoo.org/">Flask</a></li>
              <li>Front-end is <a href="http://facebook.github.io/react/">React</a> + <a href="http://webpack.github.io/">webpack</a> + <a href="http://d3js.org/">D3.js</a> + <a href="http://leafletjs.com/">Leaflet.js</a> e.a.</li>
              <li>Sourcecode op <a href="https://github.com/nens/rioolroutes/tree/master/sewerouting">github</a></li>
            </ul>

            <h4>Browsers</h4>
            <p>Om de applicatie goed te kunnen gebruiken raden we een recente versie aan van Google Chrome, Mozilla Firefox of Safari. De app werkt goed op iPads en iPhones</p>

            <h4>Credits</h4>
            <ul>
              <li><a href="http://www.nelen-schuurmans.nl/">Nelen &amp; Schuurmans</a></li>
              <li><a href="http://www.mapnik.org/">Mapnik</a></li>
              <li><a href="http://www.leafletjs.com/">Leaflet</a></li>
              <li><a href="http://d3js.org/">D3</a></li>
            </ul>                           
          </div>

          <div className="modal-footer">
            <Button onClick={this.props.onRequestHide}>Sluiten</Button>
          </div>
        </Modal>
      );
  }
});
   

module.exports = Panel;