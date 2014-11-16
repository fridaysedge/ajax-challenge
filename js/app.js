"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

angular.module('commentsApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        //Parse required headers
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 
			'pEuDF4iyxeJxiRQkOIklnLG39EJsw6uJN9eOObeO';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 
			'uBc1csfR4m8nRVK9d2qN7aQujm7EdZ1Xe3Hckmkq';
    })
    .controller('CommentsController', function($scope, $http) {
        var commentsUrl = 'https://api.parse.com/1/classes/comments';

        $scope.refreshComments = function(){
            $scope.loading = true; // advertise that the application is processing
            $http.get(commentsUrl + '?order=-score')
                .success(function(data){
                    $scope.comments = data.results;
                })
                .error(function(err){
                    $scope.errorMessage = err;
                })
                .finally(function(){
                    $scope.loading = false; // Turn of the advertisement
                });
        }; // refreshComments

        // Refresh the comments
        $scope.refreshComments();

        // Prep the new comment
        $scope.newComment = {score: 0}; // default value for new comments

        $scope.addComment = function(){
            $scope.loading = true; // advertise that the application is processing
            $http.post(commentsUrl, $scope.newComment)
                .success(function(responseData){
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    //$scope.newComment = {score: 0}; // default value for new comments
                })
                .error(function(err){
                    $scope.errorMessage = err;
					console.log(err);
                })
                .finally(function(){
                    $scope.loading = false; // Turn of the advertisement
                });
        }; // addComment

        $scope.deleteComment = function(comment){
            // Warn the user of the impending deletion
            if(confirm("Are you sure you want to delete this comment?")){
                $http.delete(commentsUrl + '/' + comment.objectId, comment)
                    .success(function(){
                        $scope.refreshComments();
                    })
                    .error(function(err){
                        $scope.errorMessage = err;
                    });
            }
        }; // deleteComment

        $scope.incrementScore = function(comment, amount){
            $scope.loading = true; // advertise that the application is processing
            // Is the the passed amount going to bring the score below zero
            if(comment.score + amount >= 0){
                $http.put(commentsUrl + '/' + comment.objectId,
                    {score: {__op: 'Increment', amount: amount}})
                    .success(function(responseData){
                        console.log(responseData);
                        comment.score = responseData.score;
                    })
                    .error(function(err){
                        console.log(err);
                    })
                    .finally(function(){
                        $scope.loading = false; // Turn of the advertisement
                    });
            }
        }; // incrementScore
    });