"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

angular.module('commentsApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        //Parse required headerstwo extra headers sent with every HTTP request: X-Parse-Application-Id, X-Parse-REST-API-Key
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 
			'pEuDF4iyxeJxiRQkOIklnLG39EJsw6uJN9eOObeO';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 
			'uBc1csfR4m8nRVK9d2qN7aQujm7EdZ1Xe3Hckmkq';
    })
    .controller('TasksController', function($scope, $http) {
        var commentsUrl = 'https://api.parse.com/1/classes/comments';

        $scope.refreshComments = function(){
            $scope.loading = true;
            $http.get(commentsUrl)
                .success(function(data){
                    $scope.comments = data.results;
                })
                .error(function(err){
                    $scope.errorMessage = err;
                })
                .finally(function(){
                    $scope.loading = false;
                });
        };
        $scope.refreshComments();

        //$scope.newComment = {score: 0};

        $scope.addComment = function(){
            $http.post(commentsUrl, $scope.newComment)
                .success(function(responseData){
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {score: 0}; // defualt value for new comments
                })
                .error(function(err){
                    $scope.errorMessage = err;
                });
        };

        $scope.updateComment = function(comment){
            $http.put(commentsUrl + '/' + comment.objectId, comment)
                .success(function(){

                })
                .error(function(err){
                    $scope.errorMessage = err;
                });
        };

        $scope.incrementRating = function(comment, amount){
            $scope.updating = true;
			$http.put(commentsUrl + '/' + comment.objectId,
				{rating: {__op: 'Increment', amount: amount}})
                .success(function(responseData){
                    console.log(responseData);
                    comment.ratings = responseData.ratings;
                })
                .error(function(err){
                    console.log(err);
                })
                .finally(function(){
                    $scope.updatng = false;
                });
        };
    });