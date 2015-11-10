#pipe_quality [zoom > 14] {
  [zoom > 14] ::pipe_quality_far {
    line-dasharray: 4, 4;
    line-cap: butt;
    line-opacity: 0.4;
    [result = 1] { line-color: lighten(@unreliable, 20%);}
    [result = 2] { line-color: @unreliable;}
  	line-offset: 2;
  	line-width: 1;
  } [zoom >= 17] ::pipe_quality_close {
    line-dasharray: 4, 4;
    line-cap: butt;
    line-opacity: 0.4;
    [result = 1] { line-color: lighten(@unreliable, 20%);}
    [result = 2] { line-color: @unreliable;}
    line-offset: 4;
    line-width: 3;
  }
}

#manhole_quality [zoom > 15] {
  marker-fill: @unreliable;
  marker-line-color: darken(@unreliable, 2%);
  marker-allow-overlap:true;
  marker-opacity: 0.1;
  marker-width: 8;
}