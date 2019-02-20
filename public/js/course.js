function courseDialogController($scope, $http, $mdDialog, $timeout){
			var cm=this ;
			cm.course_class=null ;
			cm.course_classes=null ;

			cm.loadClasses=function(){

				$http({ method: 'GET', url: '/class'})
					.then(function successCallback(response) {
						var data=response.data ;	
						return $timeout(function() {
							 $scope.course_classes =  $scope.course_classes || data ; 
						},650) ;
					  }, function errorCallback(response) {
				   			console.log(response) ;
				});		
			}

			cm.classValidate=function(){
				if(cm.course_class){
					$('#class_year').show() ;
					 $scope.cyears=null ;
				}
				return false ;
			}
			cm.loadClassYear=function(){
				var cdata=cm.course_class ;
				if(cdata.type=='Ingenierie Class'){
						return $timeout(function() {
					      $scope.cyears =  $scope.cyears  || [
					        { name: 'First Year' },
					        { name: 'Second Year' },
					        { name: 'Last Year' }
					      ];

						}, 650);
				}
				else{
						return $timeout(function() {
					      $scope.cyears =  $scope.cyears  || [
					        { name: 'First Year' },
					        { name: 'Second Year' }
					      ];
						}, 650);
				}
				return false ;
			} 
			cm.add=function(){
				var class_date=cm.course_class ;
				var year_data=cm.cyear ;
              	var course_data={name:cm.name, code:cm.code, description:cm.desc, class_year:year_data.name, class_id:class_date.id} ;
				$http({ method: 'POST', url: '/course',data:course_data})
					.then(function successCallback(response) {
							cm.name=null; cm.code=null ; cm.desc=null ;	cm.course_class=null ; cm.cyear=null ;
							$('#class_year').hide() ;
							alertify.notify('Course Succefully Added', 'message', 10) ; 
					  }, function errorCallback(response) {
				   			console.log(response) ;
				});    

			}
			
		}

function acourseDialogController($scope, $http, $mdDialog, $timeout, $compile){
			var cam=this ;
			cam.years=null ;
			cam.lessonDisable=true ;

			var table, srow ;
			
			var c_n=false, c_a=false, c_d=false, c_y=false, c_c=false ; 
			var getCourses=function(){
				$http({ method: 'GET', url: '/course'})
					.then(function successCallback(response) {
						var data=response.data ;		
						$scope.courses=data;

						$timeout(function(){
							table=$('#courseTable').DataTable();
							$("#lesson").addClass("w3-grey") ;
							$('#courseTable tbody').on( 'click', 'tr', function () {
								srow=this ;
						        if ( $(this).hasClass('selected') ) {
						            $(this).removeClass('selected');
						            cam.lessonDisable=true ;
						            $("#lesson").addClass("w3-grey") ;
						        	$("#lesson").removeClass("w3-blue") ;
						        	$("#lesson").removeClass("w3-hover-blue-grey") ;
						        }
						        else {
						        	cam.lessonDisable=false ;
						        	$("#lesson").removeClass("w3-grey") ;
						        	$("#lesson").addClass("w3-blue") ;
						        	$("#lesson").addClass("w3-hover-blue-grey") ;
						            table.$('tr.selected').removeClass('selected');
						            $(this).addClass('selected');

						        }
						    });
 
						},700) ;
					  }, function errorCallback(response) {
				   			console.log(response) ;
					});		
			}
			getCourses() ;

			cam.delete=function(id){
				$http({method: 'DELETE',url:'/course/'+id})
					.then(function successCallback(response) {
								getCourses() ;
						  }, function errorCallback(response) {
					   			console.log(response) ;
						});		
			}

			cam.showLessons=function(ev){
				var data = table.row(srow).data();
				console.log(data[0]) ;
				$mdDialog.cancel() ;
				$mdDialog.show({
					  controller:alDialogController,
					  controllerAs:'lam',
				      templateUrl: '../template/allLessonT.html',
				      parent: angular.element(document.body),
				      targetEvent: ev,
				      clickOutsideToClose:true,
				      fullscreen: $scope.customFullscreen, 
				      locals:{courseId:data[0]}

				}) ;
				
			}
			cam.modifyCourseName=function(name,id){
				c_n=true ;
				$("#name_"+id).empty() ;
				$("#modify").show() ;
				$("#modify_"+id).show() ;
				$("#name_"+id).append("<md-input-container>"+
                    						"<label layout layout-align='left'>Course Name</label>"+
                     						" <input ng-model='cam.name'>"+
          								"</md-input-container>");

				setTimeout(function(){
					$compile($("#name_"+id).contents())($scope) ;
					cam.name=name ;
				},100) ;
			}
			cam.modifyCourseCode=function(code,id){
				c_a=true ;
				$("#code_"+id).empty() ;
				$("#modify").show() ;
				$("#modify_"+id).show() ;
				$("#code_"+id).append("<md-input-container>"+
                    						"<label layout layout-align='left'>Course Abbreviation</label>"+
                     						" <input ng-model='cam.code'>"+
          								"</md-input-container>");

				setTimeout(function(){
					$compile($("#code_"+id).contents())($scope) ;
					cam.code=code ;
				},100) ;
			}
			cam.modifyCourseDesc=function(desc,id){
				c_d=true ;
				$("#desc_"+id).empty() ;
				$("#modify").show() ;
				$("#modify_"+id).show() ;
				$("#desc_"+id).append("<md-input-container>"+
                    						"<label layout layout-align='left'>Course Abbreviation</label>"+
                     						"  <textarea ng-model='cam.desc' md-maxlength='150' rows='3' md-select-on-focus></textarea>"+
          								"</md-input-container>");

				setTimeout(function(){
					$compile($("#desc_"+id).contents())($scope) ;
					cam.desc=desc ;
				},100) ;
			}

			cam.loadYear=function(type){

				if(year_change){
					 $scope.years=null ;
					 $scope.year=null ;
				}
				
				if(type=='Ingenierie Class'){
						return $timeout(function() {
					      $scope.years =  $scope.years  || [
					        { name: 'First Year' },
					        { name: 'Second Year' },
					        { name: 'Last Year' }
					      ];

						}, 650);
				}
				else{
						return $timeout(function() {
					      $scope.years =  $scope.years  || [
					        { name: 'First Year' },
					        { name: 'Second Year' }
					      ];
						}, 650);
				}
				return false ;
			} 
			var year_change=false ;

			cam.modifyCourseYear=function(type,id){
				c_y=true ;
				if(!year_change){
					cam.type=type ;
				}
				$("#year_"+id).empty() ;
				$("#modify").show() ;
				$("#modify_"+id).show() ;
				$("#year_"+id).append("<md-select placeholder='Set Course Year' ng-model='cam.year' md-on-open='cam.loadYear(cam.type)' style='min-width: 200px;'>"+
             							 "<md-option ng-value='year' ng-repeat='year in years'>{{year.name}}</md-option>"+
           								"</md-select>");

				setTimeout(function(){
					$compile($("#year_"+id).contents())($scope) ;
					
				},100) ;
			}

			cam.loadClasses=function(){
				$http({ method: 'GET', url: '/class'})
					.then(function successCallback(response) {
						var data=response.data ;	
						return $timeout(function() {
							 $scope.course_classes =  $scope.course_classes || data ; 
						},650) ;
					  }, function errorCallback(response) {
				   			console.log(response) ;
					});		
			}
			cam.check=function(first, last,id){
				
				if(first!=last){
					if(!c_y){
						cam.modifyCourseYear(first,id) ;
					}			
					cam.year=null ;	
					cam.type=last ;
					year_change=true ;
					return true ;
				}
				year_change=false ;
				return false ;
				
			}

			cam.modifyCourseClass=function(ftype, id){
				c_c=true ;
				
				cam.ftype=ftype ;
				cam.id=id;
				$("#class_"+id).empty() ;
				$("#modify").show() ;
				$("#modify_"+id).show() ;
				$("#class_"+id).append("<md-select placeholder='Set Course Class' md-on-close='cam.check(cam.ftype, cam.course_class.type,cam.id)' ng-model='cam.course_class' md-on-open='cam.loadClasses()' style='min-width: 200px;'>"+
             							 "<md-option ng-value='course_class' ng-repeat='course_class in course_classes'>{{course_class.name}}</md-option>"+
           								"</md-select>");

				setTimeout(function(){
					$compile($("#class_"+id).contents())($scope) ;

				},100) ;
			}
			cam.validateModify=function(id){

				var udata='{"id":"'+id+'"' ; 

				if(c_n){
					udata=udata+', "name":"'+cam.name+'"' ;
				}
				if(c_a){
					udata=udata+', "code":"'+cam.code+'"' ;
				}
				if(c_d){
					udata=udata+', "desc":"'+cam.desc+'"' ;
				}
				if(c_y){
					udata=udata+', "year":"'+cam.year.name+'"' ;
				}
				if(c_c){
					udata=udata+', "class":"'+cam.course_class.id+'"' ;
				}
				udata=JSON.parse(udata+'}') ;
			
				$http({ method: 'POST', url: '/ucourse',data:udata})
					.then(function successCallback(response) {
						if(c_n){
							$("#name_"+id).empty() ;
							$("#name_"+id).append(
	 							"<md-button ng-click='cam.modifyCourseName(\""+cam.name+"\","+id+")'>"
	 							+"<md-tooltip md-direction='left'>Modify Name</md-tooltip>"
	 							+cam.name
	                          	+"</md-button>") ;
							setTimeout(function(){
								$compile($("#name_"+id).contents())($scope) ;
							},100) ;
							c_n=false ;
						}
						if(c_a){
							$("#code_"+id).empty() ;
							$("#code_"+id).append(
								"<md-button ng-click='cam.modifyCourseCode(\""+cam.code+"\","+id+")'>"
	 							+"<md-tooltip md-direction='left'>Modify Abbreviation</md-tooltip>"
	 							+cam.code
	                          	+"</md-button>") ;
							setTimeout(function(){
								$compile($("#code_"+id).contents())($scope) ;
							},100) ;
							c_a=false ;
						}
						if(c_d){
							$("#desc_"+id).empty() ;
							$("#desc_"+id).append(
								"<md-button ng-click='cam.modifyCourseDesc(\""+cam.desc+"\","+id+")'>"
	 							+"<md-tooltip md-direction='left'>Modify Description</md-tooltip>"
	 							+cam.desc
	                          	+"</md-button>") ;
							setTimeout(function(){
								$compile($("#desc_"+id).contents())($scope) ;
							},100) ;
							c_d=false ;
						}
						if(c_y){
							$("#year_"+id).empty() ;
							$("#year_"+id).append(cam.year.name) ;
							c_y=false ;
						}
						if(c_c){
							$("#class_"+id).empty() ;
							$("#class_"+id).append(
								"<md-button ng-click='cam.modifyCourseClass(\""+cam.course_class.type+"\","+id+")'>"
	 							+"<md-tooltip md-direction='left'>Modify Description</md-tooltip>"
	 							+cam.course_class.name
	                          	+"</md-button>") ;
							setTimeout(function(){
								$compile($("#class_"+id).contents())($scope) ;
							},100) ;
							c_c=false ;
						}
					
						$("#modify").hide() ;
						$("#modify_"+id).hide() ;
					  }, function errorCallback(response) {
				   			console.log(response) ;
				});
			}

		}