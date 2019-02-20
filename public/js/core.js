(function(){
	
	'use strict' ;

	angular
		.module('mbiscApp',['chart.js','ng-fusioncharts','timer','slick','betsol.intlTelInput','ui.calendar','ui.router.title','ui.router', 'ui.router.stateHelper', 'satellizer','ngAnimate','ngAria','ngMaterial','ngMessages','angularCountryState','angularFileUpload'])
		.config(function($mdThemingProvider, $mdToastProvider, $provide, $httpProvider, intlTelInputOptions, $urlRouterProvider, $stateProvider, $authProvider){	
			 
			 $mdThemingProvider.theme('cyan', 'default').primaryPalette('cyan');
			 $mdThemingProvider.theme('pink', 'default').primaryPalette('pink');

			 $mdToastProvider.addPreset('modify', {
				  options: function() {
				    return {
				      template:
				        '<md-toast id="modifyT">' +
				          '<div ng-click="cd.validate()" class="w3-blue w3-hover-blue-grey md-toast-content">' +
				            'Validez la Modification' +
				            '<md-icon style="margin-left: 30%" md-svg-src="icons/ic_check_white_24px.svg" ></md-icon>'+
				          '</div>' +
				        '</md-toast>',
				       position:"top right",
				       hideDelay:0
				    };
				  }
			});
			 $mdToastProvider.addPreset('list', {
				  options: function() {
				    return {
				      template:
				        '<md-toast id="listT">' +
				          '<div class="md-toast-content">' +
				            '<span>Désirez vous télécharger la liste sous forme d\'un fichier pdf ou csv? </span>' +
				            '<a ng-click="admin.pdf(true,admin.number)" class="btn waves-effect waves-light blue">PDF</a>'+
				            '<a ng-click="admin.pdf(false,admin.number)" style=" margin-left:1%;" class="btn waves-effect waves-light pink">CSV</a>'+
				          '</div>' +
				        '</md-toast>',
				       position:"top right",
				       hideDelay:0
				    };
				  }
			});
			 

			  $mdToastProvider.addPreset('confirmU', {
				  options: function() {
				    return {
				      template:
				        '<md-toast id="confirmT">' +
				          '<div class="md-toast-content">' +
				            '<span>Désirez vous vraiment recharger un autre fichier? (Notez que l\'ancien sera supprimé) </span>' +
				            '<a ng-click="cd.validU(true)" style="height: 30px;width: 30px;" class="btn-floating  waves-effect waves-light blue"><i style="margin-top: -4px;" class="material-icons" >check</i></a>'+
				            '<a ng-click="cd.validU(false)" style="height: 30px;width: 30px; margin-left:1%" class="btn-floating waves-effect waves-light pink"><i style="margin-top: -4px;"  class="material-icons" >close</i></a>'+
				          '</div>' +
				        '</md-toast>',
				       position:"top right",
				       hideDelay:0
				    };
				  }
			});

			 $mdToastProvider.addPreset('import', {
				  options: function() {
				    return {
				      template:
				        '<md-toast id="uploadT">' +
				          '<div ng-click="cd.uploadV($event)" class="w3-red w3-hover-pink md-toast-content">' +
				            'Afin de completer votre inscription voulez importer votre fichier de candidature' +
				            '<md-icon style="margin-left: 30%" md-svg-src="icons/ic_file_upload_white_24px.svg" ></md-icon>'+
				          '</div>' +
				        '</md-toast>',
				       position:"top right",
				       hideDelay:0
				    };
				  }
			});

			$mdToastProvider.addPreset('score', {
				  options: function() {
				    return {
				      template:
				        '<md-toast id="scoreT">' +
				          '<div ng-click="admin.scoreV($event)" class="w3-red w3-hover-pink md-toast-content">' +
				            'Afin d\'afficher la liste des sélectionnés vous devez affecter les scores!' +
				            '<md-icon style="margin-left: 30%" md-svg-src="icons/ic_check_white_24px.svg" ></md-icon>'+
				          '</div>' +
				        '</md-toast>',
				       position:"top right",
				       hideDelay:0
				    };
				  }
			}); 
			 $mdToastProvider.addPreset('confirmMo', {
				  options: function() {
				    return {
				      template:
				        '<md-toast id="confirmMoT">' +
				          '<div class="md-toast-content">' +
				            '<span>Désirez vous vraiment supprimez ce module et ses matières?  </span>' +
				            '<a ng-click="admin.deleteCMo(true)" style="height: 30px;width: 30px;" class="btn-floating  waves-effect waves-light w3-text-blue"><i style="margin-top: -4px;" class="material-icons" >check</i></a>'+
				            '<a ng-click="admin.deleteCMo(false)" style="height: 30px;width: 30px; margin-left:1%" class="btn-floating waves-effect waves-light pink"><i style="margin-top: -4px;"  class="material-icons" >close</i></a>'+
				          '</div>' +
				        '</md-toast>',
				       position:"top right",
				       hideDelay:0
				    };
				  }
			});


			 function redirectWhenLoggedOut($q, $injector) {
		        return {
		          responseError: function(rejection) {
		            // Need to use $injector.get to bring in $state or else we get
		            // a circular dependency error
		            var $state = $injector.get('$state');
		            // Instead of checking for a status code of 400 which might be used
		            // for other reasons in Laravel, we check for the specific rejection
		            // reasons to tell us if we need to redirect to the login state
		            var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];
		            // Loop through each rejection reason and redirect to the login
		            // state if one is encountered
		            angular.forEach(rejectionReasons, function(value, key) {

		              if(rejection.data.error === value) {
		              	 if(localStorage.getItem('userFlag')=="admin"){
		              	 	  $("#my-menu").hide() ;
		              	 }
		                  // If we get a rejection corresponding to one of the reasons
		                  // in our array, we know we need to authenticate the user so 
		                  // we can remove the current user from local storage
		                  localStorage.removeItem('userFlag');
		                  localStorage.removeItem('userId');
		                  // Send the user to the auth state so they can login
		                  $state.go('home');
		                  alertify.error("Connexion has expired",10) ;
		              }
		            });
		            return $q.reject(rejection);
		          }
		        }
		     }
      		// Setup for the $httpInterceptor
   			$provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);

    		// Push the new factory onto the $http interceptor array
    		$httpProvider.interceptors.push('redirectWhenLoggedOut');

    		$httpProvider.interceptors.push(function() {
				  return {
				   'request': function(config) {
				        config.headers['userFlag'] = localStorage.getItem("userFlag");
				        return config;
				    }
				  };
				});


			 angular.extend(intlTelInputOptions, {
			 	 geoIpLookup: function(callback) {
			                     $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
			                       var countryCode = (resp && resp.country) ? resp.country : "";
			                       callback(countryCode);
			                     });
			                   },
			      initialCountry: "auto",
			      separateDialCode: true,
			      nationalMode: false,
			      utilsScript: "node_modules/intl-tel-input/build/js/utils.js",
			      defaultCountry: 'auto',
			      preferredCountries: ['ru', 'kz'],
			      autoFormat: true,
			      autoPlaceholder: true

			    });
			$authProvider.loginUrl = '/authenticate';
            $urlRouterProvider.otherwise('/home');
            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: '../template/home.html',
                    controller: 'HomeController as home',
                    resolve:{
					      $title: function() { return 'Accueil'; }
					 }
                })
                .state('admin', {
                    url: '/admin',
                    templateUrl: '../template/adminDash.html',
                    controller: 'AdminController as admin',
                    data: {
                    	loginRequired:true
                    },
                    resolve:{
					      $title: function() { return 'Admin Dashboard'; }
					 }
                })
                .state('candidate', {
                    url: '/candidate',
                    templateUrl: '../template/candidateInf.html',
                    controller: 'CandidateController as cd',
                    data: {
                    	loginRequired:true
                    },
                    resolve:{
					      $title: function() { return 'Candidate Info'; }
					 }
                }) ;
		}).run(function($rootScope, $timeout, $auth, $state){
	    	 $rootScope.$on('$stateChangeStart', function(event, toState) {
	    	 		var loginRequired = false ;
	    	 		if(toState.data && toState.data.loginRequired) loginRequired =true ;
	    	 		else if(loginRequired && !$auth.isAuthenticated()){
	    	 			event.preventDefault() ;

	    	 			$state.go('home') ;
	    	 			return false ;
	    	 		}
	    	 		else if($auth.isAuthenticated()){
	    	 			event.preventDefault() ;
	    	 			var flag =localStorage.getItem('userFlag');
	    	 			$state.go(flag) ;
	    	 				
	    	 			return false ;
	    	 		}
	    	 		return false ;
	    	 }) ;
	    });
	

	
})() ;

 