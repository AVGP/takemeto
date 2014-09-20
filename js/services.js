angular.module('tmt.services', [])
.factory('FavouriteStations', function() {
  var favourites = [
   { name: "Zürich Hauptbahnhof", lat: 8.540192, lng: 47.378177 },
   { name: "Zürich Hardbrücke", lat: 8.517108, lng: 47.385197 }
  ];

  return {
    all: function() { return favourites; }
  };
})
.factory('Stations', function() {
  var favourites = [
   { name: "Zürich Hauptbahnhof", lat: 8.540192, lng: 47.378177 },
   { name: "Zürich Hardbrücke", lat: 8.517108, lng: 47.385197 }
  ];

  function getStationsByLocation(position, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", "http://transport.opendata.ch/v1/locations?type=station&x=" + position.latitude + "&y=" + position.longitude);
    req.onload = function() { callback(false, JSON.parse(this.responseText).stations); };
    req.send();
  }

  return {
    all: function() { return favourites; },
    nearby: getStationsByLocation
  };
})
.factory('FavouriteRoutes', function() {
  var favourites = [
    {from: "Zürich HB", to: "Zürich Hardbrücke"},
    {from: "Zürich HB", to: "Zürich Flughafen"},
    {from: "Zürich HB", to: "Altstetten"},
    {from: "Zürich HB", to: "Altstetten"},
    {from: "Zürich, Räffelstrasse", to: "Zürich, Sackzelg"},
    {from: "Zürich, Räffelstrasse", to: "Zürich HB"},
    {from: "Zürich, Siemens", to: "Zürich HB" }
  ];

  return {
    all: function() { return favourites; },
    getByStartStation: function(station) {
      return favourites.filter(function(fav) { return fav.from == station });
    }
  };
})
.factory('QuickTrip', function(FavouriteRoutes) {

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
});
