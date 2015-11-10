/**
 * Structures (Dutch: kunstwerken)
 */

#bridge  [zoom > 15] {
  marker-file:url("../../shields/shield-m.png");
  marker-allow-overlap: true;
  text-name: "'\xee\x80\x82'";
  text-face-name: 'structures Medium';
  text-size: 14;
  text-fill: @object;
  text-allow-overlap: true;
  text-halo-fill: @object;
  text-halo-radius: 0.1;
  [zoom > 16] {
    marker-file:url("../../shields/shield-l.png");
    text-size: 18;
  }
}

#culvert[zoom > 15] {
    line-dasharray: 3,2;
    line-width: 1;
    line-color: darken(grey, 40%);
    line-cap: butt;
    [zoom > 16] { line-width: 5; }
  [type='Mogelijke verbinding (secundair)'] {
    line-color: darken(grey, 10%);
    [zoom > 16] { line-width: 4; }
    }
  [type='Mogelijke verbinding (tertiair)'] {
    line-color: darken(grey, 10%);
      [zoom > 16] { line-width: 4; }
  }
}

#levee [zoom > 6] {
  [type=1] [zoom > 6] {
    line-dasharray: 2, 6;
    line-width: 4;
    line-cap: round;
    line-color: @pressure;
  }
  
  [type=2] [zoom > 10] {
    line-dasharray: 2, 4;
    line-cap: round; 
    line-width: 2;
    line-color: lighten(@pressure, 20%);
  }
}

#pumpstation [zoom > 7] {
  [type='Boezemgemaal'] {
    marker-file:url("../../shields/shield-l.png");  
    marker-allow-overlap: true;
    text-name: "'\xee\x80\x8c'";
    text-face-name: 'structures Medium';
    text-size: 17;
    text-fill: @object;
    text-allow-overlap: true;
    /*
    [zoom > 10] {
      marker-file:url("../../shields/shield-xl.png");
      text-size: 24;
    }
    */
  }
  [zoom > 12] {
    [type='Rioolgemaal'][capacity > 0]{
      marker-file:url("../../shields/shield-m.png");
      marker-allow-overlap: true;
      text-name: "'\xee\x80\x8b'";
      text-face-name: "structures Medium";
      text-size: 18;
      text-fill: @object;
      text-allow-overlap: true;
    }
    [type='Poldergemaal'] {
      marker-file:url("../../shields/shield-l.png");
      marker-allow-overlap: true;
      text-name: "'\xee\x80\x8c'";
      text-face-name: 'structures Medium';
      text-size: 18;
      text-fill: @sw-object;
      text-allow-overlap: true;
    }
  }
  [zoom > 14] {
    [type='Rioolgemaal']{
      marker-file:url("../../shields/shield-m.png");
      marker-allow-overlap: true;
      text-name: "'\xee\x80\x8b'";
      text-face-name: 'structures Medium';
      text-size: 11;
      text-fill: @object;
      text-allow-overlap: true;
    }
    [type='Onderbemaling'] {
      marker-file:url("../../shields/shield-m.png");
      marker-allow-overlap: true;
      text-name: "'\xee\x80\x8d'";
      text-face-name: 'structures Medium';
      text-size: 13;
      text-fill: @object;
      text-allow-overlap: true;
    }
    [type='Gemaal'] {
      marker-file:url("../../shields/shield-m.png");
      marker-allow-overlap: true;
      text-name: "'\xee\x80\x8e'";
      text-face-name: 'structures Medium';
      text-size: 11;
      text-fill: @object;
      text-allow-overlap: true;
      text-dy: 0.000001;
    }
  }
}

#manhole [zoom > 16] {
  marker-file:url("../shields/shield-s.png");
  marker-allow-overlap: true;
  marker-line-width:150px;
  marker-fill:#f45;
  marker-line-color:#fff;
}

#measuringstation [zoom > 9] {
  [zoom > 10][category!='KNMI-AWS'] {
    shield-size: 20;
    shield-transform: "scale(0.16)";
    shield-name: "'M'";
    shield-face-name: 'Kunstwerk Regular';
    shield-fill: @object;
    shield-file:url("../../icons/shield-background-shadow.svg");
    shield-text-dx: 0;
    shield-allow-overlap: false;
  }
  [zoom > 9][category='KNMI-AWS'] {
    shield-size: 28;
    shield-transform: "scale(0.32)";
    shield-name: "'M'";
    shield-face-name: 'Kunstwerk Regular';
    shield-fill: @object;
    shield-file:url("../../icons/shield-background-shadow.svg");
    shield-text-dx: 0;
    shield-allow-overlap: false;
  }
}

#overflow [zoom > 15] {
  marker-file:url("../../shields/shield-m.png");
  marker-allow-overlap: true;
  text-name: "'\xee\x80\x88'";
  text-face-name: 'structures Medium';
  text-size: 15;
  text-fill: @object;
  text-allow-overlap: true;
  [zoom > 18] {
    marker-file:url("../../shields/shield-l.png");
    text-size: 19;
  }
}

#outlet  [zoom > 16] {
  marker-file:url("../../shields/shield-m.png");
  marker-allow-overlap: true;
  text-name: "'\xee\x80\x87'";
  text-face-name: 'structures Medium';
  text-size: 11;
  text-fill: @object;
  text-allow-overlap: true;
}

#orifice {
  line-width:100;
  line-color: red;
}

#pipe {
  line-cap: round;
  line-smooth: 0.8;
  line-color: red;
  line-width: 0.1;
}
#pipe [zoom > 0] {
  line-cap: round;
  line-smooth: 0.8;
  line-color: red;
  line-width: 0.1;
}

#pipe [zoom > 8] {
  line-cap: round;
  line-smooth: 0.8;
  line-color: red;
  line-width: 0.3;
}
#pipe [zoom > 13] {
  line-cap: round;
  line-smooth: 0.8;
  line-color: red;
  line-width: 1.0;
}
#pipe [zoom > 18] {
  line-cap: round;
  line-smooth: 0.8;
  line-color: red;
  line-width: 1.4;
}

#pressurepipe [zoom > 12] {
  line-cap: round;
  line-width: 2.5;
  line-color: @pressure;
  [zoom > 15] {
    line-width: 4.0;
  }
}



#wastewatertreatmentplant [zoom > 9] {
  shield-name: "'M'";
  shield-face-name: 'Kunstwerk Regular';
  shield-size: 28;
  shield-fill: @object;
  shield-file:url("../../icons/shield-background-shadow.svg");
  shield-text-dx: 0;
  shield-allow-overlap: false;
  shield-transform: "scale(0.16)";
}

#weir  [zoom > 14] {
  marker-file:url("../../shields/shield-m.png");
  marker-allow-overlap: true;
  text-name: "'\xee\x80\x91'";
  text-face-name: 'structures Medium';
  text-size: 13;
  text-fill: @object;
  text-allow-overlap: true;
  text-halo-fill: @object;
  text-halo-radius: 0.7;
  [zoom > 19] {  
    marker-file:url("../../shields/shield-l.png");
    text-size: 22;
  }
}