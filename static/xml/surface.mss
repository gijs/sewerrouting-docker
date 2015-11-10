/**
 * Surface objects
 */

/**
 * Channels (Dutch: waterlopen)
 */
#channel [zoom > 7] {
  ::smooth {
    line-width: 0;
    line-smooth: 0.5;
    line-color: @openwater;
    line-opacity: 0.5;
    [zoom > 11] { line-width: 1; }
    [zoom > 12] { line-width: 2; }
  }
}

#channel [zoom > 16] {
  line-width: 1;
  line-color: darken(@openwater, 20%);
  line-dasharray: 10, 5;
}

#channelsurface [zoom > 14] {
  polygon-fill: @openwater;
  polygon-smooth: 0.5;
  polygon-pattern-file: url("../../patterns/white_wave.png");
  polygon-pattern-alignment: global;
  polygon-pattern-opacity: 0.5;
  polygon-pattern-smooth: 0.5;
  line-smooth: 0.5;
  line-color: darken(@openwater, 10%);
  line-width: 1;
  [zoom > 15] {
    line-width: 3;
   }
}
/**
 * Fixed drainage level area (Dutch: peilgebied)
 */
#fixeddrainagelevelarea::land-glow-inner [zoom >= 14][zoom < 16] {
  line-color: desaturate(@border, 5%);
  line-opacity:0.5;
  line-join:round;
  [zoom=14] { 
    line-width:2;
    line-dasharray: 10, 5;
  }
  [zoom>14] { 
    line-width:2.4;
    line-dasharray: 12, 6;
  }
}

#fixeddrainagelevelarea::land-glow-outer[zoom >= 14][zoom < 16] { 
  line-color:desaturate(@border, 5%);
  line-width:2;
  line-opacity:0.1;
  line-join:round;
}

#fixeddrainagelevelarea::tintbands [zoom >= 14][zoom < 16] {
  image-filters: agg-stack-blur(3,3);
  line-color:desaturate(@border, 5%);
  opacity: 0.3;
  line-join: round;
  [zoom > 14] {
    line-width: 5.5;
  }
  [zoom > 15] {
    line-width: 6.5;
  }
}

/**
 * Impervious surface (Dutch: werhard oppervlak)
 */
#impervioussurface [zoom > 16] {
  polygon-pattern-file: url("../../patterns/lined_paper.png");
  polygon-pattern-alignment: global;
  polygon-pattern-opacity: 0.5;
  polygon-pattern-smooth: 0.3;
  line-smooth: 0.3;
  line-color: darken(@building, 10%);
  line-width: 1;
  [zoom > 17] {
    line-width: 2;
  }
}

/**
 * Lakes (Dutch: meren)
 */
#lakes [zoom > 7] {
  ::main {
    line-color:darken(lightblue, 20%);
    [zoom > 10] { line-width:2; }
    polygon-fill: @openwater;
    polygon-smooth: 0.5;
    line-smooth: 0.5;
    polygon-gamma: 0.3;
    }
  ::smooth [zoom > 10] {
    line-width: 0;
    [zoom > 12] { line-width: 6; }
    line-smooth: 0.5;
    line-color:darken(lightblue, 20%);
    line-opacity: 0.3;
    [FUNCTIE = 'waterzuivering'] {
      polygon-pattern-file: url("../../icons/diagonal-noise.png");
      comp-op: overlay;
      }
    }
}

/**
 * Pumped drainage area (Dutch: bemalingsgebied)
 */
#pumpeddrainagearea::land-glow-inner [zoom >= 12][zoom < 17] { 
  line-color: saturate(@border, 5%);
  line-opacity:0.5;
  line-join:round;
  [zoom=12] { 
    line-width:1.2;
    line-dasharray: 1.2, 2.4;
  }
  [zoom=13] { 
    line-width:1.6;
    line-dasharray: 1.6, 3.2;
  }
  [zoom=14] { 
    line-width:2;
    line-dasharray: 2, 4;
  }
  [zoom>14] { 
    line-width:2.4;
    line-dasharray: 2.4, 4.8;
  }
}

#pumpeddrainagearea::land-glow-outer[zoom >= 12][zoom < 17] { 
  line-color:saturate(@border, 5%);
  line-width:2;
  line-opacity:0.1;
  line-join:round;
  line-dasharray: 4, 6;
}


/**
 * Administrative Boundary (Dutch: bestuurlijke grens)
 */
#administrativeboundary::land-glow-inner [zoom>6][zoom<20] {
  [type=4][zoom>6][zoom<9] {
    line-color: desaturate(@border, 5%);
    line-opacity:1;
    line-join:round;
    line-width:3;
    line-dasharray: 15, 10;
  }
  [type=2][zoom>8][zoom<12] {
    line-color: desaturate(@border, 5%);
    line-opacity:1;
    line-join:round;
    line-width:3;
    line-dasharray: 15, 10;
  }
  [type=3][zoom>11][zoom<17] {
    line-color: desaturate(@border, 5%);
    line-opacity:1;
    line-join:round;
    line-width:3;
    line-dasharray: 15, 10;
  }
}

