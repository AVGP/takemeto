angular.module('tmt.controllers', [])

.controller('QuickCtrl', function($scope, $http, Connections, Stations, FavouriteRoutes) {
    $scope.nearby       = [];
    $scope.destinations = [];
    $scope.connections  = [];

    $scope.from  = null;
    $scope.route = null;

    navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Acquired position: ", position);
        Stations.nearby(position.coords, function(error, stations) {
          $scope.$apply(function() {
            if(stations) stations = stations.slice(0);
            $scope.nearby = stations;
            $scope.from = $scope.nearby[0];
            $scope.getDestinations();
          });
        });
    });

    $scope.getDestinations = function() {
      console.log("Getting destinations for ", $scope.from);
      $scope.destinations = FavouriteRoutes.getByStartStation($scope.from.name);
      $scope.route = $scope.destinations[0];
    }

    $scope.getConnections = function() {
      console.log("Going to...", $scope.route);
      $http({method: "GET", url: "http://transport.opendata.ch/v1/connections?limit=5&from=" + $scope.from.name + "&to=" + $scope.route.to})
        .success(function(result) {
          $scope.connections = Connections.format(result);
        });
    }
})

.controller('NavigationCtrl', function($scope) {
})

.controller('ScheduleCtrl', function($scope) {
})

.controller('StationsCtrl', function($scope, Stations, FavouriteStations) {
    navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Acquired position: ", position);
        Stations.nearby(position.coords, function(error, stations) {
          $scope.$apply(function() {
            $scope.nearby = stations;
          });
        });
    });
    $scope.nearby = [];
    $scope.favourites = [];
});
