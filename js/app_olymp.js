var app = angular.module('olymp', [],  function($httpProvider) {

    //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
});
app.controller('OlympCtrl',function ($scope, $sce,  OlympFactory) {
    $scope.getGrades = function(event_id){
            $scope.loading = true;
        //    if(event_id == $scope.event_id) return false;
            $scope.eventGrades = false;
            $scope.event_id = event_id;
            OlympFactory.getGrades(event_id).then(function successCallback(response) {
                console.log((response.data));
                $scope.event = response.data.event;
                $scope.events = response.data.events;
                $scope.eventGrades = response.data.eventGrades;
                $scope.eventGradesTmp = response.data.eventGradesTmp;
                $scope.freeBids = response.data.freeBids;
                $scope.loading = false;
            }, function errorCallback(response) {

            });
    }

});
app.factory('OlympFactory', function ($http) {
    var getGrades = function (event_id) {
        //return data;
        return $http({
            method: 'GET',
            url: '/api/events/'+event_id+'/grade'
        })
    }
    return {
        getGrades: getGrades
    }
});
