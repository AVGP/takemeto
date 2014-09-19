angular.module('tmt.controllers', [])

.controller('QuickCtrl', function($scope, Stations, FavouriteRoutes) {
    $scope.nearby       = [];
    $scope.from         = null;
    $scope.destinations = [];

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
      $scope.to = $scope.destinations[0];
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
