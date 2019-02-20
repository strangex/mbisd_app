(function() {

    'use strict';

    angular
        .module('mbiscApp')
        .filter('subdate',function() {

              return function subf(input) {
                return input.substring(0,10);
              }
          })
        .filter('check_a',function() {
              return function check(input) {
                 if(input!=null){
                    return {'display':'inline'};
                 }else{
                     return {'display':'none'} ;
                 }
              }
          })
          .filter('check_s',function() {
              return function check(input) {
                 if(input!=null){
                    return 'nframe';
                 }else{
                     return '' ;
                 }
              }
          })
        .controller('HomeController', HomeController);

    function LessonController($scope, $mdDialog,$interval, $timeout, lessons) {

      $scope.matieres=lessons ;

      var table=$('#matieresTable').DataTable({
          paging:true,
      });

      $('#matieresTable tbody').on( 'click', 'tr', function () {
              if ( $(this).hasClass('selected') ) {
                  $(this).removeClass('selected');
                  $(".btns").hide() ;
             
              }
              else {
                 table.$('tr.selected').removeClass('selected');
                  $(this).addClass('selected');
                  $(".btns").show() ;
                
              }
        }) ;
    }

    function HomeController($auth, $state, $scope, $mdDialog,$interval, $timeout, $http, $window) {

        var vm = this;
        vm.activated = true;
        vm.determinateValue = 30;

        vm.template='template/accueil.html' ;

        var expandedP=false ;
        vm.expandI='icons/ic_view_list_black_24px.svg' ;

        /******Students********/
            var students=null
            vm.expandP=function(){
              if(expandedP) {
                expandedP=false
                $("#expandB").removeClass("w3-pink");
                $("#expandB").addClass("w3-white");
                $("#promotion").hide()
                vm.expandI='icons/ic_view_list_black_24px.svg' ;
              } else {
                expandedP=true
                $("#expandB").removeClass("w3-white");
                $("#expandB").addClass("w3-pink");
                $("#promotion").show()
                 vm.expandI='icons/ic_close_white_24px.svg' ;
              }
            } 
            vm.promoTitle="Nos Etudiants"
         

           vm.loadP=function(){
                return $timeout(function() {
                    vm.promotions =  vm.promotions  || [
                      { name: 'Master 1',category:'year' },
                      { name: 'Promotion 2017', category:'phd'}
                    ];

              }, 650);
            }
            vm.chargeP=function(){
              vm.expandP()      
              pictures(students[2017])
              vm.promotion=null 
            }

            var getStudents=function(){
                $http({ method: 'GET', url: '/students'}).then(function successCallback(response) {
                       students=response.data
                       vm.promoTitle="Nos Etudiants"
                       vm.folder="student"
                       pictures(students[2017])
                        $("#expandB").hide()
                }, function errorCallback(response) {
                       console.log(response) ;
                }) ;
            }


           function pictures(infos){
                vm.rn=null;
                var floor=Math.floor(infos.length/5) ;
                var rest=infos.length-(floor*5) ;
                var givenR=false ;
                if(rest==0){
                   vm.rn=floor ;
                }else{
                   vm.rn=floor+1 ;
                   givenR=true ;
                }

                vm.rn=new Array(vm.rn); 
                var rp=0 ;
                if(givenR){
                  rp=vm.rn.length-1 ;
                }else{
                    rp=vm.rn.length
                }
                
                for(var i=0; i<rp;i++){
                    vm.rn[i]=new Array(5) ;
                    for(j=0;j<5;j++){
                      vm.rn[i][j]=infos[i*5+j]
                    }
                }  
                if(givenR){
                  vm.rn[rp]=new Array(rest) ;
                   for(var j=0;j<rest;j++){
                      vm.rn[rp][j]=infos[rp*5+j]
                    }
                }          
            }
      /**************Laureats*******************/
         var laureats=[
                        { name: 'El Houdaigui Bilal' ,avatar: 'bilal.png'},
                        { name: 'Ettetuani Boutaina' ,avatar: 'boutaina.jpg'},
                        { name: 'Maguerra Soufiane' ,avatar: 'soufiane.jpg'},
                        { name: 'Amrou M\'Hand Mouna' ,avatar: 'mouna.jpg'},
                        { name: 'Mazdar Sofia' ,avatar: 'sofia.jpg'},
                        { name: 'Tchogna Sonia Alexandra' ,avatar: 'sonia.jpg'},
                        { name: 'Yassine Asmaa' ,avatar: 'asmaa.jpg'},
                        { name: 'Abroun Soundouss' ,avatar: 'soundouss.jpg'},
                        { name: 'Sekkouri Salma' ,avatar: 'salma.jpg'},
                        { name: 'Benamri Ichrak' ,avatar: 'ichrak.png'},
                        { name: 'Maski Soufiane' ,avatar: 'maski.jpg'},
                        { name: 'Badri Yassine' ,avatar: 'yassine.png'},
                        { name: 'Hakim Salma' ,avatar: 'hakim.jpg'},
                        { name: 'Kammas Imane' ,avatar: 'imane.jpg'},
                        { name: 'Ed-Driouch Chadia' ,avatar: 'chadia.jpg'},
                        { name: 'Rabhi Ahmed' ,avatar: 'ahmed.jpg'},
                        { name: 'Samake Adama' ,avatar: 'adama.jpg'},
                        { name: 'Ouederrou Salah' ,avatar: 'salah.jpg'},
            ] ;
      /*****************************************/
        var state='accueil' ;
        var table ;
        vm.formation=function(ev){
            $(".active").css("background-color","#fff") ;
            $(".active").removeClass("active") ;

             $http({ method: 'GET', url: '/module'})
                            .then(function successCallback(response) {
                                var modules=response.data ;
                                if(modules.length==0){
                                  alertify.error("Aucun module n'est encore ajouté!!", 10) ;
                                  return false ;
                                }else{
                                     vm.template='template/accueil/formation.html' ;
                                      $scope.modules=modules ;
                                       $('title').text("Formation") ;

                                      $timeout(function() {
                                          table=$('#modulesTable').DataTable({
                                              paging:true,
                                          });

                                          $('#modulesTable tbody').on( 'click', 'tr', function () {
                                                  if ( $(this).hasClass('selected') ) {
                                                      $(this).removeClass('selected');
                                                      $(".btns").hide() ;
                                                 
                                                  }
                                                  else {
                                                     table.$('tr.selected').removeClass('selected');
                                                      $(this).addClass('selected');
                                                      $(".btns").show() ;
                                                    
                                                  }
                                            }) ;

                                            $("#dynamic").show() ;
                                            $("#a_formation").css("background-color","#3d84e6") ;
                                            $("#a_formation").addClass("active") ;

                                            $("#homeView").scrollTo(0,0,{easing:"swing"}); 
                                            state='formation' ;
                                      }, 300);
                                }
                             
                              }, function errorCallback(response) {
                                  console.log(response) ;
          }) ;
        }
        vm.showMa=function(ev){
            var data=table.row('.selected').data() ;
            var matieres=JSON.parse(data[9]) ;
            if(matieres.length>0){
                 $mdDialog.show({
                      controller :LessonController,
                      controllerAs:'lesson',
                      templateUrl: '../template/accueil/formation_matiere.html',
                      parent: angular.element(document.body),
                      targetEvent: ev,
                      clickOutsideToClose:true,
                      fullscreen: $scope.customFullscreen,
                      locals:{lessons:matieres}
                 });
            }else{
                 alertify.error("Aucune matière n'est attachée à ce module!") ;
            }
        }

        var linker=vm.link=function(ev, flag){
           $(".active").css("background-color","#fff") ;
           $(".active").removeClass("active") ;
           if(flag=='news' && state=='accueil'){
                navTo("news");
                return false ;
            }else{
               if(flag=='news'){
                    vm.template='template/accueil.html' ;
                    state='accueil' ;
                }else{
                  if(flag=='accueil' && state=='accueil'){
                     return false ;
                   }else{
                      if(flag=='students' || flag=='laureats'){
                        vm.template='template/students.html' ;
                      }else{
                        vm.template='template/'+flag+'.html' ;
                      }
                   }
                }
            }
            $('.contactS').show() ;
          
           $timeout(function() {
              if(flag=='accueil'){
                 $('title').text("Accueil") ;
                  $("#dynamic").show() ;
                  $("#homeView").scrollTo(0,0,{easing:"swing"}); 
                  setTimeout(function() {  accueil() ;}, 100);
                  state='accueil' ;
                  return false ;
              }
              if(flag=='aboutP'){
                 $('title').text("About") ;
                  state='about' ;
              }
              if(flag=='contact'){
                  $('title').text("Contact") ;
                  $("#dynamic").show() ;
                  $("#a_"+flag).css("background-color","#3d84e6") ;
                  $("#a_"+flag).addClass("active") ;
                  $("#homeView").scrollTo(0,0,{easing:"swing"}); 
                  setTimeout(function() {$('.contactS').hide() ;}, 200);
                  state='contact' ;
                  return false ;
              }
              if(flag=='news'){
                  $('title').text("Accueil") ;
                  $("#dynamic").show() ;
                    $("#a_"+flag).css("background-color","#3d84e6") ;
                    $("#a_"+flag).addClass("active") ;
                  setTimeout(function() {accueil() ;}, 100);
                  setTimeout(function() {navTo("news");}, 500);
                  state='accueil' ;
                  return false ;
              }
              if(flag=='timeline'){
                $('title').text("Timeline") ;
                      scheduler.config.readonly = true;
                      scheduler.init('calendarV');
                      scheduler.parse(activities, "json");
                      $("#dynamic").show() ;
                      setTimeout(function(){
                           scheduler.updateView( new Date(),"month");
                           $("#homeView").scrollTo(0,0,{easing:"swing"}); 
                           $("#a_students").css("background-color","#3d84e6") ;
                           $("#a_students").addClass("active") ;
                           return false ;
                      },100) ;
                  state='timeline' ;
              }
              if(flag=='students'){
                  $('title').text("Students") ;
                  getStudents();
                  state='students' ;
              }
               if(flag=='laureats'){
                  $('title').text("Laureats") ;
                  vm.folder="img/profile"
                  vm.promoTitle="Nos Lauréats"
                  pictures(laureats)
                   $("#expandB").hide()
                  state='laureats' ;
              }
               if(flag=='partenaire'){
                  $('title').text("Partenaire") ;
                  $("#dynamic").show() ;
                  $("#a_students").css("background-color","#3d84e6") ;
                  $("#a_students").addClass("active") ;
                  state='partenaire' ;
              }
               if(flag=='professor'){
                  $('title').text("Professor") ;
                  $("#dynamic").show() ;
                  $("#a_students").css("background-color","#3d84e6") ;
                  $("#a_students").addClass("active") ;
                  state='professor' ;
              }
              setTimeout(function() {  
                   $("#dynamic").show() ;
                    $("#a_"+flag).css("background-color","#3d84e6") ;
                    $("#a_"+flag).addClass("active") ;
                   $("#homeView").scrollTo(0,0,{easing:"swing"}); 
              }, 1000);
           
           }, 500);
        } ;

        function accueil(){
            $('#slider').camera({
                height:"41%",
                pagination: false,
                hover:false,
                navigation:false,
                playPause:false,
                loader:'none',
                overlayer:false
            });
               if(!limit){
                      $(".limit").hide() ;
                  }
                  
            $timeout(function() {  
              news() ;
              professors() ;
              partenaires() ;
            }, 1000);
        };

        $timeout(function() {
              $('#dynamic').show();
              accueil() ;
              if(!limit){
                  $(".limit").hide() ;
              }
        }, 2000);

        var limit=false ;
        $http.get("/gear").then(function successCallback(response) {
                        var data=response.data.flag ;
                        if(data.setted!="unsetted"){
                          var today=new Date() ;
                          var tmp=new Date(data.setted) ;
                          tmp=Math.floor(((tmp-today)/1000));
                          if(tmp>0){
                             limit=true ;
                             vm.limit=tmp ;
                          }
                        }   
         }, function errorCallback(response) {
                    console.log(response) ;

        }) ;


       
        

        function news(){
                    $http({ method: 'GET', url: '/news'})
                        .then(function successCallback(response) {
                              $scope.news=response.data ;
                              $timeout(function() {
                                   $("#Glide").glide({
                                      type: "carousel",
                                      mode:"horizontal",
                                      autoplay:5000,
                                      centered:true,
                                      hoverpause:true,
                                      autoheight:false,
                                      keyboard:true,
                                      paddings:'70'
                                 });
                                $(".glide__wrapper").css("height","100%");

                              }, 1000);
                        }, function errorCallback(response) {
                          console.log(response) ;
                        }) ;
        }
         function professors(){
                    $http({ method: 'GET', url: '/professor'})
                        .then(function successCallback(response) {
                                console.log(response) ;
                                vm.professors=response.data ;
                        }, function errorCallback(response) {
                          console.log(response) ;
                        }) ;
        }
         function partenaires(){
                    $http({ method: 'GET', url: '/partenaire'})
                        .then(function successCallback(response) {
                                console.log(response) ;
                                vm.partenaires=response.data ;
                        }, function errorCallback(response) {
                          console.log(response) ;
                        }) ;
        }

        vm.goTo=function(link){
          $window.open("http://"+link) ;
         
        }
        vm.viewProfessor=function(professor){
          vm.chosenProfessor=professor ;
          $("#professor").show() ;
        }
        vm.viewPartenaire=function(partenaire){
          vm.chosenPartenaire=partenaire ;
          $("#partenaire").show() ;
        }

        vm.nclick=function(ev,n){
          console.log(n) ;
          ev.preventDefault() ;
          if(n['file']==null){
               alertify.error("Aucun Fichier Attaché à cette Actu!") ;
          }else{
                $http({ method: 'GET', url: '/tags_files/'+n['file'], responseType: 'arraybuffer'})
                  .then(function successCallback(response) {
                       console.log(response) ;
                       var format = n['file'].substring(n['file'].lastIndexOf('.'));
                       var blob = new Blob([response.data], {type:"application/*"});
                       saveAs(blob,n['title']+format);
                    }, function errorCallback(response) {
                        console.log(response) ;
                });
          }
        }


        var progressBar=function(){
            vm.determinateValue += 1;
             if (vm.determinateValue > 100) {
                 vm.determinateValue = 30;
                 vm.activated = false;
               $("#preload").hide() ;
               $(".homecore").show(); 
               $interval.cancel(preload) ;
            }
        }

       
         var preload=$interval(function() {
              progressBar() ;
         }, 50);
       
         
        var navTo=vm.navTo=function(section){
           $("#homeView").scrollTo($("#"+section),1000,{easing:"swing"}); 
            return false ;
        }


        vm.cal=[] ;

      
        $scope.uiConfig = {
          calendar:{
            height: 450,
            editable: true,
            header:{
              left: 'month basicWeek basicDay agendaWeek agendaDay',
              center: 'title',
              right: 'today prev,next'
            },
            eventClick: $scope.alertEventOnClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize
          }
        };

       var activities ;
       $http({ method: 'GET', url: '/activity'})
           .then(function successCallback(response) {
               activities=response.data ;       
            }, function errorCallback(response) {
                console.log(response) ;
        }) ;


        vm.signIn=function(ev){
                $mdDialog.show({
                      controller :AuthController,
                      controllerAs:'auth',
                      templateUrl: '../template/signin.html',
                      parent: angular.element(document.body),
                      targetEvent: ev,
                      clickOutsideToClose:true,
                      fullscreen: $scope.customFullscreen
                });
        } ;

        vm.postuler=function(ev){

                $mdDialog.show({
                      controller :InscrptController,
                      controllerAs:'inscrpt',
                      templateUrl: '../template/postuler.html',
                      parent: angular.element(document.body),
                      targetEvent: ev,
                      clickOutsideToClose:true,
                      fullscreen: $scope.customFullscreen
                });
        } ;
         vm.about=function(ev,type){
                $mdDialog.show({
                      controller :aboutController,
                      controllerAs:'about',
                      templateUrl: '../template/about.html',
                      parent: angular.element(document.body),
                      targetEvent: ev,
                      clickOutsideToClose:true,
                      fullscreen: $scope.customFullscreen,
                      locals:{aboutT:type},
                      onRemoving:function(){
                        $('.navbar-nav').css('background-color','white') ;
                      }
                });
        } ;

        vm.sendEmail=function(ev){
            console.log("clicked") ;
            var number=$("#phoneField").intlTelInput("getNumber") ;
            var isValid = $("#phoneField").intlTelInput("isValidNumber");
            if(!isValid){
                alertify.error("Numéro de téléphone incorrecte!") ;
                return false ;
            }
           if($(".fields").hasClass('ng-invalid')){
                  alertify.error('Requête invalide; veuillez revérifier les cases!') ;
                  return false ;  
            }
                    var cdata={number:number , fname:vm.fname, lname:vm.lname, sender:vm.email, subject:vm.subject, content:vm.content}
                    $http({ method: 'POST', url: '/contact',data:cdata}).then(function successCallback(response) {
                            console.log(response) ;
                            alertify.notify('Message bien envoyé', 'message', 10) ; 
                            linker(ev,'accueil') ;
                            
                      }, function errorCallback(response) {
                        console.log(response) ;
                         var errs=response.data.errors ;
                             if(errs.lname){
                                alertify.error(errs.lname[0],10); 
                                $scope.contactName['lnameField'].$setValidity('server', false);
                                vm.lerr=errs.lname[0]; 
                                  $timeout(function() {
                                      $scope.contactName['lnameField'].$setValidity('server', true);
                                  }, 4000);
                              } 
                              else{ if(errs.fname ){
                                    alertify.error(errs.fname[0],10); 
                                    $scope.contactName['fnameField'].$setValidity('server', false);
                                    vm.ferr=errs.fname[0];
                                     $timeout(function() {
                                      $scope.contactName['fnameField'].$setValidity('server', true);
                                  }, 4000);
                               } else {
                                  if(errs.sender ){
                                     alertify.error(errs.sender[0],10); 
                                     $scope.contactName['emailField'].$setValidity('server', false);
                                     vm.emailerr=errs.sender[0];
                                      $timeout(function() {
                                        $scope.contactName['emailField'].$setValidity('server', true);
                                    }, 4000);

                                   } else {
                                      if(errs.subject ){
                                          alertify.error(errs.subject[0],10); 
                                          $scope.contactName['subjectField'].$setValidity('server', false);
                                          vm.suberr=errs.subject[0];
                                             $timeout(function() {
                                              $scope.contactName['subjectField'].$setValidity('server', true);
                                          }, 4000);

                                       } else {
                                          if(errs.content ){
                                              alertify.error(errs.content[0],10); 
                                              $scope.contactName['contentField'].$setValidity('server', false);
                                              vm.conterr=errs.content[0];
                                               $timeout(function() {
                                                  $scope.contactName['contentField'].$setValidity('server', true);
                                              }, 4000);
                                           }
                                           else {
                                              if(errs.number ){
                                                  alertify.error(errs.number[0],10); 
                                                  $scope.contactName['phoneField'].$setValidity('server', false);
                                                  vm.phonerr=errs.number[0];
                                                   $timeout(function() {
                                                      $scope.contactName['phoneField'].$setValidity('server', true);
                                                  }, 4000);
                                               }
                                            }
                                      }
                                    }
                                 }      
                               } 

                      }) ;                  
        }    
    }
    function aboutController($scope,$interval, $mdSidenav, $mdDialog,$timeout, $http, aboutT){
        var vm=this ;
        $scope.tabId=aboutT; 
        $timeout(function() {
             $(".nav").css("background-color","#4acaa8") ;
            
        }, 100);

        $scope.$watch('tabId', function(current, old){
           $timeout(function() {
              $(".header").css("height","1000px") ;
              $(".tabContent").hide() ;
              $(".tabContent").show() ;
              $(".first").addClass("active") ;
              $(".tabContent").mCustomScrollbar({
                theme:"dark"
              });
            },200) ;
        });
        
        vm.navTo=function(id){
            $(".active").removeClass("active") ;
            $("#"+id+"A").addClass("active") ;
            $(".tabContent").mCustomScrollbar("scrollTo","#"+id,{
               scrollEasing:"easeOut"
            });
            return false ;
        }

    }

    function InscrptController($scope,$state,$rootScope, $interval, $compile, $mdSidenav, $mdDialog,$timeout, $http) {
        var vm=this ;
        vm.first_name="" ;  vm.email="" ;  vm.address="" ;
        vm.last_name="" ;
        vm.cin="" ; 
        vm.cne="" ;  

        vm.signIn=function(ev){
             $mdDialog.show({
                      controller :AuthController,
                      controllerAs:'auth',
                      templateUrl: '../template/signin.html',
                      parent: angular.element(document.body),
                      targetEvent: ev,
                      clickOutsideToClose:true,
                      fullscreen: $scope.customFullscreen
               });
        }

        vm.backP=function(){
              $("#professional").show() ;
              $(".ebtns").show() ;
              $("#existing").hide() ;

        }



        vm.checkCountry=function(){
          $("#consigne").css({"display":"block","font-size":"12px"}) ;
          $("#infoBtn").css({"margin-left":"30%"}) ;
          
        }
        var avatar=false ;        var avFile=null;
        
        $scope.minBDate= new Date(1992,1,1);
        $scope.maxBDate= new Date(1996,11,31);

        $scope.minBacDate= new Date(2010,7,31);
        $scope.maxBacDate= new Date(2014,7,31);

        $scope.minBac2Date= new Date(2012,6,31);
        $scope.maxBac2Date= new Date(2016,6,31);
        
        $scope.minBac3Date= new Date(2013,6,31);
        $scope.maxBac3Date= new Date(2017,6,31);
       
        vm.chargeBacT=function(){
          if(vm.bacType=="Autre"){
            $("#bactype").empty() ;
            $("#bactype").append("<md-input-container class='md-block'>"
                    +"<label>Bac type</label>"
                    +"<input md-autofocus class='lfields' required ng-minlength='5'  ng-maxlength='40' ng-model='inscrpt.bacType' name='other_bactype'>"
                    +"<div class='validation-messages' ng-messages='academic.other_bactype.$error'>"
                        +"<div ng-message='required'>Le type est indispensable!</div>"
                        +"<div ng-message='minlength'>Le type doit inclure un minimum de 5 lettres!</div>"
                        +"<div ng-message='maxlength'>Le type doit inclure un maximum de 40 lettres!</div>"
                    +"</div>"
                    +"</md-input-container>"
              );
            $timeout(function(){
              $compile($("#bactype").contents())($scope) ;   
               vm.bacType="";
            },10) ; 
          }
        }
        vm.chargeBac2T=function(){
          if(vm.bac2Type=="Autre"){
            $("#bac2Type").empty() ;
            $("#bac2Type").append("<md-input-container class='md-block'>"
                    +"<label>Bac 2 type</label>"
                    +"<input md-autofocus class='lfields' required  ng-maxlength='40' ng-minlength='5'  ng-model='inscrpt.bac2Type' name='bac2Type'>"
                    +"<div class='validation-messages' ng-messages='academic.bac2Type.$error'>"
                        +"<div ng-message='required'>Le type est indispensable!</div>"
                        +"<div ng-message='minlength'>Le type doit inclure un minimum de 5 lettres!</div>"
                        +"<div ng-message='maxlength'>Le type doit inclure un maximum de 40 lettres!</div>"
                    +"</div>"
                    +"</md-input-container>"
              );
            $timeout(function(){
              $compile($("#bac2Type").contents())($scope) ;   
               vm.bac2Type="";
            },10) ; 
          }
        }
        vm.chargeBac3T=function(){
          if(vm.bac3Type=="Autre"){
            $("#bac3Type").empty() ;
            $("#bac3Type").append("<md-input-container class='md-block'>"
                    +"<label>Bac 3 type</label>"
                    +"<input md-autofocus class='lfields' required  ng-maxlength='40' ng-minlength='5' ng-model='inscrpt.bac3Type' name='bac3Type'>"
                    +"<div class='validation-messages' ng-messages='academic.bac3Type.$error'>"
                      +"<div ng-message='required'>Le type est indispensable!</div>"
                      +"<div ng-message='minlength'>Le type doit inclure un minimum de 5 lettres!</div>"
                      +"<div ng-message='maxlength'>Le type doit inclure un maximum de 40 lettres!</div>"
                    +"</div>"
                    +"</md-input-container>"
              );
            $timeout(function(){
              $compile($("#bac3Type").contents())($scope) ;   
               vm.bac3Type="";
            },10) ; 
          }
        }

        vm.candidate=function(){
           $(".ebtns").hide() ;
           var udata= new FormData();
           if(vm.bacDate==null || vm.bac2Date==null || vm.bac3Date==null){
                alertify.error("Veuillez ne pas oublier de citer les dates des bacs!") ;
                 $(".ebtns").show() ;
                return false ;
          }
          if(!avatar){
            alertify.error("Veuillez charger votre photo de profil!") ;
            $(".ebtns").show() ;
            return false ;
          }
           if($(".lfields").hasClass('ng-invalid')){
                  alertify.error('Requête invalide; veuillez revérifier les erreurs de chaque case') ;
                  $(".ebtns").show() ;
                  return false ;  
          }
          var byear =vm.bacDate.getFullYear() ;
          var bmonth=vm.bacDate.getMonth()+1 ;
          var bday=vm.bacDate.getDate() ;
          vm.bac_date=byear+"-"+bmonth+"-"+bday ;
          var b2year =vm.bac2Date.getFullYear() ;
          var b2month=vm.bac2Date.getMonth()+1 ;
          var b2day=vm.bac2Date.getDate() ;
          vm.bac2_date=b2year+"-"+b2month+"-"+b2day ;
          var b3year =vm.bac3Date.getFullYear() ;
          var b3month=vm.bac3Date.getMonth()+1 ;
          var b3day=vm.bac3Date.getDate() ;
          vm.bac3_date=b3year+"-"+b3month+"-"+b3day ;
            
            udata.append("avatar",avFile) ;
            udata.append("first_name",vm.first_name) ;   udata.append("cne",vm.cne) ;
            udata.append("last_name",vm.last_name) ;     udata.append("cin",vm.cin) ;  
            udata.append("email",vm.email) ;             udata.append("home_number",vm.number) ;  
            udata.append("country",vm.country) ;         udata.append("gsm",vm.gsm) ;        
            udata.append("city",vm.city) ;               udata.append("gender",vm.gender) ; 
            udata.append("address",vm.address) ; 
            udata.append("birth_date",vm.candBDate) ;         
            /**/        
            udata.append("bac_date",vm.bac_date) ;       
            udata.append("bac_type",vm.bacType) ;       
            udata.append("bac_note",vm.bacNote) ;
            /**/     
            udata.append("bac2_note1",vm.bac2N1) ;     udata.append("bac2_uni",vm.bac2UniType) ;  
            udata.append("bac2_note2",vm.bac2N2) ;    udata.append("bac2_estab",vm.bac2Estab) ; 
            udata.append("bac2_note3",vm.bac2N3) ;     udata.append("bac2_option",vm.bac2Option) ;
            udata.append("bac2_note4",vm.bac2N4) ;    udata.append("bac2_type",vm.bac2Type) ;
            udata.append("bac2_note",vm.bad2NG) ;     udata.append("bac2_date",vm.bac2_date) ; 

            /**/
            udata.append("bac3_note1",vm.bac3N5) ;  udata.append("bac3_date",vm.bac3_date) ; 
            udata.append("bac3_note2",vm.bac3N6) ;  udata.append("bac3_estab",vm.bac3Estab) ;  
            udata.append("bac3_note",vm.bac3NG) ;   udata.append("bac3_uni",vm.bac3UniType) ;
            udata.append("bac3_type",vm.bac3Type) ;  udata.append("bac3_option",vm.bac3Option) ;


            $http.post("/candidate", udata, {
                    headers: {'Content-Type': undefined },
                    transformRequest: angular.identity
                }).then(function successCallback(response) {
                    console.log(response) ;
                    alertify.notify("Votre candidature vient d'être accepté, veuillez vérifier l'inbox de votre email", 'message', 10) ; 
                    $mdDialog.cancel() ;
                    avFile=null ;
                }, function errorCallback(response) {
                   console.log(response) ;
                     var errs=response.data.errors ;
                     $(".ebtns").show() ;
                     if(errs.avatar){
                          alertify.error(errs.avatar,10); 
                     } else if(errs.user){
                          alertify.error(errs.user,10); 
                     }
                     else if(errs.candidate){
                          alertify.error(errs.candidate,10); 
                     }
                     else if(errs.uniqueEmail){
                         $("#professional").hide() ;
                         $("#existing").show() ;
                          vm.existant=errs.uniqueEmail ;
                      } 
                     else if(errs.uniqueCin){
                          $("#professional").hide() ;
                           $("#existing").show() ;
                           vm.existant=errs.uniqueCin ;
                      
                      } 
                    else if(errs.uniqueCne){
                          $("#professional").hide() ;
                           $("#existing").show() ;
                           vm.existant=errs.uniqueCne ;
                      
                      } 
                    else if(errs.first_name){
                           alertify.error(errs.first_name[0],10); 
                          vm.modifyFname()
                      
                      } 
                      else if(errs.last_name) {
                          alertify.error(errs.last_name[0],10); 
                          vm.modifyLname()
                      }
                      else if(errs.cin) {
                          alertify.error(errs.cin[0],10);  vm.modifyCin()
                      }
                       else if(errs.cne) {
                          alertify.error(errs.cne[0],10);   vm.modifyCne()
                      }
                       else if(errs.country) {
                          alertify.error(errs.country[0],10);  vm.modifyCountry() 
                      }
                       else if(errs.city) {
                          alertify.error(errs.city[0],10);   vm.modifyCity()
                      }
                       else if(errs.email) {
                          alertify.error(errs.email[0],10);   vm.modifyEmail()
                      }
                      else if(errs.address) {
                          alertify.error(errs.address[0],10);   vm.modifyAddress()
                      }
                      else if(errs.gsm) {
                          alertify.error(errs.gender[0],10);   vm.modifyGSM()
                      }
                      else if(errs.home_number) {
                          alertify.error(errs.gender[0],10);   vm.modifyPhone()
                      }
                      else if(errs.birth_date) {
                          alertify.error(errs.gender[0],10);   vm.modifyBDate()
                      }
                      else if(errs.bac_date) {
                          alertify.error(errs.bac_date[0],10); 
                      }
                      else if(errs.bac_type) {
                          alertify.error(errs.bac_type[0],10);
                          $scope.academic['bacType'].$setValidity('server', false);
                          vm.server_bac_type=errs.bac_type[0]; 
                          $timeout(function() {
                                  $scope.academic['bacType'].$setValidity('server', true);
                              }, 4000);

                      }
                      else if(errs.bac_note) {
                          alertify.error(errs.bac_note[0],10); 
                          $scope.academic['bacNote'].$setValidity('server', false);
                          vm.server_bac_note=errs.bac_note[0]; 
                          $timeout(function() {
                                  $scope.academic['bacNote'].$setValidity('server', true);
                              }, 4000);

                      }
                      else if(errs.bac2_uni) {
                          alertify.error(errs.bac2_uni[0],10);
                          $scope.academic['username'].$setValidity('server', false);
                          vm.server_bac2_uni=errs.bac2_uni[0]; 
                          $timeout(function() {
                                  $scope.academic['username'].$setValidity('server', true);
                              }, 4000);

                      }
                      else if(errs.bac2_type) {
                          alertify.error(errs.bac2_type[0],10);
                          $scope.academic['bac2Type'].$setValidity('server', false);
                          vm.server_bac2_type=errs.bac2_type[0]; 
                          $timeout(function() {
                                  $scope.academic['bac2Type'].$setValidity('server', true);
                              }, 4000);

                      }
                      else if(errs.bac2_estab) {
                          alertify.error(errs.bac2_estab[0],10);
                          $scope.academic['bac2Estab'].$setValidity('server', false);
                          vm.server_bac2_estab=errs.bac2_estab[0]; 
                          $timeout(function() {
                                  $scope.academic['bac2Estab'].$setValidity('server', true);
                              }, 4000);

                      }
                      else if(errs.bac2_date) {
                          alertify.error(errs.bac2_date[0],10);

                      }
                       else if(errs.bac2_note) {
                          alertify.error(errs.bac2_note[0],10);
                          $scope.academic['bad2NG'].$setValidity('server', false);
                          vm.server_bac2_note=errs.bac2_note[0]; 
                          $timeout(function() {
                                  $scope.academic['bad2NG'].$setValidity('server', true);
                              }, 4000);

                      }
                       else if(errs.bac2_note1) {
                          alertify.error(errs.bac2_note1[0],10);
                          $scope.academic['bac2N1'].$setValidity('server', false);
                          vm.server_bac2_note1=errs.bac2_note1[0];
                          $timeout(function() {
                                  $scope.academic['bac2N1'].$setValidity('server', true);
                              }, 4000); 

                      }
                       else if(errs.bac2_note2) {
                          alertify.error(errs.bac2_note2[0],10);
                          $scope.academic['bac2N2'].$setValidity('server', false);
                          vm.server_bac2_note2=errs.bac2_note2[0]; 
                          $timeout(function() {
                                  $scope.academic['bac2N2'].$setValidity('server', true);
                              }, 4000);

                      }
                       else if(errs.bac2_note3) {
                          alertify.error(errs.bac2_note3[0],10);
                          $scope.academic['bac2N3'].$setValidity('server', false);
                          vm.server_bac2_note3=errs.bac2_note3[0]; 
                          $timeout(function() {
                                  $scope.academic['bac2N3'].$setValidity('server', true);
                              }, 4000);

                      }
                       else if(errs.bac2_note4) {
                          alertify.error(errs.bac2_note4[0],10);
                          $scope.academic['bac2N4'].$setValidity('server', false);
                          vm.server_bac2_note4=errs.bac2_note4[0]; 
                          $timeout(function() {
                                  $scope.academic['bac2N4'].$setValidity('server', true);
                              }, 4000);

                      }
                       else if(errs.bac3_date) {
                          alertify.error(errs.bac3_date[0],10);
                      }
                       else if(errs.bac3_type) {
                          alertify.error(errs.bac3_type[0],10);
                          $scope.academic['bac3Type'].$setValidity('server', false);
                          vm.server_bac3_type=errs.bac3_type[0]; 
                          $timeout(function() {
                                  $scope.academic['bac3Type'].$setValidity('server', true);
                              }, 4000);

                      }
                       else if(errs.bac3_uni) {
                          alertify.error(errs.bac3_uni[0],10);
                          $scope.academic['bac3UniType'].$setValidity('server', false);
                          vm.server_bac3_uni=errs.bac3_uni[0]; 
                          $timeout(function() {
                                  $scope.academic['bac3UniType'].$setValidity('server', true);
                              }, 4000);

                      }
                       else if(errs.bac3_estab) {
                          alertify.error(errs.bac3_estab[0],10);
                          $scope.academic['bac3Estab'].$setValidity('server', false);
                          vm.server_bac3_estab=errs.bac3_estab[0]; 
                          $timeout(function() {
                                  $scope.academic['bac3Estab'].$setValidity('server', true);
                              }, 4000);
                      }
                       else if(errs.bac3_note1) {
                          alertify.error(errs.bac3_note1[0],10);
                          $scope.academic['bac3N1'].$setValidity('server', false);
                          vm.server_bac3_note1=errs.bac3_note1[0]; 
                          $timeout(function() {
                                  $scope.academic['bac3N1'].$setValidity('server', true);
                              }, 4000);
                      }
                       else if(errs.bac3_note2) {
                          alertify.error(errs.bac3_note2[0],10);
                          $scope.academic['bac3N2'].$setValidity('server', false);
                          vm.server_bac3_note2=errs.bac3_note2[0]; 
                          $timeout(function() {
                                  $scope.academic['bac3N2'].$setValidity('server', true);
                              }, 4000);

                      }
                       else if(errs.bac3_note) {
                          alertify.error(errs.bac3_note[0],10);
                          $scope.academic['bac3NG'].$setValidity('server', false);
                          vm.server_bac3_note=errs.bac3_note[0]; 
                          $timeout(function() {
                                  $scope.academic['bac3NG'].$setValidity('server', true);
                              }, 4000);

                      }
                       else if(errs.bac2_option) {
                          alertify.error(errs.bac2_option[0],10);
                          $scope.academic['bac2Option'].$setValidity('server', false);
                          vm.server_bac2_option=errs.bac3_note[0]; 
                          $timeout(function() {
                                  $scope.academic['bac2Option'].$setValidity('server', true);
                              }, 4000);

                      }
                       else if(errs.bac3_option) {
                          alertify.error(errs.bac3_option[0],10);
                          $scope.academic['bac3Option'].$setValidity('server', false);
                          vm.server_bac3_option=errs.bac3_option[0]; 
                          $timeout(function() {
                                  $scope.academic['bac3Option'].$setValidity('server', true);
                              }, 4000);

                      }
            });
        }
        vm.avatar=function(){
            $("#avatar").click() ;
        }
        $scope.cAvatar= function(files) {
        
          var validExts = new Array(".png", ".jpeg", ".jpg");
          var fname = files[0].name.substring(files[0].name.lastIndexOf('.'));
          if (validExts.indexOf(fname) < 0) {
            alertify.error("Fichier invalid, les formats acceptés sont: "+
                     validExts.toString()) ;
            avatar=false ;
            return false;
          }

          var reader = new FileReader();
          reader.onload = function (e) {
                  $('#avatarImage').attr('src', e.target.result);
          }
          reader.readAsDataURL(files[0]);
          avFile=files[0];
          avatar=true ;
          $('#avatarImage').css("border-radius","0%") ;
        }

        vm.loadBac = function(){
          return $timeout(function() {

                $scope.bac_types =  $scope.bac_types  || [
                  { name: 'Sciences Math A' },
                  { name: 'Sciences Math B' },
                  { name: 'Science Physique et Chimie' },
                  { name: 'Sciences de la Vie et de la Terre' },
                  {name: 'Sciences et Technologies Électriques'},
                  {name:'Sciences et Technologies Mécaniques'},
                  {name:'Autre'}
                ];

          }, 650);
        } ;
         vm.loadBac2 = function(){
          return $timeout(function() {
                $scope.bac2_types =  $scope.bac2_types  || [
                  { name: 'DEUG' },
                  { name: 'DEUST' },
                  { name: 'DUT' },
                   {name: 'Autre'}
                ];

          }, 650);
        } ;
         vm.loadBac2Uni = function(){
          return $timeout(function() {
                $scope.bac2Uni_types =  $scope.bac2Uni_types  || [
                  { name: 'Université Ibn Zohr' },
                  { name: 'Université Hassan II' },
                  { name: 'Université Hassan I' },
                  { name: 'Université Chouaib Doukkali' },
                  {name: 'Université Cadi Ayyad'},
                  {name: 'Université Sultan Moulay Sliman'},
                  {name: 'Université Moulay-Ismail'},
                  {name:'Université Sidi Mohammed Ben Abdellah'},
                  {name:'Université Ibn-Tofail'},
                  {name:'Université Mohammed Ier'},
                  {name:'Université Abdelmalek Essaadi'},
                  {name:'Université Mohammed V'},
                  {name:'Autre'}
                ];

          }, 650);
        } ;
        vm.chargeBac2Uni=function(){
          $scope.bac2Estabs=null ;
          if(vm.bac2UniType){
            $("#bac2_establishment").show() ;
            if(vm.bac2UniType=='Université Ibn Zohr'){
                 $scope.bac2Estabs =  $scope.bac2Estabs  || [
                  { name: 'Ecole Superieure de Technologie Agadir' },              
                  { name: 'Faculte des Sciences Agadir' },              
                  { name: 'Faculte Polydisciplinaire Ouarzazate'},
                  { name: 'Faculté Polydisciplinaire Taroudannt' },
                  { name: 'École Supérieure de Technologie Guelmim'},
                  { name: 'Autre' }
                ];
            }
            else if(vm.bac2UniType=='Université Mohammed V'){
                 $scope.bac2Estabs =  $scope.bac2Estabs  || [
                  {name: 'Faculté des Sciences Rabat' },
                  { name: 'École Supérieure de Technologie Salé'},
                  { name: 'Autre' }
                ];
            }
           else if(vm.bac2UniType=='Université Hassan I'){
                 $scope.bac2Estabs =  $scope.bac2Estabs  || [
                     {name: 'Faculté des Sciences et Techniques Settat'},
                     {name: 'Faculté Polydisciplinaire Khouribga'},
                     { name: 'École Supérieure de Technologie Berrechid'},
                     {name: 'Autre' } 
                ];
            }
            else if(vm.bac2UniType=='Université Hassan II'){
                 $scope.bac2Estabs =  $scope.bac2Estabs  || [
                     {name: 'Faculte de Sciences - Ain Chock' },
                     {name: 'École Supérieure de Technologie Casablanca' },
                     {name: 'Faculté des Sciences Ben M’Sik' },
                     {name: 'Faculté des Sciences et Techniques Mohammedia'},
                     {name: 'Autre' } 
                ];
            }
            else if(vm.bac2UniType=='Université Chouaib Doukkali'){
                 $scope.bac2Estabs =  $scope.bac2Estabs  || [
                     { name: 'Faculté des Sciences El Jadida' },                 
                     { name: 'Faculté Polydisciplinaire El Jadida' },
                     {name: 'Autre' } 
                ];
            }
            else if(vm.bac2UniType=='Université Cadi Ayyad'){
                 $scope.bac2Estabs =  $scope.bac2Estabs  || [
                    { name: 'Faculté des Sciences - Semlalia' },
                    { name: 'Faculté des Sciences et Techniques Marrakech' },
                    {name: 'Autre' } 
                ];
            }
            else if(vm.bac2UniType=='Université Sultan Moulay Slimane'){
                 $scope.bac2Estabs =  $scope.bac2Estabs  || [
                    { name: "Faculté des Sciences et Techniques Béni Mellal"},
                    { name: "Faculté Polydisciplinaire Béni Mellal"},
                    { name: "École Supérieure de Technologie Béni Mellal"},
                    {name: 'Autre' } 
                ];
            }
            else if(vm.bac2UniType=='Université Moulay-Ismail'){
                 $scope.bac2Estabs =  $scope.bac2Estabs  || [
                    { name: 'Faculté Polydisciplinaire Errachidia' },
                    { name: 'Faculté des Sciences Meknès' },
                    { name: 'École Supérieure de Technologie Khénifra' },
                    { name: 'École Supérieure de Technologie Meknès' },
                    { name: 'Faculté des Sciences et Techniques Errachidia' }, 
                    {name: 'Autre' } 
                ];
            }
            else if(vm.bac2UniType=='Université Sidi Mohammed Ben Abdellah'){
                 $scope.bac2Estabs =  $scope.bac2Estabs  || [
                   { name: 'Faculté des Sciences et Techniques Fès' },
                   { name: 'École Supérieure de Technologie Fès' },
                   { name: 'Faculté des Sciences Fès' },
                   { name: 'Faculté Polydisciplinaire Taza' },                   
                   {name: 'Autre' } 
                ];
            }
            else if(vm.bac2UniType=='Université Ibn-Tofail'){
                 $scope.bac2Estabs =  $scope.bac2Estabs  || [
                    { name: 'Faculté des Sciences Kénitra' },
                    {name: 'Autre' }
                ]; 
            }
            else if(vm.bac2UniType=='Université Mohammed Ier'){
                 $scope.bac2Estabs =  $scope.bac2Estabs  || [
                     { name: 'Faculté des Sciences Oujda' },
                     { name: "École Supérieure de Technologie Oujda"},
                     { name: 'Faculté Polydisciplinaire Nador '},
                     { name: "Faculté des Sciences et Techniques Alhoceima"},
                     {name: 'Autre' }
                ];
            }
            else if(vm.bac2UniType=='Université Abdelmalek Essaadi'){
               $scope.bac2Estabs =  $scope.bac2Estabs  || [
                     { name: 'Faculté Polydisciplinaire Larache' },
                     { name: 'Faculté des Sciences et Techniques Tanger' },
                     { name: 'Faculté Polydisciplinaire Tétouan' },
                     { name: 'Faculté des Sciences Tétouan' },
                     {name: 'Autre' } 
                ];
            }
            else  if(vm.bac2UniType=="Autre"){
                $("#bac2UniType").empty() ;
                $("#bac2UniType").append("<md-input-container style='margin-left:20px' class='md-block'>"  +"<label>Bac 2 Université</label>"
                          +"<input md-autofocus class='lfields' required  ng-maxlength='50' ng-minlength='5' ng-model='inscrpt.bac2UniType' name='bac2UniType'>"
                          +"<div class='validation-messages' ng-messages='academic.bac2UniType.$error'>"
                                +"<div ng-message='required'>L'université est indispensable!</div>"
                                +"<div ng-message='minlength'>L'université  doit inclure un minimum de 5 lettres!</div>"
                                +"<div ng-message='maxlength'>L'université doit inclure un maximum de 40 lettres!</div>"
                          +"</div>"
                          +"</md-input-container>"
                    );
                   $("#bac2_establishment").empty() ;
                   $("#bac2_establishment").append("<md-input-container style='margin-left:20px' class='md-block'>"
                          +"<label>Bac 2 &#201;tablissement</label>"
                          +"<input class='lfields' required  ng-maxlength='50' ng-minlength='5' ng-model='inscrpt.bac2Estab' name='bac2Estab'>"
                          +"<div class='validation-messages' ng-messages='academic.bac2Estab.$error'>"
                                +"<div ng-message='required'>L'établissement est indispensable!</div>"
                                +"<div ng-message='minlength'>L'établissement doit inclure un minimum de 5 lettres!</div>"
                                +"<div ng-message='maxlength'>L'établissement doit inclure un maximum de 40 lettres!</div>"
                          +"</div>"
                          +"</md-input-container>"
                    );
                  $timeout(function(){
                    $compile($("#bac2UniType").contents())($scope) ;   
                    $compile($("#bac2_establishment").contents())($scope) ;   
                     vm.bac2Estab=""; vm.bac2UniType="";
                  },10) ; 
            }
            return false ;
          }
          $("#bac2_establishment").hide() ;
        }
        vm.chargeBac3Uni=function(){
          $scope.bac3Estabs=null ;

          if(vm.bac3UniType){
            $("#bac3_establishment").show() ;
             if(vm.bac3UniType=='Université Ibn Zohr'){
                 $scope.bac3Estabs =  $scope.bac3Estabs  || [            
                  { name: 'Faculte des Sciences Agadir' },              
                  { name: 'Faculte Polydisciplinaire Ouarzazate'},
                  { name: 'Faculté Polydisciplinaire Taroudannt' },
                  { name: 'Autre' }
                ];
            }
            else if(vm.bac3UniType=='Université Mohammed V'){
                 $scope.bac3Estabs =  $scope.bac3Estabs  || [
                      {name: 'Faculté des Sciences Rabat' },
                      { name: 'Autre' }
                ];
            }
             else if(vm.bac3UniType=='Université Hassan I'){
                 $scope.bac3Estabs =  $scope.bac3Estabs  || [
                     {name: 'Faculté des Sciences et Techniques Settat'},
                     {name: 'Faculté Polydisciplinaire Khouribga'},
                     {name: 'Autre' }
                ];
            }
            else if(vm.bac3UniType=='Université Hassan II'){
                 $scope.bac3Estabs =  $scope.bac3Estabs  || [
                     {name: 'Faculte de Sciences - Ain Chock' },
                     {name: 'Faculté des Sciences Ben M’Sik' },
                     {name: 'Faculté des Sciences et Techniques Mohammedia'},
                     {name: 'Autre' } 
                ];
            }
            else if(vm.bac3UniType=='Université Chouaib Doukkali'){
                 $scope.bac3Estabs =  $scope.bac3Estabs  || [
                     { name: 'Faculté des Sciences El Jadida' },                 
                     { name: 'Faculté Polydisciplinaire El Jadida' },
                     {name: 'Autre' } 
                ];
            }

            else if(vm.bac3UniType=='Université Cadi Ayyad'){
                 $scope.bac3Estabs =  $scope.bac3Estabs  || [
                    { name: 'Faculté des Sciences - Semlalia' },
                    { name: 'Faculté des Sciences et Techniques Marrakech' },
                    {name: 'Autre' } 
                ];
            }
            else if(vm.bac3UniType=='Université Sultan Moulay Slimane'){
                 $scope.bac3Estabs =  $scope.bac3Estabs  || [
                    { name: "Faculté des Sciences et Techniques Béni Mellal"},
                    { name: "Faculté Polydisciplinaire Béni Mellal"},
                    {name: 'Autre' }  
                ];
            }
            else if(vm.bac3UniType=='Université Moulay-Ismail'){
                 $scope.bac3Estabs =  $scope.bac3Estabs  || [
                    { name: 'Faculté Polydisciplinaire Errachidia' },
                    { name: 'Faculté des Sciences Meknès' },
                    { name: 'Faculté des Sciences et Techniques Errachidia' }, 
                    {name: 'Autre' } 
                ];
            }
            else if(vm.bac3UniType=='Université Sidi Mohammed Ben Abdellah'){
                 $scope.bac3Estabs =  $scope.bac3Estabs  || [
                   { name: 'Faculté des Sciences et Techniques Fès' },
                   { name: 'Faculté des Sciences Fès' },
                   { name: 'Faculté Polydisciplinaire Taza' },                   
                   {name: 'Autre' } 
                ];
            }  else if(vm.bac3UniType=='Université Ibn-Tofail'){
                 $scope.bac3Estabs =  $scope.bac3Estabs  || [
                    { name: 'Faculté des Sciences Kénitra' },
                    {name: 'Autre' }
                ]; 
            }
            else if(vm.bac3UniType=='Université Mohammed Ier'){
                 $scope.bac3Estabs =  $scope.bac3Estabs  || [
                     { name: 'Faculté des Sciences Oujda' },
                     { name: "École Supérieure de Technologie Oujda"},
                     { name: 'Faculté Polydisciplinaire Nador '},
                     { name: "Faculté des Sciences et Techniques Alhoceima"},
                     {name: 'Autre' }
                ];
            }
            else if(vm.bac3UniType=='Université Abdelmalek Essaadi'){
                 $scope.bac3Estabs =  $scope.bac3Estabs  || [
                     { name: 'Faculté Polydisciplinaire Larache' },
                     { name: 'Faculté des Sciences et Techniques Tanger' },
                     { name: 'Faculté Polydisciplinaire Tétouan' },
                     { name: 'Faculté des Sciences Tétouan' },
                     {name: 'Autre' } 
                ];
            }
            else  if(vm.bac3UniType=="Autre"){
                  $("#bac3UniType").empty() ;
                  $("#bac3UniType").append("<md-input-container class='md-block'>"
                          +"<label>Bac 2 université</label>"
                          +"<input md-autofocus class='lfields' required ng-maxlength='25' ng-minlength='5'  ng-model='inscrpt.bac3UniType' name='bac3UniType'>"
                          +"<div class='validation-messages' ng-messages='academic.bac3UniType.$error'>"
                                +"<div ng-message='required'>L'université est indispensable!</div>"
                                +"<div ng-message='minlength'>L'université  doit inclure un minimum de 5 lettres!</div>"
                                +"<div ng-message='maxlength'>L'université doit inclure un maximum de 50 lettres!</div>"
                          +"</div>"
                          +"</md-input-container>"
                    );
                  $("#bac3_establishment").empty() ;
                  $("#bac3_establishment").append("<md-input-container class='md-block'>"
                          +"<label>Bac +3 établissement</label>"
                          +"<input class='lfields' required  ng-maxlength='50' ng-minlength='5'  ng-model='inscrpt.bac3Estab' name='bac3Estab'>"
                          +"<div class='validation-messages' ng-messages='academic.bac3Estab.$error'>"
                                +"<div ng-message='required'>L'établissement est indispensable!</div>"
                                +"<div ng-message='minlength'>L'établissement doit inclure un minimum de 5 lettres!</div>"
                                +"<div ng-message='maxlength'>L'établissement doit inclure un maximum de 50 lettres!</div>"
                          +"</div>"
                          +"</md-input-container>"
                    );
                  $timeout(function(){
                    $compile($("#bac3UniType").contents())($scope) ;   
                    $compile($("#bac3_establishment").contents())($scope) ;   
                    vm.bac3UniType="";  vm.bac3Estab="";
                  },10) ; 
             }
            return false ;
          }
          $("#bac2_establishment").hide() ;
        }
        vm.loadBac3Type = function(){
          return $timeout(function() {

                $scope.bac3_types =  $scope.bac3_types  || [
                  { name: 'Licence Fondamentale'},
                  { name: 'Licence des Sciences et Techniques' },
                  { name: 'Licence Professionnelle' },
                  {name:'Autre'}
                ];

          }, 650);
        } ;

       vm.chargeBac2Estab=function(){
          if(vm.bac2Estab=="Autre"){
                  $("#bac2_establishment").empty() ;
                  $("#bac2_establishment").append("<md-input-container class='md-block'>"
                          +"<label>Bac +2 établissement</label>"
                          +"<input class='lfields' required  ng-maxlength='50' ng-minlength='5'  ng-model='inscrpt.bac2Estab' name='bac2Estab'>"
                          +"<div class='validation-messages' ng-messages='academic.bac2Estab.$error'>"
                                +"<div ng-message='required'>L'établissement est indispensable!</div>"
                                +"<div ng-message='minlength'>L'établissement doit inclure un minimum de 5 lettres!</div>"
                                +"<div ng-message='maxlength'>L'établissement doit inclure un maximum de 50 lettres!</div>"
                          +"</div>"
                          +"</md-input-container>"
                    );
                  $timeout(function(){
                    $compile($("#bac2_establishment").contents())($scope) ;   
                    vm.bac2Estab="";
                  },10) ; 
          }

        }
         vm.chargeBac3Estab=function(){
            if(vm.bac3Estab=="Autre"){
                    $("#bac3_establishment").empty() ;
                    $("#bac3_establishment").append("<md-input-container class='md-block'>"
                            +"<label>Bac +3 établissement</label>"
                            +"<input class='lfields' required  ng-maxlength='50' ng-minlength='5'  ng-model='inscrpt.bac3Estab' name='bac3Estab'>"
                            +"<div class='validation-messages' ng-messages='academic.bac3Estab.$error'>"
                                  +"<div ng-message='required'>L'établissement est indispensable!</div>"
                                  +"<div ng-message='minlength'>L'établissement doit inclure un minimum de 5 lettres!</div>"
                                  +"<div ng-message='maxlength'>L'établissement doit inclure un maximum de 50 lettres!</div>"
                            +"</div>"
                            +"</md-input-container>"
                      );
                    $timeout(function(){
                      $compile($("#bac3_establishment").contents())($scope) ;   
                       vm.bac3Estab="";
                    },10) ; 
            }

        }



        vm.cancelIns=function(){
          $mdDialog.cancel() ;
        }
    
         vm.validM=function(){
            if($(".mvfields").hasClass('ng-invalid')){
                  alertify.error('Requête invalide; veuillez revérifier les erreurs de chaque case!') ;
                  return false ;  
            }
             if(vm.gender==null){
                alertify.error("Veuillez ne pas oublier de citer votre sexe!") ;
                return false ;
            }
            if(vm.bdate==null){
                alertify.error("Veuillez ne pas oublier de citer votre date de naissance!") ;
                return false ;
            }
            $(".mfields").hide() ;  $("#modifyBtns").hide() ; $(".btns").show() ;    $(".fields").show() ;
            
            var year =vm.bdate.getFullYear() ;
            var month=vm.bdate.getMonth()+1 ;
            var day=vm.bdate.getDate() ;
            vm.candBDate=year+"-"+month+"-"+day ;
            if(vm.gender==1){
                vm.sex="Masculin" ;
            }
            else{
              if(vm.gender==0) vm.sex="Féminin";
            }
         }

        vm.modifyFname=function(){
            $(".btns").hide() ;  $(".fields").hide() ;
             $("#modifyBtns").show() ;
            $("#personalFields").prepend(                   
                        "<div class='mfields' id='fnameField'>"
                        +"<md-input-container style='width:80%;margin-left:10%' class='md-block'>"
                                +"<label>Prénom</label>"
                                +"<input md-autofocus class='mvfields' required ng-minlength='3' ng-maxlength='25' pattern='^[A-Za-z]*$' ng-model='inscrpt.first_name' name='first_name'>"
                                +"<div class='validation-messages' ng-messages='academic.first_name.$error'>"
                                   +"<div ng-message='required'>Votre prénom est indispensable!</div>"
                                   +"<div ng-message='minlength'>Votre prénom doit inclure un minimum de 3 lettres!</div>"
                                   +"<div ng-message='maxlength'>Votre prénom doit inclure un maximum de  25 lettres!</div>"
                                   +"<div ng-message='pattern'>Votre prénom doit seulement inclure des lettres!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#fnameField").contents())($scope) ;  
              vm.first_name="" ; 
            },100) ;  
        }
        vm.modifyLname=function(){
            $(".btns").hide() ;  $(".fields").hide() ;
             $("#modifyBtns").show() ;
            $("#personalFields").prepend(                   
                        "<div class='mfields' id='lnameField'>"
                        +"<md-input-container style='width:80%;margin-left:10%' class='md-block'>"
                                +"<label>Nom</label>"
                                +"<input md-autofocus class='mvfields' required ng-minlength='3' ng-maxlength='25' pattern='^[A-Za-z]*$'  ng-model='inscrpt.last_name' name='lastname'>"
                                +"<div class='validation-messages' ng-messages='academic.lastname.$error'>"
                                    +"<div ng-message='required'>Votre nom est indispensable!</div>"
                                    +"<div ng-message='minlength'>Votre nom doit inclure un minimum de 3 lettres!</div>"
                                    +"<div ng-message='maxlength'>Votre nom doit inclure un maximum de  25 lettres!</div>"
                                    +"<div ng-message='pattern'>Votre nom doit seulement inclure des lettres!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#lnameField").contents())($scope) ; 
              vm.last_name="" ;           
            },100) ;  
        }
        vm.modifyCin=function(){
            $(".btns").hide() ;  $(".fields").hide() ;
             $("#modifyBtns").show() ;
            $("#personalFields").prepend(                   
                        "<div class='mfields' id='cinField'>"
                        +"<md-input-container style='width:80%;margin-left:10%' class='md-block'>"
                                +"<label>CIN</label>"
                                +"<input class='mvfields' md-autofocus  required  ng-minlength='4' ng-maxlength ='20' pattern='^[A-Za-z 0-9]*$' ng-model='inscrpt.cin' name='cin'>"
                                +"<div class='validation-messages' ng-messages='academic.cin.$error'>"
                                   +"<div ng-message='required'>Votre cin est indispensable!</div>"
                                   +"<div ng-message='pattern'>Votre cin ne doit contenir que des lettres et des chiffres!</div>"
                                   +"<div ng-message='minlength'>Votre cin doit inclure un minimum de 4 caractères!</div>"
                                   +"<div ng-message='maxlength'>Votre cin doit inclure un maximum de  20 caractères!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#cinField").contents())($scope) ;
              vm.cin="" ;            
            },100) ;  
        }
        vm.modifyCne=function(){
            $(".btns").hide() ;  $(".fields").hide() ;
             $("#modifyBtns").show() ;
            $("#personalFields").prepend(                   
                        "<div class='mfields' id='cneField'>"
                        +"<md-input-container style='width:80%;margin-left:10%' class='md-block'>"
                                +"<label>CNE</label>"
                                +"<input type='number' md-autofocus  class='mvfields' required  ng-maxlength='10' ng-minlength ='10' ng-model='inscrpt.cne' name='cne'>"
                                +"<div class='validation-messages' ng-messages='academic.cne.$error'>"
                                     +"<div ng-message='required'>Votre cne est indispensable!</div>"
                                     +"<div ng-message='number'>Votre cne ne doit contenir que des chiffres!</div>"
                                     +"<div ng-message='minlength'>Votre cne doit contenir exactement 10 chiffres!</div>"
                                     +"<div ng-message='maxlength'>Votre cne doit contenir exactement 10 chiffres!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#cneField").contents())($scope) ; 
              vm.cne="" ;           
            },100) ;  
        }
         vm.modifyEmail=function(){
            $(".btns").hide() ;  $(".fields").hide() ;
             $("#modifyBtns").show() ;
            $("#personalFields").prepend(                   
                        "<div class='mfields' id='emailField'>"
                        +"<md-input-container style='width:80%;margin-left:10%' class='md-block'>"
                                +"<label>Email</label>"
                                +"<input md-autofocus class='mvfields' required  type='email' ng-model='inscrpt.email' name='email'>"
                                +"<div class='validation-messages' ng-messages='academic.email.$error'>"
                                   +"<div ng-message='required'>Votre email est indispensable!</div>"
                                   +"<div ng-message='email'>Cette adresse n'est pas valide!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#emailField").contents())($scope) ;  
              vm.email="" ;          
            },100) ;  
        }
         vm.modifyBDate=function(){
            $(".btns").hide() ;  $(".fields").hide() ;
            $("#modifyBtns").show() ;
            $("#personalFields").prepend(                   
                        "<div class='mfields' id='bdateField'>"
                          +"<md-datepicker name='birthDate' style='margin-top: 15px'  md-placeholder='Né(e) le' ng-model='inscrpt.bdate'>"
                          +"</md-datepicker>"
                       +"</div>") ;              
            setTimeout(function(){
              $compile($("#bdateField").contents())($scope) ;           
            },100) ;  
        }
        vm.modifyGender=function(){
            $(".btns").hide() ;  $(".fields").hide() ;
            $("#modifyBtns").show() ;
            $("#personalFields").prepend(                   
                        "<div class='mfields' style='padding-left: 10%; padding-top: 5%; padding-bottom: 5%;' id='gField'>"
                         +"<md-radio-group  layout layout-align='row' ng-model='inscrpt.gender'>"
                          +"<md-radio-button value='1' class='md-primary'>Masculin</md-radio-button>"
                          +"<md-radio-button value='0'>Féminin</md-radio-button>"
                         +"</md-radio-group>"
                       +"</div>") ;              
            setTimeout(function(){
              $compile($("#gField").contents())($scope) ;           
            },100) ; 
        }
        vm.validsM=function(){
           if($(".mvfields").hasClass('ng-invalid')){
                  alertify.error('Requête invalide; veuillez revérifier les erreurs de chaque case!') ;
                  return false ;  
            }
            if(vm.country==null){
                alertify.error("Veuillez ne pas oublier de citer votre pays!") ;
                return false ;
            }
            if(vm.city==null){
                alertify.error("Veuillez ne pas oublier de citer votre ville!") ;
                return false ;
            }
            vm.number = $("#phoneField").intlTelInput("getNumber");
            var isValid = $("#phoneField").intlTelInput("isValidNumber");
            if(!isValid){
                alertify.error("Numéro du Fix invalide, veuillez bien respecter le format de l'exemple!") ;
                return false ;
            }
            vm.gsm = $("#gsmField").intlTelInput("getNumber");
            var gIsValid = $("#gsmField").intlTelInput("isValidNumber");
            if(!gIsValid){
                alertify.error("Numéro du GSM invalide, veuillez bien respecter le format de l'exemple!") ;
                return false ;
            }

            $(".mfields").hide() ;  $("#modifyBtns").hide() ; $(".btns").show() ;    $(".fields").show() ;
            $("#secondAcademic").hide() ; $(".secondFields").show() ;
          
         }
        vm.modifyPhone=function(){
            $(".btns").hide() ;  $(".fields").hide() ; $(".secondFields").hide() ;
            $("#secondAcademic").prepend(                   
                        "<div class='mfields' style='padding-left: 20%; padding-top: 5%; padding-bottom: 5%;' id='homeField'>"
                          +"<span style='padding-right:29px; font-weight: 600'>Fix</span>"
                          +"<input type='tel' id='phoneField' name='phoneField' required ng-model='inscrpt.phoneNumber' intl-tel-input>"
                       +"</div>") ; 
            setTimeout(function(){
              $compile($("#homeField").contents())($scope) ;   
               $("#secondAcademic").show()        
            },100) ;             
          
        }   
        vm.modifyGSM=function(){
            $(".btns").hide() ;  $(".fields").hide() ; $(".secondFields").hide() ;
            $("#secondAcademic").prepend(                   
                        "<div class='mfields' style='padding-left: 20%; padding-top: 5%; padding-bottom: 5%;' id='pField'>"
                          +"<span style='padding-right:29px; font-weight: 600'>GSM </span>"
                          +"<input type='tel' id='gsmField' name='gsmField' required ng-model='inscrpt.gsm' intl-tel-input>"
                       +"</div>") ; 
            setTimeout(function(){
              $compile($("#pField").contents())($scope) ;   
               $("#secondAcademic").show()        
            },100) ;             
          
        }
        vm.modifyCountry=function(){
            $(".btns").hide() ;  $(".fields").hide() ; $(".secondFields").hide() ;
            $("#secondAcademic").prepend(                   
                        "<div class='mfields' style='padding-left: 20%; padding-top: 2%; padding-bottom: 5%;' id='countryField'>"
                          +"<country-state-select state-label='Ville' country='inscrpt.country' state='inscrpt.city'></country-state-select>"
                       +"</div>") ; 
            setTimeout(function(){
              $compile($("#countryField").contents())($scope) ;   
               $("#secondAcademic").show()  ;       
            },100) ;             
          
        }
        vm.modifyCity=function(){
            $(".btns").hide() ;  $(".fields").hide() ; $(".secondFields").hide() ;
            $("#secondAcademic").prepend(                   
                        "<div class='mfields' style='padding-left: 20%; padding-top: 2%; padding-bottom: 5%;' id='countryField'>"
                          +"<country-state-select state-label='Ville' country='inscrpt.country' state='inscrpt.city'></country-state-select>"
                       +"</div>") ; 
            setTimeout(function(){
              $compile($("#countryField").contents())($scope) ;   
               $("#secondAcademic").show()        
            },100) ;             
          
        }
        vm.modifyAddress=function(){
            $(".btns").hide() ;  $(".fields").hide() ; $(".secondFields").hide() ;
            $("#secondAcademic").prepend(                   
                        "<div class='mfields' style='padding-left: 20%; padding-top: 2%; padding-bottom: 5%;' id='addressField'>"                     
                          +" <md-input-container class='md-block' flex-gt-sm>"
                          + "<label>Adresse</label>"
                          + "<textarea class='mvfields' ng-model='inscrpt.address' required ng-minlength='25' ng-maxlength='50' name='address' md-maxlength='50' rows='5' md-select-on-focus></textarea>"
                          + "<div class='validation-messages'  ng-messages='academic.address.$error'>"
                                    +"<div ng-message='required'>Votre adresse est indispensable!</div>"
                                    +"<div ng-message='minlength'>Votre adresse doit contenir un minimum de  25 caractères!</div>"
                                    +"<div ng-message='maxlength'>Votre adresse doit contenir un maximum de 50 caractères!</div>"
                          +"</md-input-container>"
                       +"</div>") ; 
            setTimeout(function(){
              $compile($("#addressField").contents())($scope) ;   
               $("#secondAcademic").show() ;
               vm.address="" ;        
            },100) ;             
          
        }
        vm.professional=function(){
              if(vm.bdate==null){
                alertify.error("Veuillez ne pas oublier de citer votre date de naissance!") ;
                return false ;
              }
               if(vm.country==null){
                alertify.error("Veuillez ne pas oublier de citer votre pays!") ;
                return false ;
               }
              if(vm.city==null){
                  alertify.error("Veuillez ne pas oublier de citer votre ville!") ;
                  return false ;
              }
              vm.number=$("#phoneField").intlTelInput("getNumber") ;
              var isValid = $("#phoneField").intlTelInput("isValidNumber");
              if(!isValid){
                alertify.error("Numéro du Fix invalide, veuillez bien respecter le format de l'exemple!") ;
                  return false ;
              }
              vm.gsm=$("#gsmField").intlTelInput("getNumber") ;
              var gIsValid = $("#gsmField").intlTelInput("isValidNumber");
              if(!gIsValid){
                alertify.error("Numéro du GSM invalide, veuillez bien respecter le format de l'exemple!") ;
                return false ;
              }
              if(vm.gender==null){
                alertify.error("Veuillez ne pas oublier de citer votre sexe!") ;
                  return false ;
              }
              if(vm.bdate==null){
                alertify.error("Veuillez ne pas oublier de citer votre date de naissance!") ;
                  return false ;
              }

             if($(".fields").hasClass('ng-invalid')){
                  alertify.error('Requête invalide; veuillez revérifier les erreurs de chaque case!') ;
                    return false ;  
              }

              $('#avatarImage').attr('src','img/unknown_student.png');
              $('#dialogContent_pdialog').css({'height':'100%','overflow':'hidden'}) ;
              $timeout(function(){
                $("#personalView").mCustomScrollbar({theme:"minimal-dark"});
              },2000) ;
             
              var year =vm.bdate.getFullYear() ;
              var month=vm.bdate.getMonth()+1 ;
              var day=vm.bdate.getDate() ;
              vm.candBDate=year+"-"+month+"-"+day ;
              if(vm.gender==1){
                vm.sex="Male" ;
                vm.dateSpan="Né le :" ;
              }
              else{
                if(vm.gender==0) { vm.sex="Female" ;  vm.dateSpan="Née le :";}
              }
            $("#personal").hide() ;
            $("#pdialog").css({"height":"100%","width":"100%", "min-height":"100%","background-color":"inherit","max-width": "100%"}) ;
            
            $("#professional").show() ;

        }

    }
   
    function AuthController($auth, $compile, $scope, $state, $interval, $mdDialog,$timeout, $http) {
        var vm = this;

        vm.forgotten=function(){
          $("#sign").children().hide() ;
          $("#sign").append(
            "<div id='forgotttenField'>"+
                "<p style='font-weight:600' class='w3-text-pink'>Voulez citer votre email pour recevoir vos coordonées : (N'oubliez pas de fouiller vos spams également)</p>"+ 
                "<md-input-container  class='md-block' style='width:400px' flex-gt-sm>"+
                            "<label>Email</label>"+
                            "<input  md-autofocus class='rfields' required  type='email' name='email' ng-model='auth.email'>"+
                            "<div class='validation-messages'  ng-messages='sign.email.$error'>"+
                                  "<div ng-message='required'>L'email est indispensable!</div>"+
                                  "<div ng-message='email'>Cette adresse est invalide!</div>"+
                                  "<div ng-message='server'>{{auth.mailerr}}</div>"+
                            "</div>"+
                "</md-input-container>"+
                "<div layout='row'>"
                  +"<md-button ng-click='auth.cancelMail()' class='w3-pink w3-hover-red'>Annuler</md-button>"+
                  "<md-button ng-click='auth.sendMail()' class='w3-blue w3-hover-blue-grey'>Envoyer</md-button>"+
                "</div>"+
            "</div>"
          ) ;

           $timeout(function(){
            $compile($("#forgotttenField").contents())($scope) ;  
            vm.email='' ;
          },100) ;  
        }

        vm.sendMail=function(){
              if($(".rfields").hasClass('ng-invalid')){
                  alertify.error('Requête invalide; veuillez revérifier votre email!') ;
                    return false ;  
              }

            var edata={email:vm.email} ;
            $http.post('/email',edata).then(function successCallback(response) {
                          alertify.notify('Dans quelques instants vous allez recevoir un token pour modifier votre mot de passe.', 'message', 10) ; 
                          $("#forgotttenField").remove() ;
                          $("#sign").append(
                            "<div id='forgotttenField'>"+
                                "<p style='font-weight:600' class='w3-text-pink'>Veuillez citer le token que vous venez de recevoir dans votre boite avec votre nouveau mot de passe :</p>"+ 
                                "<md-input-container  class='md-block' style='width:400px' flex-gt-sm>"+
                                            "<label>Token</label>"+
                                            "<input  md-autofocus class='rfields' required  name='token' ng-model='auth.token'>"+
                                            "<div class='validation-messages'  ng-messages='sign.token.$error'>"+
                                                  "<div ng-message='required'>L'email est indispensable!</div>"+
                                                  "<div ng-message='server'>{{auth.tokenerr}}</div>"+
                                            "</div>"+
                                "</md-input-container>"+
                                  "<md-input-container  class='md-block' style='width:400px' flex-gt-sm>"+
                                            "<label>Mot de passe</label>"+
                                            "<input type='password'  md-autofocus class='rfields' required ng-minlength='8' ng-maxlength='30'  name='pass1' ng-model='auth.pass1'>"+
                                            "<div class='validation-messages'  ng-messages='sign.pass1.$error'>"
                                                   +"<div ng-message='required'>Le mot de passe est indispensable!</div>"
                                                   +"<div ng-message='minlength'>Le mot de passe doit contenir au moins 8 caractères!!</div>"
                                                   +"<div ng-message='maxlength'>Le mot de passe doit contenir jusqu'à 30 caractères!!</div>"+
                                                  "<div ng-message='server'>{{auth.pass1err}}</div>"+
                                            "</div>"+
                                "</md-input-container>"+
                                  "<md-input-container  class='md-block' style='width:400px' flex-gt-sm>"+
                                            "<label>Confirmer Mot de passe</label>"+
                                            "<input type='password' md-autofocus class='rfields' required ng-minlength='8' ng-maxlength='30'  name='pass2' ng-model='auth.pass2'>"+
                                            "<div class='validation-messages'  ng-messages='sign.pass2.$error'>"+
                                                   "<div ng-message='required'>Le mot de passe est indispensable!</div>"
                                                   +"<div ng-message='minlength'>Le mot de passe doit contenir au moins 8 caractères!!</div>"
                                                   +"<div ng-message='maxlength'>Le mot de passe doit contenir jusqu'à 30 caractères!!</div>"+
                                                  "<div ng-message='server'>{{auth.pass2err}}</div>"+
                                            "</div>"+
                                "</md-input-container>"+
                                "<div layout='row'>"
                                  +"<md-button ng-click='auth.cancelMail()' class='w3-pink w3-hover-red'>Annuler</md-button>"+
                                  "<md-button ng-click='auth.resetPassword()' class='w3-blue w3-hover-blue-grey'>Valider</md-button>"+
                                "</div>"+
                            "</div>"
                          ) ;

                          $timeout(function(){
                              $compile($("#forgotttenField").contents())($scope) ;  
                              vm.token='' ;
                              vm.pass1='' ;
                              vm.pass2='' ;
                          },300) ;  

                      }, function errorCallback(response) {
                         var errs=response.data.errors ;
                          if(errs.email){
                            alertify.error(errs.email,10); 
                            $scope.sign['email'].$setValidity('server', false);
                            vm.mailerr=errs.email; 
                            $timeout(function() {
                                    $scope.sign['email'].$setValidity('server', true);
                             }, 4000);
                          } 
                  });

        }

        vm.resetPassword=function(){
            if($(".rfields").hasClass('ng-invalid')){
                alertify.error('Requête invalide; veuillez revérifier le token!') ;
                    return false ;  
            }

            if(vm.pass1!=vm.pass2){
                alertify.error('Les deux mots de passes ne sont pas similaires!') ;
                $scope.sign['pass1'].$setValidity('server', false);
                $scope.sign['pass2'].$setValidity('server', false);
                vm.pass1err='Mot de passes non similaires!' ;
                vm.pass2err='Mot de passes non similaires!';

                $timeout(function() {
                      $scope.sign['pass1'].$setValidity('server', true);
                      $scope.sign['pass2'].$setValidity('server', true);
                }, 4000);

               return false ;
            }

            var edata={email:vm.email, token:vm.token, password: vm.pass1, password_confirmation:vm.pass2} ;

            $http.post('/reset',edata).then(function successCallback(response) {
                          alertify.notify('Votre mot de passe vient de changer, vous pouvez maintenant réssayer de vous connecter.', 'message', 10) ; 
                          $("#forgotttenField").remove() ;
                           $("#sign").children().show() ;

                      }, function errorCallback(response) {
                          var errs=response.data ;
                          console.log(response) ;
                          if(errs.token){
                            alertify.error(errs.token[0],10); 
                            $scope.sign['token'].$setValidity('server', false);
                            vm.tokenerr=errs.token[0]; 
                            $timeout(function() {
                                    $scope.sign['token'].$setValidity('server', true);
                             }, 4000);
                          } 
                          if(errs.password){
                            alertify.error(errs.password[0],10); 
                            $scope.sign['pass1'].$setValidity('server', false);
                            vm.pass1err=errs.password[0]; 
                            $timeout(function() {
                                    $scope.sign['pass1'].$setValidity('server', true);
                             }, 4000);
                          } 
                          if(errs.itoken){
                            alertify.error(errs.itoken,10); 
                            $scope.sign['token'].$setValidity('server', false);
                            vm.tokenerr=errs.itoken ; 
                            $timeout(function() {
                                    $scope.sign['token'].$setValidity('server', true);
                             }, 4000);
                          } 
                           if(errs.ipass){
                            alertify.error(errs.ipass,10); 
                            $scope.sign['pass1'].$setValidity('server', false);
                            vm.pass1err=errs.ipass ; 
                            $timeout(function() {
                                    $scope.sign['pass1'].$setValidity('server', true);
                             }, 4000);
                          } 
                           if(errs.iuser){
                            alertify.error(errs.iuser,10); 
                          } 
                         
                  });


        }



        var cancelMail=vm.cancelMail=function(){
          $("#forgotttenField").remove() ;
          $("#sign").children().show() ;
        }
        
        vm.login = function() {
           if($(".fields").hasClass('ng-invalid')){
                  alertify.error('Invalid Request, please verify your credentials') ;
                  return false ;  
            }
            var credentials = {
                  username: vm.username,
                  password: vm.password
              }
              $auth.login(credentials).then(function(data) {
                 $mdDialog.cancel() ;
                    $http.get('authenticate').then(function successCallback(response) {
                        var udata=response.data ;
                        var user=udata.user ;
                        localStorage.setItem('userId', user.id);
                        localStorage.setItem('userFlag', user.flag);
                        $state.go(user.flag);
                        alertify.notify('Vous venez de vous connecter à votre espace avec succès', 'message', 10) ; 
                      }, function errorCallback(response) {
                            console.log(response) ;
                      });
                }).catch(function(response) {
                        var issue=response.data ;
                        if(issue.error){
                          alertify.error(issue.error,10); 
                          return false;
                        }
                        var errs=response.data.errors ;
                        if(errs.username){
                          alertify.error(errs.username[0],10); 
                          $scope.sign['username'].$setValidity('server', false);
                          vm.usrerr=errs.username[0]; 
                            $timeout(function() {
                                  $scope.sign['username'].$setValidity('server', true);
                              }, 4000);
                        } 
                        else if(errs.password ) {
                          alertify.error(errs.password[0],10); 
                          $scope.sign['password'].$setValidity('server', false);
                          vm.passerr=errs.password[0]; 
                            $timeout(function() {
                                  $scope.sign['password'].$setValidity('server', true);
                              }, 4000);
                        }
                });

           }
    }

})();


