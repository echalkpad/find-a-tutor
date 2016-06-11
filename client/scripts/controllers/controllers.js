'use strict';

angular.module('findatutorApp')

.controller('ContactController', ['$scope', function ($scope) {

    $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    var channels = [{
        value: "tel",
        label: "Tel."
    }, {
        value: "Email",
        label: "Email"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;
    
    $scope.initMap = function () {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 43.2666288, lng: -2.9356911},
            zoom: 14
        });
    }

    $scope.sendFeedback = function () {


        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
            $scope.invalidChannelSelection = true;
        } else {
            $scope.invalidChannelSelection = false;
            // feedbackFactory.save($scope.feedback);
            $scope.feedback = {
                mychannel: "",
                firstName: "",
                lastName: "",
                agree: false,
                email: ""
            };
            $scope.feedback.mychannel = "";
            $scope.feedbackForm.$setPristine();
        }
    };
}])

.controller('SearchController', ['$scope', '$rootScope', '$state', '$stateParams', 'Tutor', 'Subject', 'Favorite', 'ngDialog', function ($scope, $rootScope, $state, $stateParams, Tutor, Subject, Favorite, ngDialog) { 
    $scope.postcode = $stateParams.postcode;
    $scope.showTutors = false;
    $scope.messageTutors = "Loading ...";
    $scope.totalTutors = 0;
        
    var tutors = Tutor.find(
        {"filter":
            {"where":{"postcode": $stateParams.postcode},
             "include":["subjects","reviews","favorites"]
            }
        }
    )
    .$promise.then(
        function (response) {
            if (response!=""){
                $scope.tutors = response;
                $scope.totalTutors = $scope.tutors.length;
                for (var i = 0; i < $scope.tutors.length; i++) { 
                    $scope.tutors[i].stars = {
                        star1:"fa-star-o",star2:"fa-star-o",star3:"fa-star-o",star4:"fa-star-o",star5:"fa-star-o"
                    }
                    $scope.tutors[i].ratingAverage=0;
                    if($scope.tutors[i].reviews.length>0){
                        var sumRatings = 0;
                        for (var j = 0; j < $scope.tutors[i].reviews.length; j++) {
                            sumRatings += $scope.tutors[i].reviews[j].rating;
                        }
                        var ratingAverage = sumRatings / $scope.tutors[i].reviews.length;
                        $scope.tutors[i].ratingAverage=ratingAverage;
                        if(ratingAverage==5){ $scope.tutors[i].stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star",star4:"fa-star",star5:"fa-star" } }
                        if(ratingAverage<5 && ratingAverage>4){ $scope.tutors[i].stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star",star4:"fa-star",star5:"fa-star-half-o" } }
                        if(ratingAverage==4){ $scope.tutors[i].stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star",star4:"fa-star",star5:"fa-star-o" } }
                        if(ratingAverage<4 && ratingAverage>3){ $scope.tutors[i].stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star",star4:"fa-starhalf-o",star5:"fa-star" } }
                        if(ratingAverage==3){ $scope.tutors[i].stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star",star4:"fa-star-o",star5:"fa-star-o" } }
                        if(ratingAverage<3 && ratingAverage>2){ $scope.tutors[i].stars = { star1:"fa-star",star2:"fa-star",star3:"fa-starhalf-o",star4:"fa-star",star5:"fa-star" } }
                        if(ratingAverage==2){ $scope.tutors[i].stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star-o",star4:"fa-star-o",star5:"fa-star-o" } }
                        if(ratingAverage<2 && ratingAverage>1){ $scope.tutors[i].stars = { star1:"fa-star",star2:"fa-star-half-o",star3:"fa-star",star4:"fa-star",star5:"fa-star" } }
                        if(ratingAverage==1){ $scope.tutors[i].stars = { star1:"fa-star",star2:"fa-star-o",star3:"fa-star-o",star4:"fa-star-o",star5:"fa-star-o" } }
                        if(ratingAverage<1 && ratingAverage>0){ $scope.tutors[i].stars = { star1:"fa-star-half-o",star2:"fa-star",star3:"fa-star",star4:"fa-star",star5:"fa-sta" } }
                        if(ratingAverage==0){ $scope.tutors[i].stars = { star1:"fa-star-o",star2:"fa-star-o",star3:"fa-star-o",star4:"fa-star-o",star5:"fa-star-o" } }
                    }
                }
                $scope.showTutors = true;
            }
            else{
                $scope.messageTutors = "There is no tutor near " + $stateParams.postcode + ". Please try again changing the location.";
            }
            
        },
        function (response) {
            $scope.messageTutors = "Error: " + response.status + " " + response.statusText;
        }
    );
    
    $scope.orderClause = 'id';
    $scope.filterClause = '';
    
    $scope.orderBy = function (orderClause) {
        $scope.orderClause = orderClause;
    };
    
    $scope.orderedBy = function (orderClause) {
        return ($scope.orderClause === orderClause);
    };
    
    $scope.filterBy = function (filterClause) {
        $scope.filterClause = filterClause;
    };
    
    $scope.filteredBy = function (filterClause) {
        return ($scope.filterClause === filterClause);
    };
    
    $scope.showSubjects = false;
    $scope.messageSubjects = "Loading ...";
    $scope.totalSubjects = 0;
    
    var subjects = Subject.find({"filter":
        {"include":["tutors"],"order":"name ASC"}
    })
    .$promise.then(
        function (response) {
            if (response!=""){
                $scope.subjects = response;
                $scope.showSubjects = true;
            }
            else{
                $scope.messageSubjects = "There is no Subjects.";
            }
            
        },
        function (response) {
            $scope.messageSubjects = "Error: " + response.status + " " + response.statusText;
        }
    );
    
    
    $scope.myfavorite = {
        tutorId: "",
        customerId: ""
    };
    
    $scope.saveFavoriteTutor = function (tutorId) {
        if ($rootScope.currentUser){
            $scope.myfavorite.customerId = $rootScope.currentUser.id;
            $scope.myfavorite.tutorId = tutorId;
            
            Favorite.create($scope.myfavorite);
            
            $state.go($state.current, {}, {reload: true});
            
            $scope.myfavorite = {
                tutorId: "",
                customerId: ""
            };
        }
        else{
            var message = '\
                <div class="ngdialog-message">\
                <div><h3>Error</h3></div>' +
                  '<div><p>You must login before saving a favorite tutor.</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'
            
                ngDialog.openConfirm({ template: message, plain: 'true'});
        }   
    };
    
    $scope.isCurrentUserFavorite = function(favorites) {
        if ($rootScope.currentUser)
            if(favorites)
                for (var i = 0; i < favorites.length; i++)
                    if(favorites[i].customerId==$rootScope.currentUser.id)
                        return true;
        return false;
    }
    
    $scope.deleteFavoriteTutor = function(favorites) {
        var favoriteid=0;
        if ($rootScope.currentUser){
            for (var i = 0; i < favorites.length; i++)
                if(favorites[i].customerId==$rootScope.currentUser.id)
                    favoriteid=favorites[i].id;
        
            Favorite.deleteById({id: favoriteid});
            
            $state.go($state.current, {}, {reload: true});
        }
    };
}])

.controller('TutorDetailsController', ['$scope', '$rootScope', '$state', '$stateParams', 'Tutor', 'Favorite', 'Review', 'Message', 'ngDialog', function ($scope, $rootScope, $state, $stateParams, Tutor, Favorite, Review, Message, ngDialog) { 
    $scope.tutor = {};
    $scope.messages = {};
    $scope.showTutor = false;
    $scope.showMessages = false;
    $scope.messageTutor = "Loading ...";
    $scope.messageMsg = "Loading ...";
    if($rootScope.currentUser)
        $scope.currentUserId = $rootScope.currentUser.id;
    else
        $scope.currentUserId = "null";
    
    $scope.myreview = {
        rating: 3,
        review: "",
        tutorId: "",
        customerId: ""
    };
    $scope.mymessage = {
        message: "",
        tutorId: "",
        date: "",
        customerId: ""
    };
    
    $scope.tutor = Tutor.findById({
        id: $stateParams.id,
        "filter":{
            "include": ["subjects","favorites",{ reviews: 'customer'}]
        }
    })
    .$promise.then(
        function (response) {
            $scope.tutor = response;

            $scope.tutor.ratingAverage=0;
            $scope.tutor.stars = {
                star1:"fa-star-o",star2:"fa-star-o",star3:"fa-star-o",star4:"fa-star-o",star5:"fa-star-o"
            }
            
            if($scope.tutor.reviews){
                if($scope.tutor.reviews.length>0){
                    var sumRatings = 0;
                    for (var j = 0; j < $scope.tutor.reviews.length; j++) {
                        sumRatings += $scope.tutor.reviews[j].rating;
                    }
                    var ratingAverage = sumRatings / $scope.tutor.reviews.length;
                    $scope.tutor.ratingAverage = ratingAverage;
                    if(ratingAverage==5){ $scope.tutor.stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star",star4:"fa-star",star5:"fa-star" } }
                    if(ratingAverage<5 && ratingAverage>4){ $scope.tutor.stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star",star4:"fa-star",star5:"fa-star-half-o" } }
                    if(ratingAverage==4){ $scope.tutor.stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star",star4:"fa-star",star5:"fa-star-o" } }
                    if(ratingAverage<4 && ratingAverage>3){ $scope.tutor.stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star",star4:"fa-star-half-o",star5:"fa-star-o" } }
                    if(ratingAverage==3){ $scope.tutor.stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star",star4:"fa-star-o",star5:"fa-star-o" } }
                    if(ratingAverage<3 && ratingAverage>2){ $scope.tutor.stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star-half-o",star4:"fa-star-o",star5:"fa-star-o" } }
                    if(ratingAverage==2){ $scope.tutor.stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star-o",star4:"fa-star-o",star5:"fa-star-o" } }
                    if(ratingAverage<2 && ratingAverage>1){ $scope.tutor.stars = { star1:"fa-star",star2:"fa-star-half-o",star3:"fa-star-o",star4:"fa-star-o",star5:"fa-star-o" } }
                    if(ratingAverage==1){ $scope.tutor.stars = { star1:"fa-star",star2:"fa-star-o",star3:"fa-star-o",star4:"fa-star-o",star5:"fa-star-o" } }
                    if(ratingAverage<1 && ratingAverage>0){ $scope.tutor.stars = { star1:"fa-star-half-o",star2:"fa-star-o",star3:"fa-star-o",star4:"fa-star-o",star5:"fa-star-o" } }
                    if(ratingAverage==0){ $scope.tutor.stars = { star1:"fa-star-o",star2:"fa-star-o",star3:"fa-star-o",star4:"fa-star-o",star5:"fa-star-o" } }
                }
            }
            
            $scope.showTutor = true;
        },
        function (response) {
            $scope.messageTutor = "Error: " + response.status + " " + response.statusText;
        }
    );
    
    if ($rootScope.currentUser) {
        Message.find(
            {"filter":
                {   
                    where: {
                        and: [
                                {tutorId: $scope.tutor.Id}, 
                                {customerId: $rootScope.currentUser.id}
                             ]
                    }, 
                    "include":"customer"
                }
            }
        )
        .$promise.then(
        function (response) {
            $scope.messages = response;
            $scope.showMessages = true;
        },
        function (response) {
            $scope.messageMsg = "Error: " + response.status + " " + response.statusText;
        });
    }
    else{
        $scope.messageMsg = "You are not logged in"
    }
    
    $scope.showTabs = true; //CAMBIAR POR FALSE LUEGOOORRR
    $scope.messageTabs = "Loading ...";
    
    switch($stateParams.section) {
        case 'bio':
            $scope.tab = 1;
            break;
        case 'reviews':
            $scope.tab = 2;
            break;
        case 'contact':
            $scope.tab = 3;
            break;
        default:
            $scope.tab = 1;
    }    
    
    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "appetizer";
        } else if (setTab === 3) {
            $scope.filtText = "mains";
        } else if (setTab === 4) {
            $scope.filtText = "dessert";
        } else {
            $scope.filtText = "";
        }
    };
    
    $scope.returnStarClass = function (star, rating) {
        //entera fa-star
        //media fa-starhalf-o En este caso no vamos a devolver medias nunca, porque el rating es int
        //vacia fa-star-o
        return (star <= rating) ? 'fa-star' : 'fa-star-o';
    };
    

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };
    
    $scope.myfavorite = {
        tutorId: "",
        customerId: ""
    };
    
    $scope.saveFavoriteTutor = function (tutorId) {
        if ($rootScope.currentUser){
            $scope.myfavorite.customerId = $rootScope.currentUser.id;
            $scope.myfavorite.tutorId = tutorId;
            
            Favorite.create($scope.myfavorite);
            
            $state.go($state.current, {}, {reload: true});
            
            $scope.myfavorite = {
                tutorId: "",
                customerId: ""
            };
        }
        else{
            var message = '\
                <div class="ngdialog-message">\
                <div><h3>Error</h3></div>' +
                  '<div><p>You must login before saving a favorite tutor.</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'
            
                ngDialog.openConfirm({ template: message, plain: 'true'});
        }   
    };
    
    $scope.isCurrentUserFavorite = function(favorites) {
        if ($rootScope.currentUser)
            if(favorites)
                for (var i = 0; i < favorites.length; i++)
                    if(favorites[i].customerId==$rootScope.currentUser.id)
                        return true;
        return false;
    }
    
    $scope.deleteFavoriteTutor = function(favorites) {
        var favoriteid=0;
        if ($rootScope.currentUser){
            for (var i = 0; i < favorites.length; i++)
                if(favorites[i].customerId==$rootScope.currentUser.id)
                    favoriteid=favorites[i].id;
        
            Favorite.deleteById({id: favoriteid});
            $state.go($state.current, {}, {reload: true});
        }
    };
    
    $scope.sendReview = function () {
        
        if ($rootScope.currentUser){
            $scope.myreview.customerId = $rootScope.currentUser.id;
            $scope.myreview.tutorId = $scope.tutor.id;
            
            Review.create($scope.myreview);
            
            $state.go($state.current, {}, {reload: true});
            
            $scope.myreview = {
                rating: 3,
                review: "",
                tutorId: "",
                customerId: ""
            };
        }
        else{
            var message = '\
                <div class="ngdialog-message">\
                <div><h3>Error</h3></div>' +
                  '<div><p>You must login before sending a review for a tutor.</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'
            
                ngDialog.openConfirm({ template: message, plain: 'true'});
        }   
    };
    
    $scope.sendFeedback = function () {        
        if ($rootScope.currentUser){
            $scope.mymessage.customerId = $rootScope.currentUser.id;
            $scope.mymessage.tutorId = $scope.tutor.id;
            var d = new Date();
            $scope.mymessage.date = d.toISOString();
            
            Message.create($scope.mymessage);
            
            $state.go($state.current, {}, {reload: true});
            
            $scope.mymessage = {
                message: "",
                tutorId: "",
                date: "",
                customerId: ""
            };
        }
        else{
            var message = '\
                <div class="ngdialog-message">\
                <div><h3>Error</h3></div>' +
                  '<div><p>You must login before sending a message to a tutor.</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'
            
                ngDialog.openConfirm({ template: message, plain: 'true'});
        }   
    };
    
}])

.controller('HomeController', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {    
    $scope.postcode = "";
    
    $scope.searchTutors = function () {
        $state.go('app.searchresult',{postcode:$scope.postcode});
    };
}])

.controller('FavoriteController', ['$scope', '$rootScope', '$state', 'Favorite', 'Customer', function ($scope, $rootScope, $state, Favorite, Customer) {

    $scope.showMenu = false;
    $scope.message = "Loading ...";
    
    /*$scope.tutor = Tutor.findById(
        {id: $stateParams.id,"filter":{"include":["subjects",{reviews: 'customer'}]}}
    )*/

    if ($rootScope.currentUser) {
    Customer.favorites({id:$rootScope.currentUser.id, "filter":
        {"include":[{tutor: ["reviews","subjects"]}]}
        })
        .$promise.then(
        function (response) {
            $scope.favorites = response;
            
            $scope.totalTutors = $scope.favorites.length;
            for (var i = 0; i < $scope.favorites.length; i++) { 
                $scope.favorites[i].tutor.stars = {
                    star1:"fa-star-o",star2:"fa-star-o",star3:"fa-star-o",star4:"fa-star-o",star5:"fa-star-o"
                }
                if($scope.favorites[i].tutor.reviews.length>0){
                    var sumRatings = 0;
                    for (var j = 0; j < $scope.favorites[i].tutor.reviews.length; j++) {
                        sumRatings += $scope.favorites[i].tutor.reviews[j].rating;
                    }
                    var ratingAverage = sumRatings / $scope.favorites[i].tutor.reviews.length;
                    if(ratingAverage==5){ $scope.favorites[i].tutor.stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star",star4:"fa-star",star5:"fa-star" } }
                    if(ratingAverage<5 && ratingAverage>4){ $scope.favorites[i].tutor.stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star",star4:"fa-star",star5:"fa-star-half-o" } }
                    if(ratingAverage==4){ $scope.favorites[i].tutor.stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star",star4:"fa-star",star5:"fa-star-o" } }
                    if(ratingAverage<4 && ratingAverage>3){ $scope.favorites[i].tutor.stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star",star4:"fa-starhalf-o",star5:"fa-star" } }
                    if(ratingAverage==3){ $scope.favorites[i].tutor.stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star",star4:"fa-star-o",star5:"fa-star-o" } }
                    if(ratingAverage<3 && ratingAverage>2){ $scope.favorites[i].tutor.stars = { star1:"fa-star",star2:"fa-star",star3:"fa-starhalf-o",star4:"fa-star",star5:"fa-star" } }
                    if(ratingAverage==2){ $scope.favorites[i].tutor.stars = { star1:"fa-star",star2:"fa-star",star3:"fa-star-o",star4:"fa-star-o",star5:"fa-star-o" } }
                    if(ratingAverage<2 && ratingAverage>1){ $scope.favorites[i].tutor.stars = { star1:"fa-star",star2:"fa-star-half-o",star3:"fa-star",star4:"fa-star",star5:"fa-star" } }
                    if(ratingAverage==1){ $scope.favorites[i].tutor.stars = { star1:"fa-star",star2:"fa-star-o",star3:"fa-star-o",star4:"fa-star-o",star5:"fa-star-o" } }
                    if(ratingAverage<1 && ratingAverage>0){ $scope.favorites[i].tutor.stars = { star1:"fa-star-half-o",star2:"fa-star",star3:"fa-star",star4:"fa-star",star5:"fa-sta" } }
                    if(ratingAverage==0){ $scope.favorites[i].tutor.stars = { star1:"fa-star-o",star2:"fa-star-o",star3:"fa-star-o",star4:"fa-star-o",star5:"fa-star-o" } }
                }
            }
            
            $scope.showMenu = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });
    }
    else{
        $scope.message = "You are not logged in"
    }
    
    $scope.deleteFavoriteTutor = function(favoriteid) {
        Favorite.deleteById({id: favoriteid});
        $state.go($state.current, {}, {reload: true});
    };
}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthService', function ($scope, $state, $rootScope, ngDialog, AuthService) {

    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthService.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
       AuthService.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.username = AuthService.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.username = AuthService.getUsername();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthService', function ($scope, ngDialog, $localStorage, AuthService) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthService.login($scope.loginData);

        ngDialog.close();

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthService', function ($scope, ngDialog, $localStorage, AuthService) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {

        AuthService.register($scope.registration);
        
        ngDialog.close();

    };
}])
;