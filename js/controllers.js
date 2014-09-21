angular.module('tmt.controllers', [])

.controller('QuickCtrl', function($scope, $http, Connections, Stations, FavouriteStations, FavouriteRoutes) {
    $scope.departureStations = [];
    $scope.destinations      = [];
    $scope.connections       = [];

    $scope.from  = null;
    $scope.route = {};

    navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Acquired position: ", position);
        Stations.nearby(position.coords, function(error, stations) {
          $scope.$apply(function() {
            if(!stations) stations = FavouriteStations.all();
            else stations = stations.concat(FavouriteStations.all());

            $scope.departureStations = stations;
            $scope.from = $scope.departureStations[0];
            $scope.getDestinations();
          });
        });
    });

    $scope.getDestinations = function() {
      $scope.from = this.from;
      console.log("Getting destinations for ", $scope.from);
      $scope.destinations = FavouriteRoutes.getByStartStation($scope.from.name);
      $scope.route = $scope.destinations[0] || {};
      console.log("Destinations", $scope.destinations);
    }

    $scope.getConnections = function() {
      $http({method: "GET", url: "http://transport.opendata.ch/v1/connections?limit=5&from=" + $scope.from.name + "&to=" + $scope.route.to})
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

.controller('NavigationCtrl', function($scope) {
})

.controller('ScheduleCtrl', function($scope) {
})

.controller('StationsCtrl', function($scope, $http, Stations, FavouriteStations) {
    navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Acquired position: ", position);
        Stations.nearby(position.coords, function(error, stations) {
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

    $scope.toggleFavourite = function(index) {
      var station = $scope.stations.results[index];
      station.isFavourite = !station.isFavourite;
      if(station.isFavourite) {
        $scope.favourites = FavouriteStations.add(station);
      } else {
        $scope.favourites = FavouriteStations.remove(station);
      }
      $scope.stations.results[index] = station;
    }

    $scope.removeFavourite = function(station) {
      $scope.favourites = FavouriteStations.remove(station);
    }
});
