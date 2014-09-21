angular.module('tmt.controllers', [])

.controller('QuickCtrl', function($scope, $http, Connections, Stations, FavouriteStations, FavouriteRoutes) {
    $scope.departureStations = [];
    $scope.destinations      = [];
    $scope.connections       = [];

    $scope.route = {};

    navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Acquired position: ", position);
        Stations.nearby(position.coords, function(error, stations) {
          $scope.$apply(function() {
            if(!stations) stations = FavouriteStations.all();
            else stations = stations.concat(FavouriteStations.all());

            $scope.departureStations = stations;
            $scope.route.from = $scope.departureStations[0];
            $scope.getDestinations();
          });
        });
    });

    $scope.getDestinations = function() {
      console.log("Getting destinations for ", $scope.route.from);
      $scope.destinations = FavouriteRoutes.getByStartStation($scope.route.from.name);
      $scope.route.to = $scope.destinations[0].to || "";
      console.log("Destinations", $scope.destinations);
    }

    $scope.getConnections = function() {
      $http({method: "GET", url: "http://transport.opendata.ch/v1/connections?limit=5&from=" + $scope.route.from.name + "&to=" + $scope.route.to})
        .success(function(result) {
          $scope.connections = Connections.format(result);
        });
    }

    $scope.toggleFavourite = function(index) {
      var conn = $scope.connections[index];
      conn.isFavourite = !conn.isFavourite;
      if(conn.isFavourite) {
        FavouriteRoutes.add(conn);
      } else {
        FavouriteRoutes.remove(conn);
      }
      $scope.connections[index] = conn;
    }
})

.controller('NavigationCtrl', function($scope, $http, Connections, FavouriteStations, FavouriteRoutes) {
  $scope.route = {};

  $scope.search = function(resultProperty, term) {
    $http({method: "GET", url: "http://transport.opendata.ch/v1/locations?type=station&query=" + term})
    .success(function(response) {
      $scope[resultProperty] = FavouriteStations.find(term).concat(response.stations);
    });
  };

  $scope.choose = function(field, propertyName, value) {
    $scope.route[field] = value;
    $scope[propertyName] = [];
  }

  $scope.getConnections = function() {
    $http({method: "GET", url: "http://transport.opendata.ch/v1/connections?limit=5&from=" + $scope.route.from + "&to=" + $scope.route.to})
      .success(function(result) {
        $scope.connections = Connections.format(result);
      });
  }

  $scope.toggleFavourite = function(index) {
    var conn = $scope.connections[index];
    conn.isFavourite = !conn.isFavourite;
    if(conn.isFavourite) {
      FavouriteRoutes.add(conn);
    } else {
      FavouriteRoutes.remove(conn);
    }
    $scope.connections[index] = conn;
  }
})

.controller('ScheduleCtrl', function($scope) {
})

.controller('StationsCtrl', function($scope, $http, $location, Stations, FavouriteStations) {
    navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Acquired position: ", position);
        Stations.nearby(position.coords, function(error, stations) {
          if(!stations) return;
          
          stations = stations.slice(0, 5);
          var favs = $scope.favourites;
          for(var i=0, len = stations.length; i<len; i++) {
            stations[i].isFavourite = false;
            for(var f=0, flen = favs.length; f<flen;f++) {
              if(stations[i].name == favs[f].name) {
                stations[i].isFavourite = true;
                break;
              }
            }
          }

          $scope.$apply(function() {
            $scope.nearby = stations;
          });
        });
    });
    $scope.nearby = [];
    $scope.favourites = FavouriteStations.all();
    $scope.stations = {};

    $scope.search = function() {
      $http({method: "GET", url: "http://transport.opendata.ch/v1/locations?type=station&limit=10&query=" + $scope.stations.searchTerm})
      .success(function(response) {
        var stations = response.stations, favs = $scope.favourites;
        for(var i=0, len = stations.length; i<len; i++) {
          stations[i].isFavourite = false;
          for(var f=0, flen = favs.length; f<flen;f++) {
            if(stations[i].name == favs[f].name) {
              stations[i].isFavourite = true;
              break;
            }
          }
        }
        $scope.stations.results = stations;
      });
    };

    $scope.toggleFavourite = function(collection, index) {
      var station = collection[index];
      station.isFavourite = !station.isFavourite;
      if(station.isFavourite) {
        $scope.favourites = FavouriteStations.add(station);
      } else {
        $scope.favourites = FavouriteStations.remove(station);
      }
      collection[index] = station;
      return collection;
    }

    $scope.removeFavourite = function(station) {
      $scope.favourites = FavouriteStations.remove(station);
    }
    
    $scope.show = function(stationId) {
      $location.path("/tab/stations/" + stationId);
    }
})

.controller('StationDetailCtrl', function($scope, $stateParams, $http) {
  $scope.connections = [];
  $scope.name = "";
  
  $http({method: "GET", url: "http://transport.opendata.ch/v1/stationboard?station=" + $stateParams.station})
  .success(function(result) {
    $scope.name = result.station.name;
    var connections = result.stationboard;
    for(var i=0;i<connections.length;i++) {
      connections[i].departure = new Date(connections[i].stop.departure).toLocaleTimeString();
    }
    $scope.connections = connections;
  });
});
