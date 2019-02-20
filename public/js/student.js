function sDialogController($scope,$mdDialog,$timeout,$http){
			var sm=this ;
			sm.sdate = new Date();
			
			sm.sex=null ;
			sm.sexes=null ;

			sm.sclasses=null;	sm.ssubclasses=null;
			sm.sclass=null;	sm.ssubclass=null;

			sm.loadSex = function(){
			 	return $timeout(function() {

				      $scope.sexes =  $scope.sexes  || [
				        { type: 'Male' },
				        { type: 'Female' }
				      ];

				}, 650);
			} ;

			sm.loadSClasses=function(){
				$http({ method: 'GET', url: '/class'})
					.then(function successCallback(response) {
						var data=response.data ;	
						return $timeout(function() {
							 $scope.sclasses =  $scope.sclasses || data ; 
						},650) ;
					  }, function errorCallback(response) {
				   			console.log(response) ;
					});		
			}
			sm.sclassValidate=function(){
				if(sm.sclass){
					$('#subClasses').show() ;
					 $scope.ssubclasses=null ;
				}
				return false ;
			}
			sm.loadSSubClasses=function(){
				var cdata=sm.sclass ;
				if(cdata.type=='Ingenierie Class'){
						return $timeout(function() {
					      $scope.ssubclasses =  $scope.ssubclasses  || [
					        { name: 'First Year' },
					        { name: 'Second Year' },
					        { name: 'Last Year' }
					      ];

						}, 650);
				}
				else{
						return $timeout(function() {
					      $scope.ssubclasses =  $scope.ssubclasses  || [
					        { name: 'First Year' },
					        { name: 'Second Year' }
					      ];
						}, 650);
				}
				return false ;
			} 
			sm.sadd=function(){
				
				 var st_sex=sm.sex ;
				 var st_class=sm.sclass;
				 var st_subclass=sm.ssubclass ;	

		        var year=sm.sdate.getFullYear() ;
                var month=sm.sdate.getMonth()+1 ;
                var day=sm.sdate.getDate() ;
                var sDate=year+"-"+month+"-"+day ;  


              var sdata={country:sm.scountry, city:sm.scity, fname:sm.sfname, lname:sm.slname, cin:sm.scin, cne:sm.scne, phone:sm.sphone, email:sm.semail, sex:st_sex.type, classid:st_class.id, class_year:st_subclass.name, address:sm.saddress, bdate:sDate} ;
				$http({ method: 'POST', url: '/student',data:sdata})
					.then(function successCallback(response) {
							sm.scountry=null; sm.scity=null ; sm.sfname=null ;	sm.slname=null ; sm.scin=null ; sm.scne=null ; sm.sphone=null; sm.semail=null; sm.sex=null; sm.sclass=null; sm.ssubclass=null;  sm.saddress=null; sm.sdate=new Date() ;
							$('#subClasses').hide() ;
					  }, function errorCallback(response) {

				   			console.log(response) ;
				});    

			}

		
}

function asDialogController($mdDialog,$timeout, $scope, $http, $compile){
			var sam=this; 
			var sf=false, sl=false, scn=null, sci=null, sem=null ;


			var getStudents=function(){
				$http({ method: 'GET', url: '/student'})
					.then(function successCallback(response) {
						var data=response.data ;		
						$scope.astudents=data;
						$timeout(function(){
							$('#studentTable').DataTable();

							$("#sview").mCustomScrollbar({theme:"minimal-dark"});
						},700) ;
					  }, function errorCallback(response) {
				   			console.log(response) ;
					});		
			}
			getStudents() ;

			sam.sdelete=function(sid){		
				$http({method: 'DELETE',url:'/student/'+sid})
					.then(function successCallback(response) {
								getStudents() ;
						  }, function errorCallback(response) {
					   			console.log(response) ;
						});		
			}
			sam.sview=function(ev,student){
				$mdDialog.show({
	    			  controller : vsDialogController,
	    			  controllerAs:'vsm',
				      templateUrl: '../template/studentViewT.html',
				      parent: angular.element(document.body),
				      targetEvent: ev,
				      clickOutsideToClose:true,
				      fullscreen: $scope.customFullscreen,
				      locals:{student:student}
				});
			}
			sam.modifyStudentFName=function(fname,id){
				sf=true ;
				$("#sfname_"+id).empty() ;
				$("#modify").show() ;
				$("#smodify_"+id).show() ;
				$("#sfname_"+id).append("<md-input-container>"+
                    						"<label>First Name</label>"+
                     						" <input ng-model='sam.sfname'>"+
          								"</md-input-container>");

				setTimeout(function(){
					$compile($("#sfname_"+id).contents())($scope) ;
					sam.sfname=fname ;
				},100) ;
			}
			sam.modifyStudentLName=function(lname,id){
				sl=true ;
				$("#slname_"+id).empty() ;
				$("#modify").show() ;
				$("#smodify_"+id).show() ;
				$("#slname_"+id).append("<md-input-container>"+
                    						"<label>Last Name</label>"+
                     						" <input ng-model='sam.slname'>"+
          								"</md-input-container>");

				setTimeout(function(){
					$compile($("#slname_"+id).contents())($scope) ;
					sam.slname=lname ;
				},100) ;

			}
			sam.modifyStudentCIN=function(cin,id){
				sci=true ;
				$("#scin_"+id).empty() ;
				$("#modify").show() ;
				$("#smodify_"+id).show() ;
				$("#scin_"+id).append("<md-input-container>"+
                    						"<label>CIN</label>"+
                     						" <input ng-model='sam.scin'>"+
          								"</md-input-container>");

				setTimeout(function(){
					$compile($("#scin_"+id).contents())($scope) ;
					sam.scin=cin ;
				},100) ;
			}
			sam.modifyStudentCNE=function(cne,id){
				scn=true ;
				$("#scne_"+id).empty() ;
				$("#modify").show() ;
				$("#smodify_"+id).show() ;
				$("#scne_"+id).append("<md-input-container>"+
                    						"<label>CNE</label>"+
                     						" <input ng-model='sam.scne'>"+
          								"</md-input-container>");

				setTimeout(function(){
					$compile($("#scne_"+id).contents())($scope) ;
					sam.scne=cne ;
				},100) ;
			}
			sam.modifyStudentEmail=function(email,id){
				sem=true ;
				$("#semail_"+id).empty() ;
				$("#modify").show() ;
				$("#smodify_"+id).show() ;
				$("#semail_"+id).append("<md-input-container>"+
                    						"<label>Email</label>"+
                     						" <input ng-model='sam.semail'>"+
          								"</md-input-container>");

				setTimeout(function(){
					$compile($("#semail_"+id).contents())($scope) ;
					sam.semail=email ;
				},100) ;
			}
			sam.validateModify=function(sid){
				
				var udata={id:sid, fname:sam.sfname, lname:sam.slname, cin:sam.scin, cne:sam.scne, email:sam.semail} ;
				$http({ method: 'POST', url: '/ustudent',data:udata})
					.then(function successCallback(response) {
						if(sf){
							$("#sfname_"+sid).empty() ;
							$("#sfname_"+sid).append(sam.sfname) ;
							sf=false ;
						}
						if(sl){
							$("#slname_"+sid).empty() ;
							$("#slname_"+sid).append(sam.slname) ;
							sl=false ;
						}
						if(sci){
							$("#scne_"+sid).empty() ;
							$("#scne_"-+sid).append(sam.scne) ;
							sci=false ;
						}
						if(scn){
							$("#scin_"+sid).empty() ;
							$("#scin_"+sid).append(sam.scin) ;
							scn=false ;
						}
						if(sem){
							$("#semail_"+sid).empty() ;
							$("#semail_"+sid).append(sam.semail) ;
							sem=false ;
						}
					
						$("#modify").hide() ;
						$("#smodify_"+sid).hide() ;
					  }, function errorCallback(response) {

				   			console.log(response) ;
				});
			}
	}

function vsDialogController($mdDialog,$timeout, $scope, $http, $compile, student){
		var vsm=this ;
		var udata= new FormData();
		udata.append("id",student.id) ;
		vsm.back=function(ev){
			$mdDialog.cancel() ;
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
		vsm.student=student ;
		vsm.avatar=function(){
			$("#avatar").click() ;
		}
		var getStudentClass=function(){
			$http({ method: 'GET', url: '/class/'+student.uclass_id})
					.then(function successCallback(response) {
						var data=response.data ;	
						$scope.class=data;
					  }, function errorCallback(response) {
				   			console.log(response) ;
			});		
		}
		getStudentClass() ;

		var getStudentAvatar=function(avatar){
			$http({ method: 'GET', url: '/student/'+avatar, responseType: 'arraybuffer'})
					.then(function successCallback(response) {
						var data=response.data ;
						var str = _arrayBufferToBase64(data);
						$scope.profileAvatar = 'data:image/gif;base64,'+str;
					  }, function errorCallback(response) {
				   			console.log(response) ;
			});		
		}
		getStudentAvatar(vsm.student.avatar) ;

		vsm.modifyStudentFName=function(fname,id){
				sf=true ;
				$(".fname").remove() ;

				$("#fname").append("<md-input-container>"+
                    						"<label>First Name</label>"+
                     						" <input ng-model='vsm.sfname'>"+
          								"</md-input-container>");

				setTimeout(function(){
					$compile($("#fname").contents())($scope) ;
					vsm.sfname=fname ;
				},100) ;
		}
		vsm.modifyStudentLName=function(lname,id){
				sf=true ;
				$(".lname").remove() ;

				$("#lname").append("<md-input-container>"+
                    						"<label>Last Name</label>"+
                     						" <input ng-model='vsm.slname'>"+
          								"</md-input-container>");

				setTimeout(function(){
					$compile($("#lname").contents())($scope) ;
					vsm.slname=lname ;
				},100) ;
		}
		vsm.modifyStudentCin=function(cin,id){
				sf=true ;
				$(".cin").remove() ;

				$("#cin").append("<md-input-container>"+
                    						"<label>CIN</label>"+
                     						" <input ng-model='vsm.scin'>"+
          								"</md-input-container>");

				setTimeout(function(){
					$compile($("#cin").contents())($scope) ;
					vsm.scin=cin ;
				},100) ;
		}
		vsm.modifyStudentCne=function(cne,id){
				sf=true ;
				$(".cne").remove() ;

				$("#cne").append("<md-input-container>"+
                    						"<label>CNE</label>"+
                     						" <input ng-model='vsm.scne'>"+
          								"</md-input-container>");

				setTimeout(function(){
					$compile($("#cne").contents())($scope) ;
					vsm.scne=cne ;
				},100) ;
		}
		vsm.modifyStudentEmail=function(email,id){
				sf=true ;
				$(".email").remove() ;

				$("#email").append("<md-input-container>"+
                    						"<label>Email</label>"+
                     						" <input ng-model='vsm.semail'>"+
          								"</md-input-container>");
				setTimeout(function(){
					$compile($("#email").contents())($scope) ;
					vsm.semail=email ;
				},100) ;
		}
		
		$scope.uAvatar= function(files) {
			var reader = new FileReader();
	        reader.onload = function (e) {
	            $('#avatarImage').attr('src', e.target.result);
	        }
	        reader.readAsDataURL(files[0]);
			udata.append("avatar", files[0]);
			$('#avatarImage').css("border-radius","0%") ;
	   	}

	   	vsm.validate=function(){
	   		$http.post("/ustudent", udata, {
			      headers: {'Content-Type': undefined },
			      transformRequest: angular.identity
			  }).then(function successCallback(response) {
			     	var data=response.data ;
			     	vsm.student=data ;
			     	getStudentAvatar(vsm.student.avatar) ;
			     	setTimeout(function(){
			     		$('#avatarImage').css("border-radius","50%") ;
			     	},1000) ;
			  }, function errorCallback(response) {
			    console.log(response) ;
			  });
	   	}

}