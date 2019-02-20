function attDialogController($scope,$mdDialog,$timeout,$http,$compile){

	var vam=this ;
	
	vam.disableDate=true ;
	vam.disablePeriode=true ;
	vam.adate=new Date() ;

	var classId=null, lessonId=null, studentsData=null ;

	var sort=function sortJSON(data, key, way) {
    return data.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        if (way === 'asc' ) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
        if (way === 'desc') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
    });
	}
	var reloadStudents=function(){
		var periodes=sort(vam.periode,'val','asc') ;
		var pnames=periodes.map(function(x) {
			   return x.name ;
			}) ;

		$scope.students=null ;
        var year=vam.adate.getFullYear() ;
        var month=vam.adate.getMonth()+1 ;
        var day=vam.adate.getDate() ;
        var sDate=year+"-"+month+"-"+day ; 
		adata={'periodes[]':pnames, 'id':classId, 'lesson_id':lessonId} ;
		$http({ method: 'GET', url: '/attendance/'+sDate, params:adata})
					.then(function successCallback(response) {
						var sdata=response.data ;
						if(sdata==null){
							console.log(sdata) ;
							return false ;
						}
						console.log(response) ;
						$scope.students=sdata ;
						$timeout(function() {
								getStudentAvatar() ;
								console.log($scope.students) ;
								return false ;
						}, 100);
					  }, function errorCallback(response) {
		    			console.log(response) ;
		});	
	}
	vam.ndate=function(){	
		if(vam.adate!=null && vam.periode.length>0){
			$("#validate").show() ;
			reloadStudents() ;
			return false ;
		}
		$("#validate").hide() ;
		
	} ;
	vam.nperiode=function(){
		if(vam.adate!=null && vam.periode.length>0){
			$("#validate").show() ;
			reloadStudents() ;
			return false ;
		}
		$("#validate").hide() ;
	}

	$scope.periodes=[
		{name:'First_Periode',val:1},
		{name:'Second_Periode',val:2},
		{name:'Third_Periode',val:3},
		{name:'Last_Periode',val:4}
	];

	var getClasses=function(){
				$http({ method: 'GET', url: '/class'})
					.then(function successCallback(response) {
						var data=response.data ;		
						$scope.classes=data;

					  }, function errorCallback(response) {
				   			console.log(response) ;
					});		
			}
	getClasses() ;

 	var getStudentsByClassId=function(id){	
 		var students=$http({ method: 'GET', url: '/sclass/'+id})
					.then(function successCallback(response) {
					var sdata=response.data ;
					if(sdata.length==0){
							alertify.error('No Students Registred for this Class', 'message', 10) ;
							return false ;
					}
					return sdata ;
		 },function errorCallback(response) {
				   		return false ;
		});	
		return students ;	
 	}
 	vam.getAddtitionalInfosByClass=function(id){	
 		$("#lessons").hide() ;
 		$("#students").hide() ;
 		$("#courses").hide() ;
 		$(".classes").css('background-color','#fff');	
 		$scope.students=null ;
 		classId=id ;
 		studentsData=getStudentsByClassId(classId) ;
 		studentsData.then(function(result) {
 			if(result){
			  getCoursesByClass(id) ;
			  $("#classes_"+id).css('background-color','#9cd0ef');
			 }
			 else{
			 	  $("#classes_"+id).css('background-color','#e82626');
			 	  $("#disableAllP").hide() ;
			 	  vam.periode=null ;
			 	  $("#validate").hide() ;
			 }
					
		});
	
 	}
 	var getCoursesByClass=function(id){
		$http({ method: 'GET', url: '/course_class/'+id})
					.then(function successCallback(response) {
						var data=response.data ;
						$scope.courses=data ;	
						$timeout(function() {
								$("#courses").show() ;
								return false ;
						}, 100);
					  }, function errorCallback(response) {
				   			console.log(response) ;
		});		
 	}

	var getStudentAvatar=function(){		
		$.each($scope.students,function(key, value){		
			$http({ method: 'GET', url: '/student/'+value.avatar,responseType: 'arraybuffer'})
				.then(function successCallback(response) {
					var str = _arrayBufferToBase64(response.data);
					value.avatar='data:image/gif;base64,'+str;
				  }, function errorCallback(response) {
			   			console.log(response) ;
			});
						
		})
	}

	vam.getLessonsByCourses=function(id){
		$scope.students=null ;
		$http({ method: 'GET', url: '/lesson/'+id})
					.then(function successCallback(response) {
						var data=response.data ;		
						$scope.lessons=data;
						$timeout(function(){
							$("#lessons").show() ;
							$(".courses").css('background-color','#fff');
							$("#courses_"+id).css('background-color','#ff9a9a');
							
						},100) ;
					  }, function errorCallback(response) {
				   			console.log(response) ;
		});		
	}
	vam.assignLesson=function(id){
		studentsData.then(function(result) {
			$scope.students=result ;
			$("#students").mCustomScrollbar({theme:"dark"});
					$timeout(function() {
							getStudentAvatar() ;
							$('#students').show() ;
							$(".lessons").css('background-color','#fff');
							$("#lessons_"+id).css('background-color','#dd6cf9');
							vam.disableDate=false ;
							vam.disablePeriode=false ;
							$("#disableAllP").show() ;
							lessonId=id ;
							if(vam.adate!=null && vam.periode.length>0){
								reloadStudents() ;
							}
							
					}, 100);
		}) ;
	
	}
	
	var margDiv=function(id){

		$.each($scope.students,function(key, value){
			
				if(value.id!=id && !value.absence && !value.late){
					$("#check_"+value.id).css('margin-right','52px') ;
				}
		}) ;
		return false ;
	}
	
	var margDivL=function(id){
		var hide=false ;
		$.each($scope.students,function(key, value){
				if(value.absence){
					hide=true ;
				}
		}) ;
		
		$.each($scope.students,function(key, value){
			if(value.id!=id && !value.late && !value.absence){
				$("#check_"+value.id).css('margin-right','52px') ;
			}
			if(value.id==id){
				$("#check_"+value.id).css('margin-right','20px') ;
			}
		}) ;
		

		
		return false ;
	}
	
	vam.checkAbsence=function(){
			$.each($scope.students,function(key, value){
				if(value.absence){	
						value.late=false ;
						value.presence=false ;
						$timeout(function(){
							$(".excused").show() ;
							$("#headP").css('margin-left','150px') ;
							margDiv(value.id) ;
							$("#excused_"+value.id).show() ;
							$("#check_"+value.id).css('margin-right','20px') ;
						},100) ;
				}else{
					value.excused=false ;
					if(!value.late){
						$("#excused_"+value.id).hide() ;
						$("#check_"+value.id).css('margin-right','52px') ;
					}

				}
			});
			var hide=false ;
			$.each($scope.students,function(key, value){
				if(value.absence || value.late){
					hide=true ; return false ;
				}
			}) ;
			if(!hide){
				$.each($scope.students,function(key, value){
						$("#check_"+value.id).css('margin-right','20px') ;
				}) ;
				$(".excused").hide() ;
				$("#headP").css('margin-left','200px') ;
			}
		return false ;
	}
	var margDivNoL=function(){
		var hide=false ;
		$.each($scope.students,function(key, value){
				if(value.absence || value.late){
					hide=true ;
				}
		}) ;

		if(!hide){
			$.each($scope.students,function(key, value){
				if(!value.absence && !value.late) {
					$("#check_"+value.id).css('margin-right','20px') ;
					$("#headP").css('margin-left','200px') ;
					$(".excused").hide() ;
				}
			}) ;
		}
		else{
			$.each($scope.students,function(key, value){
				if(!value.absence && !value.late) {
					$("#check_"+value.id).css('margin-right','52px') ;
				}
			}) ;
		}
		
		return false ;
	}
	vam.checkLate=function(){
			$.each($scope.students,function(key, value){		
				if(value.late){
						value.absence=false ;
						value.presence=false ;
						$timeout(function(){
							$(".excused").show() ;
							$("#headP").css('margin-left','150px') ;
							margDivL(value.id) ;
							$("#excused_"+value.id).show() ;
						},100) ;
					
				}else{
					value.excused=false ;
					if(!value.absence){
						$("#excused_"+value.id).hide() ;
					}
				}
			});
			margDivNoL() ;	
		return false ;	
	}
    var margDivP=function(id){
    	var hide=true ;
		$.each($scope.students,function(key, value){		
				if(value.id!=id && (value.absence || value.late)) {
					hide=false ;
				}
		}) ;

		if(hide){
			$(".excused").hide() ;
			$("#headP").css('margin-left','200px') ;
				$.each($scope.students,function(key, value){		
					$("#check_"+value.id).css('margin-right','20px') ;
						
				}) ;
		}
		if(!hide){
			$.each($scope.students,function(key, value){
				if(!value.absence && !value.late) {
					$("#check_"+value.id).css('margin-right','52px') ;
				}
			}) ;
		}
		
		return false ;
	}
	 var margDivNoP=function(id){
    	var hide=false ;
		$.each($scope.students,function(key, value){		
				if(value.absence || value.late){
					hide=true ;
				}
		}) ;
		if(hide){
			$.each($scope.students,function(key, value){		
				if(!value.absence && !value.late){
					$("#check_"+value.id).css('margin-right','52px') ;
				}
			}) ;
		}	
	}
	vam.checkPresence=function(id){
		$.each($scope.students,function(key, value){		
				if(value.presence){
					
					value.absence=false ;
					value.late=false ;
					value.excused=false ;
					$timeout(function(){
						$("#excused_"+value.id).hide() ;
						margDivP(value.id) ;
					},100) ;
						
				}
				margDivNoP() ;		
		});
		return false ;
	}

	vam.markAllP=function(){
		
		if($scope.presence){
			$.each($scope.students,function(key, value){
				value.presence=true ;
				value.late=false ;
				value.absence=false ;
				value.excused=false ;
				$("#check_"+value.id).css('margin-right','20px') ;
				$("#excused_"+value.id).hide() ;

			});
			$(".excused").hide() ;
			$("#headP").css('margin-left','200px') ;
			return true ;
		}
		$.each($scope.students,function(key, value){	
				value.presence=false ;
		});
		return false ;

	}
	vam.add=function(){
		var attend=false ;
		$.each($scope.students,function(key, value){		
				if(!value.presence && !value.late && !value.absence){
					console.log('fuck me') ;
					attend=true ;
					return false ;
				}
				else{
					if(value.presence){
						value.late=false; value.absence=false ;value.excused=false ;
					
					}
					if(value.absence){
						value.late=false; value.presence=false ;
						if(!value.excused){
							value.excused=false ;
						}					
						
					}
					if(value.late){
						value.absence=false; value.presence=false ;
						if(!value.excused){
							value.excused=false ;
						}	
					}
				}
				
		});
		if(attend){
			note=alertify.error('Please Assign Attendance to All Students', 'message', 10) ;
			return false ;
		}
		else{
			var year=vam.adate.getFullYear() ;
	        var month=vam.adate.getMonth()+1 ;
	        var day=vam.adate.getDate() ;
	        var sDate=year+"-"+month+"-"+day ; 

	        var udata={adate:sDate, students:$scope.students, periodes:vam.periode, lesson_id:lessonId} ;
	    	$http({ method: 'POST', url: '/attendance',data:udata})
					.then(function successCallback(response) {
						console.log(response) ;
						$scope.presence=false ;
						alertify.notify('Attendances Have Been Validated', 'message', 10) ; 
					  }, function errorCallback(response) {
				   			console.log(response) ;
			}); 
		}  
	}
}

function aStatisticsDialogController($element,$scope,$mdDialog,$timeout,$http,$compile){
	var stam=this ;
	stam.absence=1 ;
	stam.stCourses=0 ;

	$scope.sclasses=null ;
	stam.searchTerm='';
	stam.sclass=null ;

	stam.switchCourses=function(){
		adata() ;
	}
	
	stam.clearSearchTerm = function() {
	    stam.searchTerm ='';
	    if(stam.sclass!=null){
	    		adata() ;
	    }
	};
	$element.find('input').on('keydown', function(ev) {
	      ev.stopPropagation();
	 });

	var loadClasses=function(){
		$http({ method: 'GET', url: '/class'})
			.then(function successCallback(response) {
				var data=response.data ;	
				$scope.sclasses =  $scope.sclasses || data ; 
				stam.sclass=$scope.sclasses[0] ;
				$timeout(function() {adata() ;}, 200);
			  }, function errorCallback(response) {
		   			console.log(response) ;
		});		
	}
	loadClasses() ;

	stam.checkAbsence=function(){
		if(stam.absence){
			stam.late=0 ;
		}
		adata() ;
	}
	stam.checkLate=function(){
		if(stam.late){
			stam.absence=0 ;
		}
		adata() ;
	}
	stam.switchExcused=function(){
		adata() ;
	}

	var adata=function(){
		$http({ method: 'GET', url: '/sattendance/'+stam.sclass.id+'/'+stam.stCourses+'/'+stam.absence+'/'+stam.late+'/'+stam.excused})
					.then(function successCallback(response) {	
						 $timeout(function() {
					     	$scope.myDataSource.data=response.data;
					     	if(!stam.stCourses){
  								$scope.myDataSource.chart.xAxisName="Lessons";
					     	}
					     	if(stam.stCourses){
					     		$scope.myDataSource.chart.xAxisName="Courses";
					     	}
					     	if(stam.absence && !stam.excused){
					     		if(!stam.stCourses){
									$scope.myDataSource.chart.subCaption="Absences by their Lessons for Class "+ stam.sclass.name;
					     		}
					     		else{
					     			$scope.myDataSource.chart.subCaption="Absences by their Courses for Class "+ stam.sclass.name;
					     		}
					     		$scope.myDataSource.chart.yAxisName="Absences";
					     	}
					        if(stam.absence && stam.excused){
					        	if(!stam.stCourses){
									$scope.myDataSource.chart.subCaption="Excused Absences by their Lessons for Class "+ stam.sclass.name;					     		}
					     		else{
					     			$scope.myDataSource.chart.subCaption="Excused Absences by their Courses for Class "+ stam.sclass.name;
					     		}
					     		$scope.myDataSource.chart.yAxisName="Excused Absences";
					     		
					     	}
					     	if(stam.late && !stam.excused){
					     		if(!stam.stCourses){
									$scope.myDataSource.chart.subCaption="Late Attendances by their Lessons for Class "+ stam.sclass.name;
					     		}
					     		else{
					     			$scope.myDataSource.chart.subCaption="Late Attendances by their Courses for Class "+ stam.sclass.name;
					     		}
					     		$scope.myDataSource.chart.yAxisName="Excused Late Attendances";
					     			
					     	}
					        if(stam.late && stam.excused){
					        	if(!stam.stCourses){
									$scope.myDataSource.chart.subCaption="Excused Late Attendances by their Lessons for Class "+ stam.sclass.name;
					     		}
					     		else{
					     			$scope.myDataSource.chart.subCaption="Excused Late Attendances by their Courses for Class "+ stam.sclass.name;
					     		}
					     		$scope.myDataSource.chart.yAxisName="Excused Late Attendances";
					     	}
					     	if(response.data.length==0){
					     		alertify.error('No Attendances Available for this Request', 'message', 10) ; 
					     	}
					     }, 100);
					  }, function errorCallback(response) {
				   			console.log(response) ;
		}); 
	}
	
	$scope.myDataSource = {
                chart: {
                    caption: "Total Attendances By Their Classes",
                    subCaption: null,
                    xAxisName: null,
                    xAxisNameFontSize: '12',
                    xAxisNameFontColor: '#0e57db',
       				yAxisName: null,
       				yAxisNameFontSize: '12',
       				yAxisNameFontColor: '#0e57db',
       				theme: "ocean"
                },
                data:null
     };	

}