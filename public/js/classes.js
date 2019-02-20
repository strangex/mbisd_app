
		function cDialogController($mdDialog,$timeout, $scope, $http){
			var tm=this ;
			tm.tclasses=null;
			tm.tclass=null ;

			tm.loadType = function(){
				console.log('fuck') ;
			 	return $timeout(function() {

				      $scope.tclasses =  $scope.tclasses  || [
				        { type: 'Master Class' },
				        { type: 'Ingenierie Class' },
				        { type: 'Preparatory Class' }
				      ];

				}, 650);
			} ;

			tm.add=function(){
				var rdata={name:tm.cname, code:tm.ccode, description:tm.cdesc, type:tm.ctype.type} ;
				$http({ method: 'POST', url: '/class',data:rdata})
					.then(function successCallback(response) {
							tm.cname=null ;	tm.ccode=null ; tm.cdesc=null ; tm.ctype=null ;
								alertify.notify('Class Succefully Added', 'message', 10) ; 
					  }, function errorCallback(response) {

				   			console.log(response) ;
				});		
			}

			tm.view=function(ev){
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
		};

		function aDialogController($mdDialog, $scope, $http,$timeout,$compile){
			var am=this ;

			var ct=false, cn=false, ca=false, cd=false ;

			am.loadType=function(){
			 	return $timeout(function() {

				      $scope.tclasses =  $scope.tclasses  || [
				        { type: 'Master Class' },
				        { type: 'Ingenierie Class' },
				        { type: 'Preparatory Class' }
				      ];

				}, 650);
			} ;
			
			var getClasses=function(){
				$http({ method: 'GET', url: '/class'})
					.then(function successCallback(response) {
						var data=response.data ;		
						$scope.aclasses=data;
						$timeout(function(){
							$('#classTable').DataTable();
						},700) ;
					  }, function errorCallback(response) {
				   			console.log(response) ;
					});		
			}
			getClasses() ;

			am.cdelete=function(cid){		
				$http({method: 'DELETE',url:'/class/'+cid})
					.then(function successCallback(response) {
								getClasses() ;
						  }, function errorCallback(response) {
					   			console.log(response) ;
						});		
			}

			am.modifyClassName=function(name,id){
				cn=true ;
				$("#cname_"+id).empty() ;
				$("#modify").show() ;
				$("#modify_"+id).show() ;
				$("#cname_"+id).append("<md-input-container>"+
                    						"<label>Class Name</label>"+
                     						" <input ng-model='am.cname'>"+
          								"</md-input-container>");

				setTimeout(function(){
					$compile($("#cname_"+id).contents())($scope) ;
					am.cname=name ;
				},100) ;

			}

			am.modifyClassAbbrv=function(abbrv,id){
				ca=true ;
				$("#cabbrv_"+id).empty() ;
				$("#modify").show() ;
				$("#modify_"+id).show() ;
				$("#cabbrv_"+id).append("<md-input-container>"+
                    						"<label>Class Abbreviation</label>"+
                     						" <input ng-model='am.cabbrv'>"+
          								"</md-input-container>");

				setTimeout(function(){
					$compile($("#cabbrv_"+id).contents())($scope) ;
					am.cabbrv=abbrv ;
				},100) ;

			}

			am.modifyClassDesc=function(desc,id){	
				cd=true ;		
				$("#cdesc_"+id).empty() ;
				$("#modify").show() ;
				$("#modify_"+id).show() ;
				$("#cdesc_"+id).append("<md-input-container>"+
                    						"<label>Class Description</label>"+
                     						"  <textarea ng-model='am.cdesc' md-maxlength='150' rows='3' md-select-on-focus></textarea>"+
          								"</md-input-container>");

				setTimeout(function(){
					$compile($("#cdesc_"+id).contents())($scope) ;
					am.cdesc=desc ;
				},100) ;

			}


			am.modifyClassType=function(type,id){
				ct=true ;
				$("#ctype_"+id).empty() ;
				$("#modify").show() ;
				$("#modify_"+id).show() ;
				$("#ctype_"+id).append("<md-select placeholder='Set Class type' ng-model='am.ctype' md-on-open='am.loadType()' style='min-width: 200px;'>"+
             							 "<md-option ng-value='tclass' ng-repeat='tclass in tclasses'>{{tclass.type}}</md-option>"+
           								"</md-select>");
				setTimeout(function(){
					$compile($("#ctype_"+id).contents())($scope) ;
				},100) ;

			}

			am.validateModify=function(cid){
				var ctype=am.ctype ;
				var udata={id:cid, name:am.cname, code:am.cabbrv, description:am.cdesc, type:ctype.type} ;
				$http({ method: 'POST', url: '/uclass',data:udata})
					.then(function successCallback(response) {
						if(cn){
							$("#cname_"+cid).empty() ;
							$("#cname_"+cid).append(am.cname) ;
							cn=false ;
						}
						if(ca){
							$("#cabbrv_"+cid).empty() ;
							$("#cabbrv_"+cid).append(am.cabbrv) ;
							ca=false ;
						}
						if(cd){
							$("#cdesc_"+cid).empty() ;
							$("#cdesc_"+cid).append(am.cdesc) ;
							cd=false ;
						}
						if(ct){
							$("#ctype_"+cid).empty() ;
							$("#ctype_"+cid).append(ctype.name) ;
							ct=false ;
						}
						$("#modify").hide() ;
						$("#modify_"+cid).hide() ;
					  }, function errorCallback(response) {

				   			console.log(response) ;
				});
			}
		}