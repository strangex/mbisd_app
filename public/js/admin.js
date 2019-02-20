(function() {

    'use strict';

    angular
        .module('mbiscApp')
        .controller('AdminController', AdminController);


    function AdminController($auth, $mdToast, $state, $scope, $compile, $mdDialog,$interval, $timeout, $http,FileUploader) {

        var vm = this; 
        vm.numC=300 ;
        
        var API ; var table ;
        ///Taoulou
        /************* final selection & filter****************/
        vm.validD=function(ev,selection){
          ev.preventDefault();
          vm.selection=selection;
          if(table!==undefined){
            table.destroy() ;
          }
          $scope.listTemplate="../template/candidate/dlist.html" ;
          if(selection){
               vm.vfilter={"verified":1, "student":0};
               $('#reinitialize').hide();
              $(".rbtn").hide() ; $("#dbtn").css("margin-left", "0%") ;
          }else{
               vm.vfilter={"verified":0};  $("#dbtn").css("margin-left", "17%") ;
               $('#reinitialize').show();
          }

          $timeout(function() {
            table=$('#candidatesDTable').DataTable({
                scrollY:  '300px',
                scrollCollapse: true,
                paging:true,
            });
              $timeout(function() {
                     table.columns.adjust();
              },1000) ;
              $("#dynamicV").show() ;
              $("#dynamicV").css("margin-left","-5%") ;
            }, 100);
           
            return false ;
         } ;
        var checkedOnes=new Set() ;
        vm.checkedV=function(candidate){
          //&& checkedOnes.has(candidate.cne)
          if(candidate.checked==0){
              checkedOnes.delete(candidate.cne) ;
              if(checkedOnes.size==0){
                 $(".ckbtn").hide() ;
              }
             return false ;
          }
          checkedOnes.add(candidate.cne) ;
          $(".ckbtn").show() ;
        }
        vm.deselect=function(candidates){
            $.each(candidates,function(key, value){    
              if(checkedOnes.has(value.cne)){
                value.checked=0 ;
              }
            }) ;
            checkedOnes=new Set() ;
         }

         vm.reinitialize=function(ev){
            $http({ method: 'GET', url: "/reinitialize"})
                .then(function successCallback(response) {
                  alertify.notify("Réinitialisation effectuée, attendez que la table se réinitialise!", 'message', 10) ;
                  $scope.candidates=null ;
                  table.destroy() ;
                  getCandidates() ;

                  $timeout(function() {
                      table=$('#candidatesDTable').DataTable({
                          scrollY:  '300px',
                          scrollCollapse: true,
                          paging:true,
                      });
                   $timeout(function() {
                      table.columns.adjust();
                    },100) ;
                   }, 2000);
               }, function errorCallback(response) {
                      console.log(response) ;
            });
         }
        vm.dossierV=function(ev){
           var cdata=new FormData() ;
           cdata.append("selection", vm.selection) ;
           var date=new Date() ;
           cdata.append("year", date.getFullYear()-1) ;                    
           cdata.append("cneSet",Array.from(checkedOnes)) ;
                $http.post("/verified", cdata, {
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                })
                .then(function successCallback(response) {               
                  alertify.notify("Opération effectuée, attendez que la table se réinitialise!", 'message', 10) ;
                  table.destroy() ;
                  $scope.candidates=null ;
                  getCandidates() ;
                  $timeout(function() {
                        table=$('#candidatesDTable').DataTable({
                            scrollY:  '300px',
                            scrollCollapse: true,
                            paging:true,
                        });
                     $timeout(function() {
                        table.columns.adjust();
                      },100) ;
                  }, 2000);
                 }, function errorCallback(response) {
                      console.log(response) ;
                });
         }


        /************Filtred*****************/
        vm.exportCSV=function(number,filter){
            var url='' ;
            if(number==0){
               alertify.error('Veuillez saisir le nombre des candidats désirés!') ;
            }
            if(filter){
                   url='/fcandidate/'+number+'/'+vm.cverified+"/"+vm.bacType+"/"+vm.bac2Type+"/"+vm.bac3Type+"/"+vm.bac3Option ;
            }else{
                url='/lfcandidate/'+number+'/'+vm.tdate;
            }

            console.log(url) ;
            $http({ method: 'GET', url: url, responseType: 'arraybuffer'})
                  .then(function successCallback(response) {
                      console.log(response) ;
                     var blob= new Blob([response.data], {type:"application/xlsx;charset=utf-8"});
                      saveAs(blob,"canidatesFiltredList.xlsx");
                    }, function errorCallback(response) {
                        console.log(response) ;
            });
        }

        var options=null ;
        vm.otherList=function(ev){
            vm.cverified=false ;
            vm.bacType=null ;    vm.bac2Type=null ;  vm.bac3Type=null ;   vm.bac3Option=null ;
            $scope.bac_types="" ; $scope.bac2_types="" ; $scope.bac3_types="" ;
            vm.number=300 ;
            ev.preventDefault();
            $scope.listTemplate="../template/candidate/flist.html" ;
              $http({ method: 'GET', url: "/types"})
                .then(function successCallback(response) {
                  console.log(response) ;
                  var data=response.data ;
                  $scope.bac_types=data.bac_type ;
                  $scope.bac2_types=data.bac2_type ;
                  $scope.bac3_types=data.bac3_type ;
                  $scope.bac3_options=data.bac3_option ;
                  options=data.bac3_option ;

                  $timeout(function() {
                    table=$('#candidatesDTable').DataTable({
                        scrollY:  '300px',
                        scrollCollapse: true,
                        paging:true
                    });
                       $('#candidatesDTable tbody').on( 'click', 'tr', function () {
                        if ( $(this).hasClass('selected') ) {
                              $(this).removeClass('selected');
                                $mdToast.cancel() ;
                             
                         } else {
                              table.$('tr.selected').removeClass('selected');
                              $(this).addClass('selected');
                                var toast = $mdToast.simple()
                                .textContent('Visualisez cette candidature?')
                                .action('Oui')
                                .highlightAction(true)
                                .highlightClass('md-accent')
                                .position("top right")
                                .hideDelay(0);

                              $mdToast.show(toast).then(function(response) {
                                if ( response == 'ok' ) {
                                      var data=table.row('.selected').data() ;
                                    
                                      $mdDialog.show({
                                            controller:VisualizationController,
                                            controllerAs:'vc',
                                            templateUrl: '../template/candidate/visualize.html',
                                            parent: angular.element(document.body),
                                            targetEvent: ev,
                                            clickOutsideToClose:true,
                                            fullscreen: $scope.customFullscreen,
                                            locals:{candidate:data[2]},
                                            onComplete:function(){
                                                  $("#my-menu").css("height","0%") ;
                                            },
                                            onRemoving:function(){
                                               $("#my-menu").css("height","100%") ;
                                            }
                                           
                                      });
                                }
                              });
                           
                             
                      }
                    }) ;
                      $timeout(function() {
                             table.columns.adjust();
                      },1000) ;
                      $("#dynamicV").show() ;
                      $("#dynamicV").css({"margin-left":"-5%","height":"100%"}) ;
                    }, 100);
               }, function errorCallback(response) {
                      console.log(response) ;
            });
         } ;
         vm.regulate=function(){
            var sdata= new Set() ;
            $.each($scope.candidates,function(key, value){
               sdata.add(value.score)
            }) ;
            if(sdata.has(null)){
                alertify.error('Veuillez affecter les scores à tous les candidats!') ;
            }else{
                  $scope.candidates=null ;
                  $http({ method: 'GET', url: "/regulate"})
                  .then(function successCallback(response) {
                          console.log(response) ;
                          $scope.candidates=response.data ;
                          table.destroy() ;
                            
                          $timeout(function() {
                             alertify.notify("Les scores vient d'être régulés!", 'message', 10) ;

                              table=$('#candidatesDTable').DataTable({
                                  scrollY:  '300px',
                                  scrollCollapse: true,
                                  paging:true,
                              });
                             $timeout(function() {
                                table.columns.adjust();
                              },100) ;
                          }, 2000);

                  }, function errorCallback(response) {
                            console.log(response) ;
                  });
            }
         }

         vm.fverified=function(){
            if(vm.cverified){
              table
                .column(3)
                .search('1')
                .draw();
                return false ;
            }
             table
                .column(3)
                .search('[01]',true)
                .draw();
         }

         vm.bacSearch=function(){
            if(vm.bacType.length==0){
                table.column(4)
                  .search("",true)
                  .draw() ;
                vm.bacType=null ;
            }else{
                var regex=vm.bacType.toString() ;
                regex=regex.replace(/,/g,"|") ;
                table
                  .column(4)
                  .search(regex, true,false)
                  .draw();
                  
            }
         }
         vm.bac2Search=function(){
            if(vm.bac2Type.length==0){
                table.column(5)
                  .search("",true)
                  .draw() ;
                vm.bac2Type=null ;
                
            }else{
                var regex=vm.bac2Type.toString() ;
                regex=regex.replace(/,/g,"|") ;
                table
                  .column(5)
                  .search(regex, true,false)
                  .draw();
                  
            }
         }
         vm.bac3Search=function(){
            vm.bac3Option=null ;
              table.column(8)
                  .search("",true)
                  .draw() ;

            if(vm.bac3Type.length==0){
                table.column(6)
                  .search("",true)
                  .draw() ;
              
                vm.bac3Type=null ;
                $scope.bac3_options=options ;
                
            }else{
                var regex=vm.bac3Type.toString() ;
                regex=regex.replace(/,/g,"|") ;
                table
                  .column(6)
                  .search(regex, true,false)
                  .draw();

                var custom=options.filter(function(option){
                    return vm.bac3Type.includes(option.type) ;
                })
                $scope.bac3_options=custom ;      
            }
         }

          vm.bac3OptionSearch=function(){
            console.log(vm.bac3Option) ;
            if(vm.bac3Option.length==0){
                table.column(8)
                  .search("",true)
                  .draw() ;
                vm.bac3Option=null ;
            }else{
                var regex=vm.bac3Option.toString() ;
                regex=regex.replace(/,/g,"|") ;
                table
                  .column(8)
                  .search(regex, true,false)
                  .draw(); 
            }
         }


        /*************Base*****************/
        vm.base=function(ev){
            $http({ method: 'GET', url: "/backup"})
              .then(function successCallback(response) {
                console.log(response) ;
              
             }, function errorCallback(response) {
                    console.log(response) ;
          });

        }
        /**********Coversion***************/
        vm.convert=function(ev){
          ev.preventDefault();
          $scope.listTemplate="../template/candidate/convert.html" ;

          $http({ method: 'GET', url: "/types"})
              .then(function successCallback(response) {
                console.log(response) ;
                var data=response.data ;
                $scope.bac_types=data.bac_type ;
                $scope.bac2_types=data.bac2_type ;
                $scope.bac3_types=data.bac3_type ;

                $timeout(function() {
                        $("#dynamicV").show() ;
                        $("#dynamicV").css({"height":"100%","padding-top":"9%", "padding-left": "1%"}) ;
                }, 500);
             }, function errorCallback(response) {
                    console.log(response) ;
          });

        }

        vm.vconvert=function(ev){
           var state ;
           var label;
           var fields; 
           if($(".fields1").hasClass('ng-invalid') && $(".fields2").hasClass('ng-invalid') &&  $(".fields3").hasClass('ng-invalid')){
                            alertify.error('Requête invalide; veuillez revérifier les erreurs de chaque case!!') ;
                            return false ; 
           }
           $("#cvt").hide() ;

           if(!$(".fields1").hasClass('ng-invalid')){
                  state="one" ; 
                  label=vm.bacT ;
                  fields=vm.bacType ;
           }
           
           if(!$(".fields2").hasClass('ng-invalid')){
                  state="two" ;
                   label=vm.bac2T ; 
                     fields=vm.bac2Type ;     
           }

           if(!$(".fields3").hasClass('ng-invalid')){
                  state="three" ;
                   label=vm.bac3T ;   
                     fields=vm.bac3Type ;      
           }
           var cdata= new FormData();

            cdata.append("state", state) ;
            cdata.append("label", label) ;
            cdata.append("fields", fields) ;

             $http.post("/convert", cdata, {
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                })
                .then(function successCallback(response) {
                  console.log(response) ;
                  stats(ev) ;
               }, function errorCallback(response) {
                      console.log(response) ;
            });


        }


        /*************************/




      vm.bysex=function(){
        if(vm.sexV){
          $("#main").hide() ;
          $("#bysex").show() ;
          return false ;
        }
        $("#bysex").hide() ;
        $("#main").show() ;
      }
      var stats=vm.stats=function(ev){
        ev.preventDefault();
          
        $http({ method: 'GET', url: "/statistics"})
              .then(function successCallback(response) {
                var data=response.data ;
                var ndata=data.ndata ;
                var gdata=data.gdata;

                $scope.bacT = {
                          chart: {
                                caption: "Les Candidats par Type de Bac",
                                xAxisNameFontSize: '12',
                                xAxisNameFontColor: '#0e57db',
                                yAxisNameFontSize: '12',
                                yAxisNameFontColor: '#0e57db',
                                theme: "ocean"},
                          data:ndata.bac_type
                }; 

                $scope.bac2T = {
                          chart: {
                                caption: "Les Candidats par Type de Bac+2",
                                xAxisNameFontSize: '12',
                                xAxisNameFontColor: '#0e57db',
                                yAxisNameFontSize: '12',
                                yAxisNameFontColor: '#0e57db',
                                theme: "ocean"},
                          data:ndata.bac2_type
                }; 

                 $scope.bac3T = {
                          chart: {
                                caption: "Les Candidats par Type de Licence",
                                xAxisNameFontSize: '12',
                                xAxisNameFontColor: '#0e57db',
                                yAxisNameFontSize: '12',
                                yAxisNameFontColor: '#0e57db',
                                theme: "ocean"},
                          data:ndata.bac3_type
                }; 

                $scope.series=gdata.series ;

                $scope.bac_labels = gdata.bacG.labels ;
                $scope.bac2_labels = gdata.bac2G.labels ;
                $scope.bac3_labels = gdata.bac3G.labels ;


                $scope.bac_data = [
                  gdata.bacG.m,
                  gdata.bacG.f
                ];
                $scope.bac2_data = [
                  gdata.bac2G.m,
                  gdata.bac2G.f
                ];

                $scope.bac3_data = [
                  gdata.bac3G.m,
                  gdata.bac3G.f
                ];


                 $scope.listTemplate="../template/statistics/visualize.html" ;
                $timeout(function(){              
                        $("#dynamicV").show() ;
                         $("#card").mCustomScrollbar({
                             theme:"dark"
                        });
                 },100) ;

                }, function errorCallback(response) {
                    console.log(response) ;
            });
        
      }
   


        $scope.listTemplate="../template/adminHome.html" ;
     	  $timeout(function(){
	     	   $("#my-menu").mmenu({
			     	navbar:{
			     	add:true,
			     	title:"Admin Dashboard"},
			      	extensions:[ 'widescreen' ],
			         navbars: [
			            {
			               "position": "bottom",
			               "content": [
			                  "<div id='link' ><a href='#' ng-click='admin.logout($event)' style='color: #fff;'><i class='fa fa-power-off' style='padding-right: 3%;' aria-hidden='true'></i>Log Out</a></div>"
			               ]
			            }
			         ]
		       });
 
           $("#dynamicV").show() ;
     		   API = $("#my-menu").data( "mmenu" ) ;
     		   API.open();

     		   $compile($("#link").contents())($scope) ;  
           vm.disabledMenu=false ; 
        },1000) ;

        /******Candidates*****/
        var loadlist=vm.loadList=function(ev){
          ev.preventDefault() ;
          $scope.listTemplate="../template/candidatesList.html" ;
          $timeout(function() {
            table=$('#candidatesTable').DataTable({
                scrollY:  '300px',
                scrollCollapse: true,
                paging:true,
            });

            $('#candidatesTable tbody').on( 'click', 'tr', function () {
                if ( $(this).hasClass('selected') ) {
                      $(this).removeClass('selected');
                        $mdToast.cancel() ;
                     
                } else {
                      table.$('tr.selected').removeClass('selected');
                      $(this).addClass('selected');
                        var toast = $mdToast.simple()
                        .textContent('Visualisez cette candidature?')
                        .action('Oui')
                        .highlightAction(true)
                        .highlightClass('md-accent')
                        .position("top right")
                        .hideDelay(0);

                      $mdToast.show(toast).then(function(response) {
                        if ( response == 'ok' ) {
                              var data=table.row('.selected').data() ;
                            
                              $mdDialog.show({
                                    controller:VisualizationController,
                                    controllerAs:'vc',
                                    templateUrl: '../template/candidate/visualize.html',
                                    parent: angular.element(document.body),
                                    targetEvent: ev,
                                    clickOutsideToClose:true,
                                    fullscreen: $scope.customFullscreen,
                                    locals:{candidate:data[2]},
                                    onComplete:function(){
                                          $("#my-menu").css("height","0%") ;
                                    },
                                    onRemoving:function(){
                                       $("#my-menu").css("height","100%") ;
                                    }
                                   
                              });
                        }
                      });
                   
                     
                  }
             }) ;
            $timeout(function() {
                   table.columns.adjust();
            },1000) ;
            $("#dynamicV").show() ;
             vm.cscore=true ;
          }, 100);
          
          return false ;
       } ;

       /******************FullList**************************/

       var loadFullList=vm.loadFullList=function(ev){
          ev.preventDefault() ;
          $scope.listTemplate="../template/candidatesFullList.html" ;
          $timeout(function() {
            table=$('#candidatesFullTable').DataTable({
                scrollY:  '300px',
                scrollX: true,
                scrollCollapse: true,
                paging:true,
            });

            $('#candidatesFullTable tbody').on( 'click', 'tr', function () {
                if ( $(this).hasClass('selected') ) {
                      $(this).removeClass('selected');
                        $mdToast.cancel() ;
                     
              } else {
                      table.$('tr.selected').removeClass('selected');
                      $(this).addClass('selected');
                        var toast = $mdToast.simple()
                        .textContent('Visualisez cette candidature?')
                        .action('Oui')
                        .highlightAction(true)
                        .highlightClass('md-accent')
                        .position("top right")
                        .hideDelay(0);

                      $mdToast.show(toast).then(function(response) {
                        if ( response == 'ok' ) {
                              var data=table.row('.selected').data() ;
                            
                              $mdDialog.show({
                                    controller:VisualizationController,
                                    controllerAs:'vc',
                                    templateUrl: '../template/candidate/visualize.html',
                                    parent: angular.element(document.body),
                                    targetEvent: ev,
                                    clickOutsideToClose:true,
                                    fullscreen: $scope.customFullscreen,
                                    locals:{candidate:data[2]},
                                    onComplete:function(){
                                          $("#my-menu").css("height","0%") ;
                                    },
                                    onRemoving:function(){
                                       $("#my-menu").css("height","100%") ;
                                    }
                                   
                              });
                        }
                      });
                   
                     
              }
            }) ;

              $timeout(function() {
                     table.columns.adjust();
                     vm.numCF=1500 ;
                     vm.cscore=true ;
              },1000) ;
              $("#dynamicV").show() ;
              $("#dynamicV").css("margin-left","-10%") ;
          }, 100);
          
          return false ;
       } ;


        vm.scores=function(ev){
            $http({ method: 'GET', url: '/score/'})
                  .then(function successCallback(response) {
                      console.log(response) ; 
                      alertify.notify("Les scores vient d'être affectés.") ;
                      table.destroy() ;
                      $scope.candidates=null ;
                      getCandidates() ;
                      
                      $timeout(function() {
                        table=$('#candidatesFullTable').DataTable({
                            scrollY:  '300px',
                            scrollX: true,
                            scrollCollapse: true,
                            paging:true,
                        });
                         $timeout(function() {
                            table.columns.adjust();
                          },100) ;
                      }, 1000);                 
                    }, function errorCallback(response) {
                        console.log(response) ;
            });
       }




      /*vm.checkScoresColumn=function(number){
           var column = table.column(number);
           column.visible( ! column.visible() );
      }*/


    
       vm.zip=function(ev){
            $http({ method: 'GET', url: '/zip/'+vm.numC,responseType: 'arraybuffer'})
                  .then(function successCallback(response) {
                      console.log(response) ;   
                      var blob = new Blob([response.data], {type:"application/zip"});
                      saveAs(blob,"candidates_files.zip");
   
                    }, function errorCallback(response) {
                        console.log(response) ;
            });
       }
       

     
      var getCandidates=function(){
        $http({ method: 'GET', url: '/candidate'})
          .then(function successCallback(response) {
            var data=response.data ;    
            $scope.candidates=data;
            vm.cNumber=data.length ;
            console.log(data) ;
            }, function errorCallback(response) {
                console.log(response) ;
          });   
      }
      getCandidates() ;

    /********************************/

        var userFlag =localStorage.getItem('userFlag');

        vm.logout = function(e) {
        	e.preventDefault() ;
     		$auth.logout().then(function() {  
		        localStorage.removeItem('userFlag');
		        localStorage.removeItem('userId');
		        $state.go('home') ;
		        API.close(); 
		        $("#my-menu").remove() ;
		        alertify.notify("Vous venez de vous déconnecter avec succès.", 'message', 10) ;
		        return false ;
	    	  });
  	 	};
  	 	var home=vm.home=function(ev){
          ev.preventDefault() ;
          $scope.listTemplate="../template/adminHome.html" ;
          $timeout(function() {
            $("#dynamicV").show() ;
          }, 100);
          
          return false ;
      }
      /***Module***/
          var profs=null ;
          vm.loadProfessors = function(){
            return $timeout(function() {
                  $scope.profs =  $scope.profs  || profs
            }, 650);
          } ;

          $scope.semesters=[
                  { name: 'Semestre 1' },
                  { name: 'Semestre 2' },
                  { name: 'Semestre 3' }
          ] ;

           var submodules=$scope.submodules=[
                  { name: '1er Matière' },
                  { name: '2e Matière' }
          ] ;

          /***Add***/
          function professors(){
                    $http({ method: 'GET', url: '/professor'})
                        .then(function successCallback(response) {
                                console.log(response) ;
                                profs=response.data ;
                        }, function errorCallback(response) {
                          console.log(response) ;
                        }) ;
         }
          var aModule=vm.aModule=function(ev){
                ev.preventDefault() ;
                $http({ method: 'GET', url: '/professor'})
                        .then(function successCallback(response) {
                                console.log(response) ;
                                profs=response.data ;
                                if(profs.length==0){
                                     alertify.error("Aucun professeur n'est encore enregistré!") ;

                                }else{
                                       $scope.listTemplate="../template/module/add.html" ;
                                        $timeout(function() {
                                            $("#dynamicV").show() ;
                                        }, 1000);
                                }
                       }, function errorCallback(response) {
                          console.log(response) ;
                    }) ;
          }
            vm.addMo=function(ev, flag){
                  if($(".fields").hasClass('ng-invalid')){
                          alertify.error('Requête invalide; veuillez revérifier les erreurs de chaque case!!') ;
                          return false ; 
                  }
                  var mdata=new FormData() ;
                  mdata.append('name',vm.name) ;
                  mdata.append('semester',vm.semester) ;

                  mdata.append('code',vm.code) ;
                  mdata.append('volume',vm.volume) ;
                  mdata.append('prof_id',vm.professor) ;
                  mdata.append('description',vm.desc) ;

                  var url='' ;
                  if(flag=='modify'){
                       url='mmodule' ;
                        mdata.append('id',moduleId) ;
                  }else{
                     url='module' ;
                  }

                     $http({ method: 'POST', url: url, data:mdata, headers: {'Content-Type': undefined },
                        transformRequest: angular.identity})
                          .then(function successCallback(response) {
                              console.log(response) ;
                              alertify.notify("Le module vient d'être ajouté avec succès.", 'message', 10) ;
                              lModule(ev) ;
                              vm.name='' ; vm.semester="" ; vm.code="" ; vm.volume="" ; vm.professor="" ; vm.desc="" ;
                            }, function errorCallback(response) {
                                console.log(response.data) ;
                                var errs=response.data.errors ;
                                if(errs.name){
                                    vm.module['name'].$setValidity('server', false);
                                    vm.nameerr=errs.name[0]; 
                                    $timeout(function() {
                                          vm.module['name'].$setValidity('server', true);
                                    }, 4000);
                                } 
                                else if(errs.code){
                                    alertify.error(errs.code[0],10);
                                    vm.module['code'].$setValidity('server', false);
                                    vm.codeerr=errs.code[0]; 
                                    $timeout(function() {
                                          vm.module['code'].$setValidity('server', true);
                                    }, 4000);
                                } 
                                else if(errs.semester){
                                   alertify.error(errs.semester[0],10);
                                } 
                                else if(errs.volume){
                                    vm.module['volume'].$setValidity('server', false);
                                    vm.volumeerr=errs.volume[0]; 
                                    $timeout(function() {
                                          vm.module['volume'].$setValidity('server', true);
                                    }, 4000);
                                }  
                                else if(errs.description){
                                    vm.module['description'].$setValidity('server', false);
                                    vm.descriptionerr=errs.description[0]; 
                                    $timeout(function() {
                                          vm.module['description'].$setValidity('server', true);
                                    }, 4000);
                                } 
                                else if(errs.prof_id){
                                    alertify.error(errs.prof_id[0],10);
                                } 
               
                      });  
          }
            /***List***/
                var lModule=vm.lModule=function(ev){
                    event=ev ;
                    ev.preventDefault() ;
                    $http({ method: 'GET', url: '/module'})
                            .then(function successCallback(response) {
                                console.log(response) ;
                                var modules=response.data ;
                                if(modules.length==0){
                                  alertify.error("Aucun modules n'est encore ajouté!!", 10) ;
                                  return false ;
                                }
                                $scope.listTemplate="../template/module/list.html" ;
                                $scope.modules=modules ;
                                $timeout(function() {
                                    table=$('#modulesTable').DataTable({
                                        paging:true,
                                    });

                                    $('#modulesTable tbody').on( 'click', 'tr', function () {
                                            if ( $(this).hasClass('selected') ) {
                                                $(this).removeClass('selected');
                                                $(".btns").hide() ;
                                                $('#tcontainer').css("margin-left","14%") ;
                                            }
                                            else {
                                               table.$('tr.selected').removeClass('selected');
                                                $(this).addClass('selected');
                                                $(".btns").show() ;
                                                $('#tcontainer').css("margin-left","0") ;
                                            }
                                      }) ;

                                     $("#dynamicV").show() ;
                                     $("#dynamicV").css('margin-left',"-5%") ;
                                }, 300);

                              }, function errorCallback(response) {
                                  console.log(response) ;
                              }) ;

                }
                  /***Delete***/
                  var moduleId;
                  function deleteMo(id){
                        $http({ method: 'DELETE', url: '/module/'+id})
                                .then(function successCallback(response) {
                                    console.log(response) ;
                                    $(".btns").hide() ;
                                    $('#tcontainer').css("margin-left","14%") ;
                                    table.destroy() ;
                                    alertify.notify("Données supprimées.", 'message', 10) ;
                                    lModule(event) ;
                                }, function errorCallback(response) {
                                      console.log(response) ;
                                }) ;
                  }
                  vm.deleteMo=function(){
                    var data=table.row('.selected').data() ;
                    var matieres=JSON.parse(data[8]) ;
                    moduleId=data[0] ;
                    if(matieres.length>0){
                        $mdToast.show(
                            $mdToast.confirmMo()
                          );
                          $timeout(function() {
                              $compile($("#confirmMoT").contents())($scope) ;  
                          }, 1000);
                      return false ;
                    }else{
                          deleteMo(moduleId) ;
                    }

                   
                }
                 vm.deleteCMo=function(flag){
                    $mdToast.cancel() ;
                    if(flag){
                        deleteMo(moduleId) ;
                    }
                    return false ;
                }



                /***Modify***/
                 vm.modifyMo=function(ev){
                      var ndata=table.row('.selected').data() ;
                      moduleId=ndata[0] ;
                      $scope.listTemplate="../template/module/add.html" ;
                      $timeout(function() {
                              $("#dynamicV").show() ;
                      }, 1000);                   
                      var prof=JSON.parse(ndata[7]) ;
                       $timeout(function() {
                            event=ev ;
                            $(".nBtn").hide(); 
                            $(".mBtn").show() ;

                            vm.name=ndata[1] ;
                            vm.code=ndata[2] ;
                            vm.desc=ndata[3] ;
                            vm.volume=parseInt(ndata[4]) ;
                            
                            vm.semester=ndata[5] ; 
                          //  vm.professor=prof.first_name ;
                           
                      }, 2000) ;
              }

              vm.cancelMo=function(ev){
                lModule(ev) ;
              }

              vm.showMo=function(){
               /*    $mdDialog.show({
                      controller :AuthController,
                      controllerAs:'auth',
                      templateUrl: '../template/matiere/signin.html',
                      parent: angular.element(document.body),
                      targetEvent: ev,
                      clickOutsideToClose:true,
                      fullscreen: $scope.customFullscreen
                });*/
              }

       /***Matières***/
          /***Add***/
          var modules ;
          var aMatiere=vm.aMatiere=function(ev){
                ev.preventDefault() ;
                $http({ method: 'GET', url: '/module'})
                        .then(function successCallback(response) {
                            console.log(response) ;
                            modules=response.data ;
                            if(modules.length==0){
                               alertify.error("Aucun module n'est encore enregistré!") ;

                            }else{
                              
                                              $scope.listTemplate="../template/matiere/add.html" ;
                                              $timeout(function() {
                                                  $("#dynamicV").show() ;
                                              }, 1000);
                               
                            }
                        }, function errorCallback(response) {
                          console.log(response) ;
                }) ;
          }
          vm.loadModules = function(){
            return $timeout(function() {
                  $scope.modules =  $scope.modules  || modules
            }, 650);
          } ;


            vm.addMa=function(ev,flag){
                  if($(".fields").hasClass('ng-invalid')){
                          alertify.error('Requête invalide; veuillez revérifier les erreurs de chaque case!!') ;
                          return false ; 
                  }
                  var mdata=new FormData() ;
                  mdata.append('name',vm.name) ;
                  mdata.append('semester',vm.semester) ;

                  mdata.append('code',vm.code) ;
                  mdata.append('volume',vm.volume) ;
                  mdata.append('description',vm.desc) ;
                  mdata.append('module_id',vm.module) ;

                  var url='' ;
                  if(flag=='modify'){
                        url='mmatiere' ;
                        mdata.append('id',matiereId) ;
                  }else{
                     url='matiere' ;
                  }
                     $http({ method: 'POST', url: url, data:mdata, headers: {'Content-Type': undefined },
                        transformRequest: angular.identity})
                          .then(function successCallback(response) {
                              console.log(response) ;
                              alertify.notify("La matiére vient d'être ajouté avec succès.", 'message', 10) ;
                              lMatiere(ev) ;
                              vm.name='' ; vm.semester="" ; vm.code="" ; vm.volume="" ; vm.professor="" ; vm.desc="" ;
                            }, function errorCallback(response) {
                                console.log(response.data) ;
                                var errs=response.data.errors ;
                                if(errs.name){
                                    vm.module['name'].$setValidity('server', false);
                                    vm.nameerr=errs.name[0]; 
                                    $timeout(function() {
                                          vm.module['name'].$setValidity('server', true);
                                    }, 4000);
                                } 
                                else if(errs.code){
                                    alertify.error(errs.code[0],10);
                                    vm.module['code'].$setValidity('server', false);
                                    vm.codeerr=errs.code[0]; 
                                    $timeout(function() {
                                          vm.module['code'].$setValidity('server', true);
                                    }, 4000);
                                } 
                                else if(errs.semester){
                                   alertify.error(errs.semester[0],10);
                                } 
                                else if(errs.volume){
                                    vm.module['volume'].$setValidity('server', false);
                                    vm.volumeerr=errs.volume[0]; 
                                    $timeout(function() {
                                          vm.module['volume'].$setValidity('server', true);
                                    }, 4000);
                                }  
                                else if(errs.description){
                                    vm.module['description'].$setValidity('server', false);
                                    vm.descriptionerr=errs.description[0]; 
                                    $timeout(function() {
                                          vm.module['description'].$setValidity('server', true);
                                    }, 4000);
                                } 
                                 else if(errs.module_id){
                                    alertify.error(errs.module_id[0],10);
                                } 
                      });  
          }        

             /***List***/
                var lMatiere=vm.lMatiere=function(ev){
                    event=ev ;
                    ev.preventDefault() ;
                    $http({ method: 'GET', url: '/matiere'})
                            .then(function successCallback(response) {
                                console.log(response) ;
                                var modules=response.data ;
                                if(modules.length==0){
                                  alertify.error("Aucune matière n'est encore ajouté!!", 10) ;
                                  return false ;
                                }
                                $scope.listTemplate="../template/matiere/list.html" ;
                                $scope.modules=modules ;
                                $timeout(function() {
                                    table=$('#matieresTable').DataTable({
                                        paging:true,
                                    });
                                    $('#matieresTable tbody').on( 'click', 'tr', function () {
                                            if ( $(this).hasClass('selected') ) {
                                                $(this).removeClass('selected');
                                                $(".btns").hide() ;
                                                $('#tcontainer').css("margin-left","14%") ;
                                            }
                                            else {
                                               table.$('tr.selected').removeClass('selected');
                                                $(this).addClass('selected');
                                                $(".btns").show() ;
                                                $('#tcontainer').css("margin-left","0") ;
                                            }
                                      }) ;

                                     $("#dynamicV").show() ;
                                     $("#dynamicV").css('margin-left',"-5%") ;
                                }, 300);

                              }, function errorCallback(response) {
                                  console.log(response) ;
                              }) ;

                }
                  /***Delete***/
                  var matiereId;
                  vm.deleteMa=function(){
                    var data=table.row('.selected').data() ;
                    matiereId=data[0] ;
                    $http({ method: 'DELETE', url: '/matiere/'+matiereId})
                                .then(function successCallback(response) {
                                    console.log(response) ;
                                    $(".btns").hide() ;
                                    $('#tcontainer').css("margin-left","14%") ;
                                    table.destroy() ;
                                    alertify.notify("Données supprimées.", 'message', 10) ;
                                    lMatiere(event) ;
                                }, function errorCallback(response) {
                                      console.log(response) ;
                                }) ;
                }

                /***Modify***/
                 vm.modifyMa=function(ev){
                      var ndata=table.row('.selected').data() ;
                      moduleId=ndata[0] ;
                      $scope.listTemplate="../template/matiere/add.html" ;
                      $timeout(function() {
                            $("#dynamicV").show() ;
                      }, 1000);                    
                   
                       $timeout(function() {
                            event=ev ;
                            $(".nBtn").hide(); 
                            $(".mBtn").show() ;

                            vm.name=ndata[1] ;
                            vm.code=ndata[2] ;
                            vm.desc=ndata[3] ;
                            vm.volume=parseInt(ndata[4]) ;
                            
                            vm.semester=ndata[5] ;                            
                      }, 2000) ;
              }

              vm.cancelMa=function(ev){
                lMatiere(ev) ;
              }
      
       /***Partenaire***/
              /***Add***/
              var aPartenaire=vm.aPartenaire=function(ev){
                vm.name=""; vm.email="";  vm.link=""; vm.city=null ;  vm.country=null;
                ev.preventDefault() ;
                $scope.listTemplate="../template/partenaire/add.html" ;
                $timeout(function() {
                    $("#dynamicV").show() ;
                    $('#pImage').attr('src','images/partenaire.png');
                }, 1000);
              }
              
              vm.addPa=function(flag){
                  if($(".fields").hasClass('ng-invalid')){
                          alertify.error('Requête invalide; veuillez revérifier les erreurs de chaque case!!') ;
                          return false ;  
                  }
                  if(flag!='modify' && !pavatar){
                    alertify.error("N'oubliez pas la photo de profile du professeur!") ;
                    return false ;
                  }

                  var pdata=new FormData() ;
                  pdata.append('name',vm.name) ;
                  pdata.append('link',vm.link) ;
                  pdata.append('country',vm.country) ;
                  pdata.append('city',vm.city) ;
                  
                  pdata.append("avatar",pFile) ;
                  var url='' ;
                  if(flag=='modify'){
                       url='/mpartenaire' ;
                       pdata.append("id",partenaireId) ;
                       if(pFile==null){
                            pdata.append("noTag",true) ;
                       }else{
                            pdata.append("noTag",false) ;
                       }
                  }else{
                     url='/partenaire' ;
                  }

                     $http({ method: 'POST', url: url,data:pdata, headers: {'Content-Type': undefined },
                        transformRequest: angular.identity})
                          .then(function successCallback(response) {
                              console.log(response) ;
                              alertify.notify("Le partenaire vient d'être ajouté avec succès.", 'message', 10) ;
                              pavatar=false ;
                              pFile=null ;

                                 lPartenaire(event) ;

                            }, function errorCallback(response) {
                                console.log(response) ;
                                var errs=response.data.errors ;
                                if(errs.avatar){
                                      alertify.error(errs.avatar,10); 
                                } 
                                else if(errs.name){  
                                    $scope.professor['name'].$setValidity('server', false);
                                    vm.nameerr=errs.name[0]; 
                                    $timeout(function() {
                                          $scope.partenaire['name'].$setValidity('server', true);
                                    }, 4000);
                                } 
                                
                      });  
              }

               var lPartenaire=vm.lPartenaire=function(ev){
                    event=ev ;
                    ev.preventDefault() ;
                    $http({ method: 'GET', url: '/partenaire'})
                            .then(function successCallback(response) {
                                console.log(response) ;
                                var partenaires=response.data ;
                                if(partenaires.length==0){
                                  alertify.error("Aucun professeur n'est encore ajouté!!", 10) ;
                                  home(ev) ;
                                  return false ;
                                }
                                $scope.listTemplate="../template/partenaire/list.html" ;
                                $scope.partenaires=partenaires ;
                                $timeout(function() {
                                    table=$('#partenairesTable').DataTable({
                                        paging:true,
                                    });

                                    $('#partenairesTable tbody').on( 'click', 'tr', function () {
                                            if ( $(this).hasClass('selected') ) {
                                                $(this).removeClass('selected');
                                                $(".btns").hide() ;
                                                $('#tcontainer').css("margin-left","14%") ;
                                            }
                                            else {
                                               table.$('tr.selected').removeClass('selected');
                                                $(this).addClass('selected');
                                                $(".btns").show() ;
                                                $('#tcontainer').css("margin-left","0") ;
                                            }
                                      }) ;

                                    $("#dynamicV").show() ;
                                     $("#dynamicV").css('margin-left',"10%") ;
                                }, 300);

                              }, function errorCallback(response) {
                                  console.log(response) ;
                              }) ;

                }
                /***Delete***/
                  vm.deletePa=function(){
                    var data=table.row('.selected').data() ;
                    var id=data[0] ;
                     $http({ method: 'DELETE', url: '/partenaire/'+id})
                            .then(function successCallback(response) {
                                console.log(response) ;
                                $(".btns").hide() ;
                                $('#tcontainer').css("margin-left","14%") ;
                                table.destroy() ;
                                alertify.notify("Données supprimées.", 'message', 10) ;
                                lPartenaire(event) ;
                            }, function errorCallback(response) {
                                  console.log(response) ;
                            }) ;

                }

                /***Modify***/
                 var partenaireId ;
                 vm.modifyPa=function(ev){
                      var ndata=table.row('.selected').data() ;
                      partenaireId=ndata[0] ;
                      aPartenaire(ev) ;

                       $timeout(function() {
                            event=ev ;
                            $(".aBtn").hide(); 
                            $(".mBtn").show() ;
                            
                            vm.name=ndata[1] ;
                            vm.link=ndata[2] ;
                            vm.country=ndata[3] ;
                            vm.city=ndata[4] ;

                             $("#area").css('height','150px') ;
                             $('#pImage').attr('src','partenaire/'+ndata[5]);
                      }, 2000) ;
              }
  



      /***Professor***/
              /***Add***/
              var pavatar=false ;
              var pFile=null ;
              $scope.pminDate=new Date(new Date().setFullYear(new Date().getFullYear()-60)) ;
              var aProfessor=vm.aProfessor=function(ev){
                ev.preventDefault() ;
                $scope.listTemplate="../template/professor/add.html" ;
                $timeout(function() {
                    $("#dynamicV").show() ;
                    $('#pImage').attr('src','icons/teacher');
                }, 1000);
              }
          
               vm.loadGrades = function(){
                  return $timeout(function() {
                        $scope.grades =  $scope.grades  ||  [
                            { name: 'Pr. Assistant' },
                            { name: 'Pr. Habilité' },
                            { name: "Pr. d'Enseignement Sup" }
                        ] ;
                  }, 650);
                } ;

              vm.addP=function(flag){
                  if($(".fields").hasClass('ng-invalid')){
                          alertify.error('Requête invalide; veuillez revérifier les erreurs de chaque case!!') ;
                          return false ;  
                  }
                  if(flag!='modify' && !pavatar){
                    alertify.error("N'oubliez pas la photo de profile du professeur!") ;
                    return false ;
                  }
                  if(vm.pdate==null){   
                         alertify.error("N'oubliez pas la date de naissance du professeur!") ;
                         return false ;
                  }

                  var pdata=new FormData() ;
                  pdata.append('first_name',vm.fname) ;
                  pdata.append('last_name',vm.lname) ;
                  pdata.append('establishment',vm.estab) ;
                  pdata.append('speciality',vm.speciality) ;
                  pdata.append('email',vm.email) ;
                  
                  pdata.append('facebook',vm.facebook) ;
                  pdata.append('linkedin',vm.linkedin) ;
                  pdata.append('twitter',vm.twitter) ;

                  pdata.append('grade',vm.grade) ;

                  var year =vm.pdate.getFullYear() ;
                  var month=vm.pdate.getMonth()+1 ;
                  var day=vm.pdate.getDate() ;
                  var pdate=year+"-"+month+"-"+day ;
                  pdata.append("birth_date",pdate) ;
                  pdata.append("avatar",pFile) ;
                  var url='' ;
                  if(flag=='modify'){
                       url='mprofessor' ;
                       pdata.append("id",professorId) ;
                       if(pFile==null){
                            pdata.append("noTag",true) ;
                        }else{
                            pdata.append("noTag",false) ;
                        }
                  }else{
                     url='/professor' ;
                  }

                     $http({ method: 'POST', url: url,data:pdata, headers: {'Content-Type': undefined },
                        transformRequest: angular.identity})
                          .then(function successCallback(response) {
                              console.log(response) ;
                              alertify.notify("Le professeur vient d'être ajouté avec succès.", 'message', 10) ;
                              pavatar=false ;
                              pFile=null ;
                              if(flag=='modify'){
                                  lProfessor(event) ;
                              }else{
                                 aProfessor(event) ;
                              }

                            }, function errorCallback(response) {
                                console.log(response) ;
                                var errs=response.data.errors ;
                                if(errs.avatar){
                                      alertify.error(errs.avatar,10); 
                                } 
                                else if(errs.birth_date){
                                    alertify.error(errs.birth_date[0],10);
                                } 
                                else if(errs.first_name){
                                    
                                    $scope.professor['first_name'].$setValidity('server', false);
                                    vm.fnameerr=errs.first_name[0]; 
                                    $timeout(function() {
                                          $scope.professor['first_name'].$setValidity('server', true);
                                    }, 4000);
                                } 
                                else if(errs.last_name){
                                    
                                    $scope.professor['last_name'].$setValidity('server', false);
                                    vm.lnameerr=errs.last_name[0]; 
                                    $timeout(function() {
                                          $scope.professor['last_name'].$setValidity('server', true);
                                    }, 4000);
                                } 
                                 else if(errs.email){
                                   
                                    $scope.professor['email'].$setValidity('server', false);
                                    vm.emailerr=errs.email[0]; 
                                    $timeout(function() {
                                          $scope.professor['email'].$setValidity('server', true);
                                    }, 4000);
                                } 
                                else if(errs.establishment){
                                    $scope.professor['establishment'].$setValidity('server', false);
                                    vm.estaberr=errs.establishment[0]; 
                                    $timeout(function() {
                                          $scope.professor['establishment'].$setValidity('server', true);
                                    }, 4000);
                                } 
                                 else if(errs.speciality){
                                    $scope.professor['speciality'].$setValidity('server', false);
                                    vm.specialityerr=errs.speciality[0]; 
                                    $timeout(function() {
                                          $scope.professor['speciality'].$setValidity('server', true);
                                    }, 4000);
                                } 
                                else if(errs.grade){
                                    alertify.error(errs.grade[0],10);
                                } 
                     
                      });  
              
              }
              vm.avatar=function(){
                    $("#avatar").click() ;
              }
              $scope.pImage= function(files) {
                
                  var validExts = new Array(".png", ".jpeg", ".jpg");
                  var fname = files[0].name.substring(files[0].name.lastIndexOf('.'));
                  if (validExts.indexOf(fname) < 0) {
                    alertify.error("Fichier invalid, les formats acceptés sont: "+
                             validExts.toString()) ;
                    pavatar=false ;
                    pFile=null ;
                    return false;
                  }
                  var reader = new FileReader();
                  reader.onload = function (e) {
                          $('#pImage').attr('src', e.target.result);
                  }
                  reader.readAsDataURL(files[0]);
                  pFile=files[0];
                  pavatar=true ;
              }


              /***List***/
                $scope.minDate=new Date() ;
                var lProfessor=vm.lProfessor=function(ev){
                    event=ev ;
                    ev.preventDefault() ;
                    $http({ method: 'GET', url: '/professor'})
                            .then(function successCallback(response) {
                                console.log(response) ;
                                var professors=response.data ;
                                if(professors.length==0){
                                  alertify.error("Aucun professeur n'est encore ajouté!!", 10) ;
                                  return false ;
                                }
                                $scope.listTemplate="../template/professor/list.html" ;
                                $scope.professors=professors ;
                                $timeout(function() {
                                    table=$('#professorsTable').DataTable({
                                        paging:true,
                                    });

                                    $('#professorsTable tbody').on( 'click', 'tr', function () {
                                            if ( $(this).hasClass('selected') ) {
                                                $(this).removeClass('selected');
                                                $(".btns").hide() ;
                                                $('#tcontainer').css("margin-left","14%") ;
                                            }
                                            else {
                                               table.$('tr.selected').removeClass('selected');
                                                $(this).addClass('selected');
                                                $(".btns").show() ;
                                                $('#tcontainer').css("margin-left","0") ;
                                            }
                                      }) ;

                                    $("#dynamicV").show() ;
                                     $("#dynamicV").css('margin-left',"-10%") ;
                                }, 300);

                              }, function errorCallback(response) {
                                  console.log(response) ;
                              }) ;

                }
                  /***Delete***/
                  vm.deleteP=function(){
                    var data=table.row('.selected').data() ;
                    var id=data[0] ;
                     $http({ method: 'DELETE', url: '/professor/'+id})
                            .then(function successCallback(response) {
                                console.log(response) ;
                                $(".btns").hide() ;
                                $('#tcontainer').css("margin-left","14%") ;
                                table.destroy() ;
                                alertify.notify("Données supprimées.", 'message', 10) ;
                                lProfessor(event) ;
                            }, function errorCallback(response) {
                                  console.log(response) ;
                            }) ;

                }
                /***Modify***/
                 var professorId ;
                 vm.modifyP=function(ev){
                      var ndata=table.row('.selected').data() ;
                      professorId=ndata[0] ;
                      aProfessor(ev) ;

                       $timeout(function() {
                            event=ev ;
                            $(".nBtn").hide(); 
                            $(".mBtn").show() ;
                            
                            vm.lname=ndata[1] ;
                            vm.fname=ndata[2] ;
                            vm.email=ndata[3]
                            vm.pdate=new Date(ndata[4]) ;
                            vm.speciality=ndata[5] ;
                            vm.estab=ndata[6] ;
                            
                            vm.grade=ndata[7] ;

                            vm.linkedin=ndata[9] ;
                            vm.facebook=ndata[10] ;
                            vm.twitter=ndata[11] ;

                          
                             $("#area").css('height','150px') ;
                             $('#pImage').attr('src','professor/'+ndata[8]);
                      }, 2000) ;
              }
  



      /***News***/
      
      $scope.minDate=new Date() ;
      var lNews=vm.lNews=function(ev){
          event=ev ;
          ev.preventDefault() ;
          $http({ method: 'GET', url: '/news'})
                  .then(function successCallback(response) {
                      console.log(response) ;
                      var news=response.data ;
                      if(news.length==0){
                        alertify.error("No news yet available!!", 10) ;
                        return false ;
                      }
                      $scope.listTemplate="../template/listNews.html" ;
                      $scope.news=news ;
                      $timeout(function() {
                        table=$('#newsTable').DataTable({
                            paging:true,
                        });
                        $('#newsTable tbody').on( 'click', 'tr', function () {
                                if ( $(this).hasClass('selected') ) {
                                    $(this).removeClass('selected');
                                    $(".btns").hide() ;
                                    $("#mnews").css('margin-left','10%') ;
                                }
                                else {
                                   table.$('tr.selected').removeClass('selected');
                                    $(this).addClass('selected');
                                    $(".btns").show() ;
                                    $("#mnews").css('margin-left','3%') ;
                                }
                          }) ;

                        $("#dynamicV").show() ;
                      }, 100);

                    }, function errorCallback(response) {
                        console.log(response) ;
                    }) ;

      }
      var newsId ;
      var event ;
      vm.modifyN=function(ev){
        var ndata=table.row('.selected').data() ;
        mflag='modify' ;
        newsId=ndata[0] ;
        aNews(ev) ;
         $timeout(function() {
              event=ev ;
              $("tagI").empty() ;
              $(".nBtn").hide(); 
              $(".mBtn").show() ;
              $("#bi").show() ;
               vm.spanI='Attach Another File' ;
               vm.title=ndata[1] ;
               vm.sub=ndata[2] ;
               vm.desc=ndata[3] ;
               if(ndata[4]!=''){
                    vm.sdate=new Date(ndata[4]) ;
                    vm.edate=new Date(ndata[5]) ;
                }
               console.log(ndata) ;
               if(ndata[6]!=''){
                $("#suppress").show() ;
               }
               $("#area").css('height','150px') ;
               console.log(ndata[7]) ;
               $('#tImage').attr('src','/tags/'+ndata[7]);
        }, 2000) ;
      }
  
      vm.deleteN=function(){
          var data=table.row('.selected').data() ;
          var id=data[0] ;
          console.log(id) ;
           $http({ method: 'DELETE', url: '/news/'+id})
                  .then(function successCallback(response) {
                      console.log(response) ;
                      table.destroy() ;
                      alertify.notify("Data has been suppressed.", 'message', 10) ;
                      lNews(event) ;
                  }, function errorCallback(response) {
                        console.log(response) ;
                  }) ;

      }
      var mflag ;
      var aNews=vm.aNews=function(ev){
          ev.preventDefault() ;
          $scope.listTemplate="../template/addNews.html" ;
          vm.spanI='Attach File' ;
          event =ev ;
          var url ;
          if(mflag=='modify'){
              url='/mnews' ;
          }else{
             url='/news' ;
          }
          var uploader=$scope.uploader = new FileUploader({
                        url: url,
                        queueLimit:1,
                        headers: {
                              Authorization: 'Bearer ' + localStorage.getItem('satellizer_token'),
                              userFlag:localStorage.getItem('userFlag')
                        }
          });
          
            uploader.filters.push({
                name: 'sizeFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                  if(item.size >10485760 ){
                     alertify.error("La taille maximale du fichier et de 10mb.",10);
                      return false;
                  }
                 else  return item.size <= 11485760 ;
                }   
            }) ;
            uploader.filters.push({
                name: 'numberFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                  if (uploader.queue.length == 1) {
                      uploader.removeFromQueue(0);
                  }
                  return true ;
                }   
            }) ;
          $scope.uploader.onBeforeUploadItem = onBeforeUploadItem;

          function onBeforeUploadItem(item) {
             item.formData.push({title: vm.title, sub:vm.sub, desc:vm.desc, tag:tFile});
              if(vm.sdate!=null || vm.edate!=null){
                if(vm.sdate!=null && vm.edate!=null){
                   var year =vm.sdate.getFullYear() ;
                    var month=vm.sdate.getMonth()+1 ;
                    var day=vm.sdate.getDate() ;
                    var timeA=year+"-"+month+"-"+day ;
                    var ta=new Date(timeA).getTime() ;
                    /**/
                    var year =vm.edate.getFullYear() ;
                    var month=vm.edate.getMonth()+1 ;
                    var day=vm.edate.getDate() ;
                    var timeB=year+"-"+month+"-"+day ;
                    var tb=new Date(timeB).getTime() ;

                    if(ta-tb>0){
                       alertify.error("The end date must be superior than the start date!") ;
                       uploader.cancelAll() ;
                       return false ;
                    }
                    item.formData.push({start:timeA}) ;
                    item.formData.push({end:timeB}) ;
                }else{
                   alertify.error("If you specify a starting date please specify an ending date too and vice versa!") ;
                    return false ;
                }
             }
             if(mflag=='modify'){
                  item.formData.push({id:newsId}) ;
                  item.formData.push({m:true}) ;
                  if(tFile==null){
                    item.formData.push({noTag:true}) ;
                
                  }else{
                      item.formData.push({noTag:false}) ;
                  }
             }

          }


          uploader.onSuccessItem = function(fileItem, response, status, headers) {
              alertify.notify("L'Upload s'est bien achevé.", 'message', 10) ;
               if(mflag=='modify'){
                 mflag=null ;
                 lNews(event) ;
                 return false ;
               }
              aNews(event) ;

           };
        
           uploader.onErrorItem = function(fileItem, response, status, headers) {
                  console.log(response) ;
                  var errs=response.errors ;
                  if(errs.file){
                       alertify.error(errs.file,10); 
                   } 
           };

          $timeout(function() {
            $("#dynamicV").show() ;
            $('#tImage').attr('src','images/tag.png');
          }, 1000);
          
          return false ;
      }

      var tag=false ;
      var tFile=null ;
      vm.tag=function(){
            $("#tag").click() ;
      }
      $scope.tImage= function(files) {
        
          var validExts = new Array(".png", ".jpeg", ".jpg");
          var fname = files[0].name.substring(files[0].name.lastIndexOf('.'));
          if (validExts.indexOf(fname) < 0) {
            alertify.error("Fichier invalid, les formats acceptés sont: "+
                     validExts.toString()) ;
            tag=false ;
            tFile=null ;
            return false;
          }

          var reader = new FileReader();
          reader.onload = function (e) {
                  $('#tImage').attr('src', e.target.result);
          }
          reader.readAsDataURL(files[0]);
          tFile=files[0];
          tag=true ;
      }

      var cancelA=vm.cancelA=function(){
          $("#attach").hide() ;
          $(".aBtn").hide() ;
          $(".nBtn").show() ;
          $("#news").show() ;
          $timeout(function(){
             $("#card").css({"width":"93%","position":"inherit", "margin-left":"0%"}) ;
          },100) ;

      }
      vm.triggerUpload=function(){
              $("#uzone").click() ;
      }

      vm.importN=function(flag){
          if($(".fields").hasClass('ng-invalid')){
                  alertify.error('Requête invalide; veuillez revérifier les erreurs de chaque case') ;
                  return false ;  
          }
           if(flag!='modify' && !tag){
            alertify.error("Don't forget the tag please!") ;
            return false ;
          }

          if(vm.sdate!=null || vm.edate!=null){
              if(vm.sdate!=null && vm.edate!=null){
                    var year =vm.sdate.getFullYear() ;
                    var month=vm.sdate.getMonth()+1 ;
                    var day=vm.sdate.getDate() ;
                    var timeA=year+"-"+month+"-"+day ;
                    var ta=new Date(timeA).getTime() ;
                    /**/
                    var year =vm.edate.getFullYear() ;
                    var month=vm.edate.getMonth()+1 ;
                    var day=vm.edate.getDate() ;
                    var timeB=year+"-"+month+"-"+day ;
                    var tb=new Date(timeB).getTime() ;

                    if(ta-tb>0){
                       alertify.error("The end date must be superior than the start date!") ;
                       return false ;
                    }
              }else{
                  alertify.error("If you specify a starting date please specify an ending date too and vice versa!") ;
                  return false ;
              }
          }

          $("#news").hide() ;
          $("#attach").show() ;
          $(".nBtn").hide() ;
          $(".mBtn").hide() ;
          $(".aBtn").show() ;
          $timeout(function(){
             $("#card").css({"width":"100%","position":"absolute", "margin-left":"-10%"}) ;
          },100) ;
         

      }
      vm.addN=function(flag){
          if($(".fields").hasClass('ng-invalid')){
                  alertify.error('Requête invalide; veuillez revérifier les erreurs de chaque case') ;
                  return false ;  
          }
          if(flag!='modify' && !tag){
            alertify.error("Don't forget the tag please!") ;
            return false ;
          }
          var ndata=new FormData() ;
          ndata.append('title',vm.title) ;
          ndata.append('sub',vm.sub) ;
          ndata.append('desc',vm.desc) ;
          ndata.append("tag",tFile) ;

          if(vm.sdate!=null || vm.edate!=null){
              if(vm.sdate!=null && vm.edate!=null){
                    var year =vm.sdate.getFullYear() ;
                    var month=vm.sdate.getMonth()+1 ;
                    var day=vm.sdate.getDate() ;
                    var timeA=year+"-"+month+"-"+day ;
                    var ta=new Date(timeA).getTime() ;
                    /**/
                    var year =vm.edate.getFullYear() ;
                    var month=vm.edate.getMonth()+1 ;
                    var day=vm.edate.getDate() ;
                    var timeB=year+"-"+month+"-"+day ;
                    var tb=new Date(timeB).getTime() ;

                    if(ta-tb>0){
                       alertify.error("The end date must be superior than the start date!") ;
                       return false ;
                    }

                    ndata.append('start',timeA) ;
                    ndata.append('end',timeB) ;
              }else{
                 alertify.error("If you specify a starting date please specify an ending date too and vice versa!") ;
                 return false ;
              }
         
          }
          var url='/news';
          if(flag=='modify'){
            url='/mnews' ;
            ndata.append("id",newsId) ;
            if(tFile==null){
                ndata.append("noTag",true) ;
            }else{
                 ndata.append("noTag",false) ;
            }
            if(vm.cfile){
                ndata.append("suppress",true) ;
            }else{
                ndata.append("suppress",false) ;
            }
          
          }
           $http({ method: 'POST', url: url,data:ndata, headers: {'Content-Type': undefined },
                transformRequest: angular.identity})
                  .then(function successCallback(response) {
                      console.log(response) ;
                      alertify.notify("News was successfully added to the base.", 'message', 10) ;
                      tag=false ;
                      tFile=null ;
                      if(flag=='modify'){
                          lNews(event) ;
                      }else{
                         aNews(event) ;
                      }
                     

                    }, function errorCallback(response) {
                        console.log(response) ;
                        var errs=response.data.errors ;
                        if(errs.tag){
                              alertify.error(errs.avatar,10); 
                        } 
                        else if(errs.title){
                            alertify.error(errs.title[0],10);
                            $scope.news['title'].$setValidity('server', false);
                            vm.titleerr=errs.title[0]; 
                            $timeout(function() {
                                  $scope.news['title'].$setValidity('server', true);
                            }, 4000);
                        } 
                        else if(errs.sub){
                            alertify.error(errs.sub[0],10);
                            $scope.news['sub'].$setValidity('server', false);
                            vm.suberr=errs.sub[0]; 
                            $timeout(function() {
                                  $scope.news['sub'].$setValidity('server', true);
                            }, 4000);
                        } 
                         else if(errs.desc){
                            alertify.error(errs.desc[0],10);
                            $scope.news['desc'].$setValidity('server', false);
                            vm.descerr=errs.desc[0]; 
                            $timeout(function() {
                                  $scope.news['desc'].$setValidity('server', true);
                            }, 4000);
                        } else if(errs.start || errs.end){
                              alertify.error("Please if you setted your dates check that they are both setted");

                        }
              });  

      }

  	  

  	   /****Gears***/
        /******Time*****/
        function timeSetter (date){
                    var year =date.getFullYear() ;
                    var month=date.getMonth()+1 ;
                    var day=date.getDate() ;
                    vm.datel=year+"-"+month+"-"+day ;
                    var today=new Date() ;
                    $(".yet").show() ;
                    var ltime=vm.ltime=Math.floor(((date-today)/1000));
                    $timeout(function() {
                        $("#timer").remove() ;
                        $('#timerD').append($compile("<timer id='timer' style='display: block; margin-left: 7%; padding-top: 3%;'  ng-attr-interval='1000'   ng-attr-countdown="+ltime+" >{{days}} days, {{hours}} hours, {{minutes}} minutes, {{seconds}} seconds</timer>")($scope));
                         $scope.$apply(); 

                    }, 100);
               
        }
        vm.setDateLimit=function(){
          var ldata={date_limit:vm.ldate} ;
          $http.post("/gear", ldata).then(function successCallback(response) {
                    console.log(response) ;
                    alertify.notify("La date vient d'être configurée!", 'message', 10) ; 
                     $(".modify").hide() ;
                    $(".notyet").hide() ;
                    timeSetter(vm.ldate) ;

                }, function errorCallback(response) {
                   console.log(response) ;
          }) ;

        }
        vm.suppressDateLimit=function(){
          $http({ method: 'DELETE', url: '/gear'})
                 .then(function successCallback(response) {
                         vm.ldate="" ;
                         $(".yet").hide() ;
                         $(".notyet").show() ;
                         $("#vbtn").removeClass("w3-green") ;
                         $("#vbtn").addClass("md-accent") ;
                  }, function errorCallback(response) {
                          console.log(response) ;
                 }) ;
              

        }
        vm.modifyDateLimit=function(){
            $(".yet").hide() ;
            $(".notyet").hide() ;
            $(".modify").show() ;
            $("#vbtn").removeClass("md-accent") ;
            $("#vbtn").addClass("w3-green") ;
        }

  	    var gears=vm.gears=function(ev,flag){  
              if(flag=='date_limit'){
                  $http.get("/gear").then(function successCallback(response) {
                        var data=response.data.flag ;
                        $scope.listTemplate="../template/gears/"+flag+".html" ;
                        if(data.setted!="unsetted"){
                            $timeout(function() {
                            $("#dynamicV").show() ; 
                             $(".notyet").hide() ;
                                var ltime=new Date(data.setted);
                                 timeSetter(ltime) ;
                            }, 1000);
                        }else{
                           $timeout(function() {
                               $("#dynamicV").show() ; 
                            }, 100);
                        }
                           $scope.minFDate=  new Date(new Date().setDate(new Date().getDate() + 1));
                          $scope.maxFDate= new Date(new Date().setFullYear(new Date().getFullYear() + 1)) ;
                       
                      }, function errorCallback(response) {
                         console.log(response) ;
                    }) ;
          }else{
             $scope.listTemplate="../template/gears/"+flag+".html" ;
              $("#dynamicV").show() ; 
                $timeout(function() { 
                    $("#dynamicV").show() ;
                    $("#dynamicV").css("margin-left","-10%"); 
                    $("#scores").mCustomScrollbar({
                        theme:"dark"
                    });
               }, 1000);  
             
          }
         
  	   } ;
     

		vm.exportList=function(number){
          $mdToast.show(
                $mdToast.list()
          );
           $timeout(function(){
              $compile($("#listT").contents())($scope) ;  
              vm.number=number ;
           },100) ; 

    }
    vm.pdf=function(flag,number){
				$http({ method: 'GET', url: '/lcandidate/'+number+'/'+flag+'/'+vm.cscore, responseType: 'arraybuffer'})
					.then(function successCallback(response) {
						  console.log(response) ;
              var blob ;
              console.log(flag) ;
              if(flag){
                  blob = new Blob([response.data], {type:"application/pdf;charset=utf-8"});
                  saveAs(blob,"canidatesList.pdf");
              }else{
                  blob = new Blob([response.data], {type:"application/xlsx;charset=utf-8"});
                  saveAs(blob,"canidatesList.xlsx");
              }
              $mdToast.cancel() ;
                 						
					  }, function errorCallback(response) {
				   			console.log(response) ;
				});
			
		}

		vm.activities=function(ev){
			ev.preventDefault() 
			$scope.listTemplate="../template/activities.html" ;

      $http({ method: 'GET', url: '/activity'})
           .then(function successCallback(response) {
              var activities=response.data ;       
          setTimeout(function() {
                scheduler.init('calendarV',new Date(),"month");
                scheduler.parse(activities,'json');
               $timeout(function(){
                   scheduler.updateView( new Date(),"month");
                      $("#header").css({'left':'0px','width':'802px'}) ;
                      $("#hbody").css({'left':'0px','width':'801px','border-left':'1px solid #CECECE',
                          'border-right': '1px solid #CECECE'}) ;
               },2000) ;
               
                
                scheduler.attachEvent("onEventAdded", function(id,ev){
                  var adata=new FormData() ;
                  adata.append("id",ev.id) ;
                  adata.append("text",ev.text) ;
                  adata.append("start_date",ev.start_date) ;
                  adata.append("end_date",ev.end_date) ;
                  $http({ method: 'POST', url: '/activity', data:adata, headers: {'Content-Type': undefined },
                        transformRequest: angular.identity})
                      .then(function successCallback(response) {
                      console.log(response) ;
                    }, function errorCallback(response) {
                        console.log(response) ;
                  }) ;
                });

                scheduler.attachEvent("onEventDeleted", function(id){
                     $http({ method: 'DELETE', url: '/activity/'+id})
                      .then(function successCallback(response) {
                          console.log(response) ;
                      }, function errorCallback(response) {
                          console.log(response) ;
                       }) ;
                });
                scheduler.attachEvent("onEventChanged", function(id,ev){
                      var adata=new FormData() ;
                      adata.append("id",ev.id) ;
                      adata.append("text",ev.text) ;
                      adata.append("start_date",ev.start_date) ;
                      adata.append("end_date",ev.end_date) ;
                      $http({ method: 'POST', url: '/mactivity', data:adata, headers: {'Content-Type': undefined },
                            transformRequest: angular.identity})
                          .then(function successCallback(response) {
                          console.log(response) ;
                        }, function errorCallback(response) {
                            console.log(response) ;
                      }) ;
                });
                scheduler.attachEvent("onViewChange", function (new_mode , new_date){
                   $("#header").css({'left':'0px','width':'802px'}) ;
                      $("#hbody").css({'left':'0px','width':'801px','border-left':'1px solid #CECECE',
                          'border-right': '1px solid #CECECE'}) ;
                });
            }, 1000);

            setTimeout(function() {
                $("#dynamicV").show() ;
            }, 100);

            }, function errorCallback(response) {
                console.log(response) ;
      }) ;


			
    }
   }   


   function VisualizationController( $scope, $compile, $mdDialog,$interval, $timeout, $http, candidate) {
      var vm=this ;

      vm.mail=function(){
          if($(".efields").hasClass('ng-invalid')){
                  alertify.error('Requête invalide; veuillez revérifier les cases!') ;
                  return false ;  
          }
          var edata={email:vm.candidate.email, subject:vm.subject , content:vm.content} ;
          console.log(edata) ;

          $http({ method: 'POST', url: '/cmail',data:edata}).then(function successCallback(response) {
                  console.log(response) ;
                  alertify.notify('Message bien envoyé', 'message', 10) ; 
                  $mdDialog.cancel() ;         
          }, function errorCallback(response) {
                console.log(response) ;
                var errs=response.data.errors ;
                if(errs.mail){
                    alertify.error(errs.mail[0],10); 
                  
                }else{
                    if(errs.subject){
                                alertify.error(errs.subject[0],10); 
                                $scope.mail['subjectField'].$setValidity('server', false);
                                vm.suberr=errs.subject[0]; 
                                $timeout(function() {
                                      $scope.mail['subjectField'].$setValidity('server', true);
                                }, 4000);
                              } 
                    else{ 
                      if(errs.content ){
                          alertify.error(errs.content[0],10); 
                          $scope.mail['contentField'].$setValidity('server', false);
                          vm.conterr=errs.content[0];
                           $timeout(function() {
                            $scope.mail['contentField'].$setValidity('server', true);
                        }, 4000);
                     }
                  }
              }  

         }) ;                  
      }

      vm.downloadU=function(){
          $http({ method: 'GET', url: '/uzip/'+cne,responseType: 'arraybuffer'})
                  .then(function successCallback(response) {
                      console.log(response) ;   
                      var blob = new Blob([response.data], {type:"application/zip"});
                      saveAs(blob, vm.candidate.first_name+"_"+vm.candidate.last_name+".zip");

                    }, function errorCallback(response) {
                        console.log(response) ;
            });
      }

      vm.send=function(){
        $("#mcard").hide() ;
        $("#mailer").show() ;
        $(".cbtn").hide() ;
        $("#mbtn").show() ;
      }

      var cne=candidate ;


       $http.get('/cne/'+cne).then(function successCallback(response) {
                      console.log(response.data) ;
                      vm.candidate=response.data ;  
                      $timeout(function() {
                        getAvatar();
                        console.log(vm.candidate.infos) ;
                        if(vm.candidate.infos==null){
                            $("#btn").hide() ;
                            $("#mcard").css("margin-bottom","4%") ;
                        }
                      }, 500);

        }).catch(function(response) {
             console.log(response) ;
        });


        var getAvatar=function(){
                  $http({ method: 'GET', url: '/candidateAv/'+vm.candidate.avatar, responseType: 'arraybuffer'})
                      .then(function successCallback(response) {
                        var data=response.data ;
                        var str = _arrayBufferToBase64(data);
                        $scope.profileAvatar = 'data:image/gif;base64,'+str;
                        }, function errorCallback(response) {
                            console.log(response) ;
                  });   
      }
  }





 })() ;