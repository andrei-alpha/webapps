var infoBox, mapWindowId = 0;

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
      { "visibility": "off" },
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

var directionDisplay;
var directionService = new google.maps.DirectionsService();

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
  var rendOpt = {
    map: map,
    polylineOptions:{strokeColor:'brown'}
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  $.getJSON("/static/js/json/cities.json", function(data) {
    for (var i = 0; i < data.cities.length; ++i) {
      addInformation(data.cities[i].name, data.cities[i].level,
      data.cities[i].story, data.cities[i].image,
      data.cities[i].lat, data.cities[i].long, data.cities[i].neighbours);
    }

    mapCity = new google.maps.LatLng(data.cities[14].lat, data.cities[14].long);
    marker = new google.maps.Marker(changeMarker('big', city));
  });
  directionDisplay = new google.maps.DirectionsRenderer(rendOpt);
  directionDisplay.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);

function changeMarker(type, city) {
  var colour = (type == 'big' ? "green" : "brown");
  var scale = (type == 'big' ? 7 : 5);
  var options = {
    position: city,
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      strokeColor: colour,
      scale: scale
    }
  };
  return options;
}

function addInformation(name, level, story, image, lat, long, neighbours) {
  city = new google.maps.LatLng(lat, long);
  addingMap(name, city, story, image);
}

function addingMap(city_name, city, story, image) {
  var marker = new google.maps.Marker(changeMarker('low', city));

  infoBox = new InfoBox();
  google.maps.event.addListener(marker, 'click', function() {
    calculateRoutes(mapCity, city)
    var windowTemplate = $('#mapWindowTemplate').html();
    var template = windowTemplate.format(mapWindowId, city_name, story);

    infoBox.open(map, marker);
    infoBox.setContent(template);
    infoBox.show();
    
    var funShow = function() { showMapWindow(mapWindowId); }
    setTimeout(funShow, 100);
    var funBind = function() { makeBindings(mapWindowId, image, city) };
    setTimeout(funBind, 500);
  });
}

function makeBindings(mapWindowId, image, city) {
  $('#map-window-close-' + mapWindowId).click( function(event) { closeMapWindow(mapWindowId); } );
  $('#map-window-play-' + mapWindowId).click( function(event) { playMapWindow(mapWindowId, city); } );
  $('#map-window-pic-' + mapWindowId).css('background-image', 'url(' + image + ')');
}

function showMapWindow(mapWindowId) {
  $('#map-window-' + mapWindowId).fadeIn(500);
}

function closeMapWindow(mapWindowId) {
  $('#map-window-' + mapWindowId).fadeOut(500);
  setTimeout(infoBox.close(), 1000);
}

function playMapWindow(mapWindowId, city) {
  // If success
  marker.setIcon({
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: "brown",
    scale: 5
  });
  
  mapCity = city;
  closeMapWindow(mapWindowId);
  calculateRoutes(mapCity, mapCity);
  marker = new google.maps.Marker(changeMarker('big', city));
}

function calculateRoutes(start, end) {
    var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionService.route(request, function(res, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionDisplay.setDirections(res);
    }
  });
}
