'use strict';

angular.module('findatutorApp', ['ui.router','ngResource','ngDialog', 'lbServices'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
        
            // route for the contactus page
            .state('app.searchresult', {
                url:'search/:postcode',
                views: {
                    'content@': {
                        templateUrl : 'views/searchresult.html',
                        controller  : 'SearchController'                  
                    }
                }
            })
        
            // route for the contactus page
            .state('app.tutordetails', {
                url:'tutor/:id/:section',
                views: {
                    'content@': {
                        templateUrl : 'views/tutordetails.html',
                        controller  : 'TutorDetailsController'                  
                    }
                }
            })
        
            // route for the contactus page
            .state('app.contactus', {
                url:'contactus',
                views: {
                    'content@': {
                        templateUrl : 'views/contactus.html',
                        controller  : 'ContactController'                  
                    }
                }
            })
        
            // route for the favorites page
            .state('app.favorites', {
                url: 'favorites',
                views: {
                    'content@': {
                        templateUrl : 'views/favorites.html',
                        controller  : 'FavoriteController'
                   }
                }
            });
    
        $urlRouterProvider.otherwise('/');
    })
;
