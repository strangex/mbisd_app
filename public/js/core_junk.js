(function(){
	
	'use strict' ;

	angular
		.module('coreApp',['ngAnimate','ngAria','ngMaterial','angularCountryState','angularFileUpload','ng-fusioncharts'])
		.controller('coreController', function($scope, $timeout, $http, $mdSidenav, $mdDialog, $interval){
			var  vm=this ;
			var originatorEv;
			
			var progressBar=function(){
						vm.determinateValue += 1;
					   if (vm.determinateValue > 100) {
					   	 vm.determinateValue = 30;
				         vm.activated = false;
				        }
					}

			 vm.activated = true;
			 vm.determinateValue = 30;

		 	 $interval(function() {
		     		progressBar() ;
		      }, 100);
		 
			var user=function(){
				$http({ method: 'GET', url: '/user'})
					.then(function successCallback(response) {
						var data=response.data ;		
						$('.frontA').hide() ;
						$('.front').hide() ;
						$('.back').show() ;
						return data ;
					  }, function errorCallback(response) {
					  		$(".frontA").show() ;
					  		$timeout(function(){
					  			$(".front").show() ;
					  		},3000) ;
					  		$("#cover").delay(3000).fadeOut(1000) ;
					});		
			}

			user() ;
			

			vm.login=function(){
				$http({ method: 'POST', url: '/login', data:{email:vm.email, password:vm.password}})
					.then(function successCallback(response) {
				   			user() ;	
				   			alertify.notify('Successfully logged In', 'message', 10) ; 
				   		
				  }, function errorCallback(response) {
				   			console.log(response) ;
				   			alertify.error('Wrong Credentials Please Do Try Again', 'message', 10) ;    
				  });
			} ;
			
			vm.logout=function(){
				$http({method:'POST', url:'/logout'})
				.then(function successCallback(response) {
						$('.back').hide() ;
						$('.front').show() ;
						$interval(function() {
					     		progressBar() ;
					      }, 200);
						$("#cover").delay(3000).fadeOut(1000) ; 
						//var note=alertify.message('Successfully logged Out', 'custom', 0) ; 	
				  }, function errorCallback(response) {
				   			console.log(response) ;
				  });
			}

			vm.openMenu = function($mdMenu, ev) {
		      originatorEv = ev;
		      $mdMenu.open(ev);
		    };


		    vm.addClass=function(ev){

	    		$mdDialog.show({
	    			  controller : cDialogController,
	    			  controllerAs:'tm',
				      templateUrl: '../template/classT.html',
				      parent: angular.element(document.body),
				      targetEvent: ev,
				      clickOutsideToClose:true,
				      fullscreen: $scope.customFullscreen
				});
			} ;

			vm.viewClasses=function(ev){
				$mdDialog.show({
					  controller:aDialogController,
					  controllerAs:'am',
				      templateUrl: '../template/allClassT.html',
				      parent: angular.element(document.body),
				      targetEvent: ev,
				      clickOutsideToClose:true,
				      fullscreen: $scope.customFullscreen
				});
			}


		    vm.addStudent=function(ev){

	    		$mdDialog.show({
	    			  controller : sDialogController,
	    			  controllerAs:'sm',
				      templateUrl: '../template/studentT.html',
				      parent: angular.element(document.body),
				      targetEvent: ev,
				      clickOutsideToClose:true,
				      fullscreen: $scope.customFullscreen,
				      onComplete:function(){

				      	 $("#sphone").intlTelInput({      
		                	   autoHideDialCode: false,
		                   geoIpLookup: function(callback) {
		                     $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
		                       var countryCode = (resp && resp.country) ? resp.country : "";
		                       callback(countryCode);
		                     });
		                   },
		                   initialCountry: "auto",
		                   separateDialCode: true,
		                   utilsScript: "node_modules/intl-tel-input/build/js/utils.js"
		                });
		             }
				});

			} 

			vm.viewStudents=function(ev){
				$mdDialog.show({
					  controller:asDialogController,
					  controllerAs:'sam',
				      templateUrl: '../template/allStudentT.html',
				      parent: angular.element(document.body),
				      targetEvent: ev,
				      clickOutsideToClose:true,
				      fullscreen: $scope.customFullscreen
				});
			}

			vm.addCourse=function(ev){
				$mdDialog.show({
					  controller:courseDialogController,
					  controllerAs:'cm',
				      templateUrl: '../template/courseT.html',
				      parent: angular.element(document.body),
				      targetEvent: ev,
				      clickOutsideToClose:true,
				      fullscreen: $scope.customFullscreen
				});
			}
			vm.viewCourses=function(ev){
				$mdDialog.show({
					  controller:acourseDialogController,
					  controllerAs:'cam',
				      templateUrl: '../template/allcourseT.html',
				      parent: angular.element(document.body),
				      targetEvent: ev,
				      clickOutsideToClose:true,
				      fullscreen: $scope.customFullscreen
				});
			}
			vm.addLesson=function(ev){
				$mdDialog.show({
					  controller:lDialogController,
					  controllerAs:'lm',
				      templateUrl: '../template/lessonT.html',
				      parent: angular.element(document.body),
				      targetEvent: ev,
				      clickOutsideToClose:true,
				      fullscreen: $scope.customFullscreen
				});
			}

			vm.manage=function(ev){
				$mdDialog.show({
					  controller:attDialogController,
					  controllerAs:'vam',
				      templateUrl: '../template/attendance.html',
				      parent: angular.element(document.body),
				      targetEvent: ev,
				      clickOutsideToClose:true,
				      fullscreen: $scope.customFullscreen
				});
			}
			vm.astatistics=function(ev){
				$mdDialog.show({
					  controller:aStatisticsDialogController,
					  controllerAs:'stam',
				      templateUrl: '../template/astatistics.html',
				      parent: angular.element(document.body),
				      targetEvent: ev,
				      clickOutsideToClose:true,
				      fullscreen: $scope.customFullscreen
				});
			}
			vm.importActors=function(ev){
				$mdDialog.show({
					  controller:ImportsDialogController,
					  controllerAs:'im',
				      templateUrl: '../template/imports.html',
				      parent: angular.element(document.body),
				      targetEvent: ev,
				      clickOutsideToClose:true,
				      fullscreen: $scope.customFullscreen
				});
			}
			
			$http({ method: 'GET', url: '/nclass'})
					.then(function successCallback(response) {
						var sdata=response.data ;
						$timeout(function(){
							var nodes = new vis.DataSet(sdata.nodes);
							var edges = new vis.DataSet(sdata.edges) ;
							var container = document.getElementById('mynetwork');
						    var data = {
						        nodes: nodes,
						        edges: edges
						    };
						    var options = {
						    	 height: '100%',
			  					width: '100%'
						    };
						    var network = new vis.Network(container, data, options);
						},200) ;
						
					  }, function errorCallback(response) {
		    			console.log(response) ;
			});	
		}) ;
	

	
})() ;

 