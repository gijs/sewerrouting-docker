/**
 * @jsx React.DOM
 */

var React = require('react');
	React.initializeTouchEvents(true);

var SewerApp = require('./components/SewerApp');

window.React = React; // React DevTools won't work without this

React.renderComponent(
  <SewerApp />, document.getElementById('sewerapp')
);