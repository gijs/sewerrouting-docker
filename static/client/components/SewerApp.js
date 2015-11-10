/**
 * @jsx React.DOM
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the SewerStore and passes the new data to its children.
 */

var React = require('react');
var SewerStore = require('../stores/SewerStore');
var Map = require('./Map');
var Panel = require('./Panel');
require("!style!css!./SewerApp.css");



function getProfile() {
  return {
    profile: SewerStore.getProfile(),
    showHide: SewerStore.getShowHide()
  };
}


/*
 * Compose and render the actual app (the top level component)
 */
var SewerApp = React.createClass({
  
  getInitialState: function() {
    return {
      panTo: [],
      showhide: 'hidden',
      profile: []
    };
  },

  componentDidMount: function() {
    SewerStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SewerStore.removeChangeListener(this._onChange);
  },

  render: function() {
   return (
      <div className="wrapper">
        <Map />
        <Panel profile={this.state.profile} showHide={this.state.showhide} />
      </div>
   );
  },  


  /**
   * Event handler for 'change' events coming from the SewerStore
   */
  _onChange: function() {
    this.setState(getProfile());
  }


});

module.exports = SewerApp;