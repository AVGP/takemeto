angular.module('tmt.services', [])
.factory('FavouriteStations', function() {
  var favourites = [];

  return {
    all: function() { return favourites; },
    add: function(station) { favourites.push(station); return favourites; },
    remove: function(station) {
      console.log("Removing ", station);
      for(var i=0, len = favourites.length; i<len; i++) {
        if(station.name == favourites[i].name) {
          favourites.splice(i, 1);
          console.log("Removed", i, favourites);
          return favourites;
        }
      }
    }
  };
})
.factory('Connections', function($http, FavouriteRoutes) {
  var formatDuration = function(duration) {
    var formatted = "";
    var days  = parseInt(duration.slice(0,2), 10),
        hours = parseInt(duration.slice(3,5), 10),
        mins  = parseInt(duration.slice(6,8), 10);

    if(days > 0) {
      formatted = days + " Tag" + (days > 1 ? "e " : " ");
    }

    if(hours > 0) {
      formatted += hours + "h ";
    }
    formatted += mins + "m";

    return formatted;
  };

  return {
    format: function(rawConnections) {
      var connections = rawConnections.connections;
      var favConns = FavouriteRoutes.all();
      for(var i=0, len = connections.length; i<len; i++) {
        var departureAt = new Date(connections[i].from.departure),
            arrivalAt   = new Date(connections[i].to.arrival),
            duration    = formatDuration(connections[i].duration),
            isFavourite = false;

        for(var f=0, flen = favConns.length; f<flen;f++) {
          if(connections[i].from.station.name == favConns[f].from && connections[i].to.station.name == favConns[f].to) {
            isFavourite = true;
            break;
          }
        }

        connections[i] = {
          from: connections[i].from.station.name,
          to:   connections[i].to.station.name,
          departure: departureAt.toLocaleTimeString().slice(0, -3),
          arrival: arrivalAt.toLocaleTimeString().slice(0, -3),
          duration: duration,
          isFavourite: isFavourite
        };
      }

      return connections;
    }
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
  var favourites = [];

  return {
    all: function() { return favourites; },
    getByStartStation: function(station) {
      return favourites.filter(function(fav) { return fav.from == station });
    },
    add: function(connection) { favourites.push(connection); return favourites; },
    remove: function(connection) {
      console.log("Removing ", connection);
      for(var i=0, len = favourites.length; i<len; i++) {
        if(connection.from == favourites[i].from && connection.to == favourites[i].to) {
          favourites.splice(i, 1);
          console.log("Removed", i, favourites);
          return favourites;
        }
      }
    }    
  };
});
