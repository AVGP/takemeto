angular.module('tmt.services', [])
.factory('FavouriteStations', function() {
  var favourites = [];

  try {
    favourites = JSON.parse(localStorage.getItem('favouriteStations')) || [];
  } catch(e) {
    // No problem, really
  }

  return {
    all: function() { return favourites; },
    find: function(term) { return favourites.filter(function(station) { return station.name.search(term) !== -1; }); },
    add: function(station) {
      favourites.push(station);
      localStorage.setItem('favouriteStations', JSON.stringify(favourites));
      return favourites;
    },
    remove: function(station) {
      for(var i=0, len = favourites.length; i<len; i++) {
        if(station.name == favourites[i].name) {
          favourites.splice(i, 1);
          localStorage.setItem('favouriteStations', JSON.stringify(favourites));
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

  function getJourney(sections) {
    var journey = [];
    for(var i=0, len = sections.length; i<len; i++) {
      var section = {};
      if(sections[i].walk) {
        if(!sections[i].walk.duration) continue;
        var timeParts = sections[i].walk.duration.split(":");
        section.walk = "walk (";
        if(timeParts[0] !== "00") section.walk += parseInt(timeParts[0], 10) + "h ";
        section.walk += parseInt(timeParts[1]) + "m)";
        journey.push(section);
        continue;
      }

      section = {
        name: sections[i].journey.name,
        direction: sections[i].journey.to,
        from: sections[i].departure.station.name,
        to: sections[i].arrival.station.name,
        departure: new Date(sections[i].departure.prognosis.departure || sections[i].departure.departure).toLocaleTimeString(),
        arrival: new Date(sections[i].arrival.prognosis.arrival || sections[i].arrival.arrival).toLocaleTimeString(),
        platform: sections[i].departure.prognosis.platform || sections[i].departure.platform
      };

      journey.push(section);
    }

    return journey;
  }

  var chosenConnection = {};

  return {
    set: function(conn) { chosenConnection = conn; },
    get: function() { return chosenConnection; },
    format: function(rawConnections) {
      var connections = rawConnections.connections;
      var favConns = FavouriteRoutes.all();
      for(var i=0, len = connections.length; i<len; i++) {
        var departureAt = new Date(connections[i].from.departure),
            arrivalAt   = new Date(connections[i].to.arrival),
            duration    = formatDuration(connections[i].duration),
            isFavourite = false;

        for(var f=0, flen = favConns.length; f<flen;f++) {
          if(connections[i].from.station.name == favConns[f].from && connections[i].to.station.name == favConns[f].to && departureAt == favConns[f].departureAt) {
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
          isFavourite: isFavourite,
          journey: getJourney(connections[i].sections)
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
    req.open("GET", "https://transport.opendata.ch/v1/locations?type=station&x=" + position.latitude + "&y=" + position.longitude);
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

  try {
    favourites = JSON.parse(localStorage.getItem('favouriteRoutes')) || [];
  } catch(e) {
    // No problem, really
  }

  return {
    all: function() { return favourites; },
    getByStartStation: function(station) {
      return favourites.filter(function(fav) { return fav.from == station });
    },
    getByRoute: function(from, to) {
      return favourites.filter(function(fav) { return fav.from == from && fav.to == to; });
    },
    add: function(connection) {
      favourites.push(connection);
      localStorage.setItem('favouriteRoutes', JSON.stringify(favourites));
      return favourites;
    },
    remove: function(connection) {
      for(var i=0, len = favourites.length; i<len; i++) {
        if(connection.from == favourites[i].from && connection.to == favourites[i].to) {
          favourites.splice(i, 1);
          localStorage.setItem('favouriteRoutes', JSON.stringify(favourites));
          return favourites;
        }
      }
    }
  };
});
