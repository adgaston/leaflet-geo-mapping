// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function getColor(d) {
  return d >= 7 ? '#B10026' :
         d >= 6 ? '#E31A1C' :
         d >= 5 ? '#FC4E2A' :
         d >= 4 ? '#FD8D3C' :
         d >= 3 ? '#FEB24C' :
         d >= 2 ? '#FED976' :
                    '#FFFFB2';
}

function createFeatures(earthquakeData) {

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      var popupContent = "<h3>" + feature.properties.place + "</h3><hr><p><b>Magnitude: </b>" + feature.properties.mag + "</p>";

      function getOptions(properties) {
        if (properties.mag >= 7) {
          return {
            radius: (properties.mag * 3),
            color: getColor(properties.mag),
            fillOpacity: 1,
            fillColor: getColor(properties.mag)
          };
        } else if (properties.mag >= 6) {
          return {
            radius: (properties.mag * 3),
            color: getColor(properties.mag),
            fillOpacity: 1,
            fillColor: getColor(properties.mag)
          };
        } else if (properties.mag >= 5) {
          return {
            radius: (properties.mag * 3),
            color: getColor(properties.mag),
            fillOpacity: 1,
            fillColor: getColor(properties.mag)
          };
        } else if (properties.mag >= 4) {
          return {
            radius: (properties.mag * 2),
            color: getColor(properties.mag),
            fillOpacity: 1,
            fillColor: getColor(properties.mag)
          };
        } else if (properties.mag >= 3) {
          return {
            radius: (properties.mag * 2),
            color: getColor(properties.mag),
            fillOpacity: 1,
            fillColor: getColor(properties.mag)
          };
        } else if (properties.mag >= 2) {
          return {
            radius: (properties.mag * 2),
            color: getColor(properties.mag),
            fillOpacity: 1,
            fillColor: getColor(properties.mag)
          };
        } else {
          return {
            radius: 2,
            color: getColor(properties.mag),
            fillOpacity: 1,
            fillColor: getColor(properties.mag)
          };
        }
      }
      return L.circleMarker(latlng, getOptions(feature.properties)).bindPopup(popupContent);
    
    }

  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var map = L.map("map", {
    center: [
      18.4521, 1.4097
    ],
    zoom: 2.5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 2, 3, 4, 5, 6, 7]
    labels = ['#B10026', '#E31A1C', '#FC4E2A', '#FD8D3C', '#FEB24C', '#FED976', '#FFFFB2'];

for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<i style="background: ' + labels[i] + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
 }

 return div;
 };

 legend.addTo(map);