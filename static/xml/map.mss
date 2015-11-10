/**
 * Map settings and global variables
 */
@land-color: #EBEBEB;
@water-color: #73b6e6;

@mixed : #d35400;
@rain : lighten(#2c3e50, 20%);
@waste : #c0392b;
@pressure: #2c3e50;
@object: #e74c3c;
@sw-object: #e74c3c;
@openwater: #3599db;
@openwater_light: #58c1b8;
@border: darken(grey, 20%);

/**
 * Impervious surface
 */
@building: #ecf0f1;
@streetsurface: lighten(#bdc3c7, 10%);

/**
 * Quality
 */
@uncertain: spin(#d35400, -10);
@unreliable: #c0392b;

Map {
  font-directory: url('../fonts');
}

/* fallback style for new objects*/
#fallback-point {
  shield-name: "'\xee\x80\x86'";
  shield-face-name: 'structures Medium';
  shield-size: 12;
  shield-fill: @object;
  shield-file:url("../../shields/shield-m.png");
  shield-allow-overlap: true;
  }

#fallback-polyline {
  line-width: 2.5;
  line-color: @object;
}

#fallback-polygon {
  polygon-fill: @object;
  polygon-opacity: 0.10;
  line-width: 1;
  line-color: @object;
  line-opacity: 0.40;
  }