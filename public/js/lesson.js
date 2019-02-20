
	function lDialogController($mdDialog,$timeout, $scope, $http){
		var lm=this ;
		$scope.courses=null ;
		$scope.course=null ;

		lm.loadCourses=function(){
			$http({ method: 'GET', url: '/course'})
					.then(function successCallback(response) {
						var data=response.data ;		
						return $timeout(function() {
							 $scope.courses =  $scope.courses || data ; 
						},650) ;

					  }, function errorCallback(response) {
				   			console.log(response) ;
					});		
		}
		lm.add=function(){
				
              	var course_data={name:lm.name, code:lm.code, description:lm.desc, course_id:lm.course.id} ;
				$http({ method: 'POST', url: '/lesson',data:course_data})
					.then(function successCallback(response) {
						lm.name=null; lm.code=null ; lm.desc=null ;	lm.course=null ; 
						alertify.notify('Lesson succefully Added', 'message', 10) ; 
					  }, function errorCallback(response) {
				   			console.log(response) ;
				});    

		}

	}

function alDialogController($scope, $http, $mdDialog, $timeout, $compile, courseId){

			var lam=this ;
			var l_n=false, l_a=false, l_d=false ;
			lam.viewCourses=function(ev){
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
			var getLessons=function(){
				$http({ method: 'GET', url: '/lesson/'+courseId})
					.then(function successCallback(response) {
						var data=response.data ;		
						$scope.lessons=data;
						$timeout(function(){
							table=$('#lessonTable').DataTable();
						},700) ;
					  }, function errorCallback(response) {
				   			console.log(response) ;
					});		
			}
			getLessons() ;

			lam.delete=function(id){
				$http({method: 'DELETE',url:'/lesson/'+id})
					.then(function successCallback(response) {
								getLessons() ;
						  }, function errorCallback(response) {
					   			console.log(response) ;
						});		
			}
			lam.modifyLessonName=function(name,id){
				console.log(name) ;
				l_n=true ;
				$("#name_"+id).empty() ;
				$("#modify").show() ;
				$("#modify_"+id).show() ;
				$("#name_"+id).append("<md-input-container>"+
                    						"<label layout layout-align='left'>Lesson Name</label>"+
                     						" <input ng-model='lam.name'>"+
          								"</md-input-container>");

				setTimeout(function(){
					$compile($("#name_"+id).contents())($scope) ;
					lam.name=name ;
				},100) ;
			}
			lam.modifyLessonCode=function(code,id){
				l_a=true ;
				$("#code_"+id).empty() ;
				$("#modify").show() ;
				$("#modify_"+id).show() ;
				$("#code_"+id).append("<md-input-container>"+
                    						"<label layout layout-align='left' >Lesson Abbreviation</label>"+
                     						" <input ng-model='lam.code'>"+
          								"</md-input-container>");
				setTimeout(function(){
					$compile($("#code_"+id).contents())($scope) ;
					lam.code=code ;
				},100) ;
			}
			lam.modifyLessonDesc=function(desc,id){
				l_d=true ;
				$("#desc_"+id).empty() ;
				$("#modify").show() ;
				$("#modify_"+id).show() ;
				$("#desc_"+id).append("<md-input-container>"+
                    						"<label layout layout-align='left'>Lesson Description</label>"+
                     						" <input ng-model='lam.desc'>"+
          								"</md-input-container>");
				setTimeout(function(){
					$compile($("#desc_"+id).contents())($scope) ;
					lam.desc=desc ;
				},100) ;
			}

			lam.validateModify=function(id){

				var udata='{"id":"'+id+'"' ; 

				if(l_n){
					udata=udata+', "name":"'+lam.name+'"' ;
				}
				if(l_a){
					udata=udata+', "code":"'+lam.code+'"' ;
				}
				if(l_d){
					udata=udata+', "desc":"'+lam.desc+'"' ;
				}
			
				udata=JSON.parse(udata+'}') ;
			
				$http({ method: 'POST', url: '/ulesson',data:udata})
					.then(function successCallback(response) {
						if(l_n){
						//	console.log(lam.name) ;
							$("#name_"+id).empty() ;
							$("#name_"+id).append(
	 							"<md-button ng-click='lam.modifyLessonName(\""+lam.name+"\","+id+")'>"
	 							+"<md-tooltip md-direction='left'>Modify Name</md-tooltip>"
	 							+lam.name
	                          	+"</md-button>") ;
							setTimeout(function(){
								$compile($("#name_"+id).contents())($scope) ;
							},100) ;
							l_n=false ;
						}
						if(l_a){
							
							$("#code_"+id).empty() ;
							$("#code_"+id).append(
								  "<md-button ng-click='lam.modifyLessonCode(\""+lam.code+"\","+id+")')'>" 
                            	   +"<md-tooltip md-direction='left'>Modify Abbreviation</md-tooltip>"
                          			+lam.code
                         		   +"</md-button>") ;
							setTimeout(function(){
								$compile($("#code_"+id).contents())($scope) ;
							},100) ;
							l_a=false ;
						}
						if(l_d){
							$("#desc_"+id).empty() ;
							$("#desc_"+id).append(
								 +"<md-button ng-click='lam.modifyLessonDesc(\""+lam.desc+"\","+id+")')'>" 
		                             +"<md-tooltip md-direction='left'>Modify Description</md-tooltip>"
		                              +lam.desc
		                          +"</md-button>"	
								) ;
							setTimeout(function(){
								$compile($("#desc_"+id).contents())($scope) ;
							},100) ;
							l_d=false ;
						}
						$("#modify").hide() ;
						$("#modify_"+id).hide() ;
					  }, function errorCallback(response) {
				   			console.log(response) ;
				});
			}



}