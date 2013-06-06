var map;
var styleArray = [
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "color": "#809580" },
      { "hue": "#00ff80" }
    ]
  },{
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      { "hue": "#ffaa00" },
      { "visibility": "off" }
    ]
  },{
  },{
    "featureType": "administrative.country",
    "elementType": "labels.text",
    "stylers": [
      { "visibility": "on" },
      { "color": "#92d680" },
      { "weight": 0.2 },
      { "hue": "#ff5e00" },
      { "invert_lightness": true }
    ]
  },{
    "featureType": "administrative.locality",
    "elementType": "labels.text",
    "stylers": [
      { "visibility": "on" },
      { "color": "#cb4a3c" },
      { "weight": 0.4 },
      { "hue": "#ffa200" },
      { "lightness": -52 }
    ]
  },{
    "featureType": "administrative.province",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "administrative.locality",
    "elementType": "geometry"  }
];

function initialize() {
  var mapOptions = {
    zoom: 5,
    minZoom: 4,
    maxZoom: 7,
    styles: styleArray,
    streetViewControl: false,
    zoomControl: false,
    panControl: false,
    visualRefresh: true,
    center: new google.maps.LatLng(7.25834,12.346191),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);
