(function() {

    'use strict';

    angular
        .module('mbiscApp')
        .controller('CandidateController', CandidateController);


    function CandidateController($auth,  $mdToast, $state, $scope, $compile, $mdDialog,$interval, $timeout, $http, FileUploader) {

        var vm = this; 
        var current ;
        var userId =localStorage.getItem('userId');
        var mdate=false ;
        var mgender=false ;
        var settedUni=false; 
        var mCoordinates=false ;

        vm.disabledBtns=false ;


       $scope.candidateTemplate="../template/candidateCard.html" ;

        vm.logout = function(e) {
          $mdToast.cancel() ;
        	e.preventDefault() ;
       		$auth.logout().then(function() {  
  		        localStorage.removeItem('userFlag');
              localStorage.removeItem('userId');
  		        $state.go('home') ;
              alertify.notify("Vous venez de vous déconnecter avec succés.", 'message', 10) ;
  		        return false ;
  	    	  });
  	 	 };

      vm.modifyGender=function(){
            $("#gender").children().hide() ;
            vm.disabledBtns=true ;
            $mdToast.show(
                $mdToast.modify()
            );
            mgender=true ;
            $("#gender").prepend(                   
                        "<div id='genderField' style='padding-top: 3%;padding-bottom: 5%;'>"
                             +"<md-radio-group  layout layout-align='row' ng-model='cd.gender'>"
                                +"<md-radio-button value='1' class='md-primary'>Masculin</md-radio-button>"
                                +"<md-radio-button value='0'>Féminin</md-radio-button>"
                             +"</md-radio-group>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#genderField").contents())($scope) ;  
              $compile($("#modifyT").contents())($scope) ;  
              vm.gender=null ; 
              current='gender' ;
            },100) ;  

       }
        vm.modifyCandidateFName=function(){
            $("#fname").children().hide() ;
            vm.disabledBtns=true ;
            
            $mdToast.show(
                $mdToast.modify()
            );
            $("#fname").prepend(                   
                        "<div id='fnameField'>"
                        +"<md-input-container style='width:80%; height:5%' class='md-block'>"
                                +"<label>Prénom</label>"
                                +"<input class='fields' md-autofocus required ng-minlength='3' ng-maxlength='25' pattern='^[A-Za-z]*$' ng-model='cd.fname' name='first_name'>"
                                +"<div class='validation-messages' ng-messages='cd.cform.first_name.$error'>"
                                   +"<div ng-message='required'>Votre prénom est indispensable!</div>"
                                   +"<div ng-message='minlength'>Votre prénom doit inclure un minimum de 3 lettres!</div>"
                                   +"<div ng-message='maxlength'>Votre prénom doit inclure un maximum de  25 lettres!</div>"
                                   +"<div ng-message='pattern'>Votre prénom doit seulement inclure des lettres!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#fnameField").contents())($scope) ;  
              $compile($("#modifyT").contents())($scope) ;  
              vm.fname="" ; 
             current='fname' ;
            },100) ;  

       }

        vm.modifyCandidateLName=function(){
            $("#lname").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#lname").prepend(                   
                        "<div id='lnameField'>"
                        +"<md-input-container style='width:80%;height:5%' class='md-block'>"
                                +"<label>Nom</label>"
                                +"<input class='fields' md-autofocus required ng-minlength='3' ng-maxlength='25' pattern='^[A-Za-z]*$' ng-model='cd.lname' name='first_name'>"
                                +"<div class='validation-messages' ng-messages='cd.cform.first_name.$error'>"
                                   +"<div ng-message='required'>Votre nom est indispensable!</div>"
                                   +"<div ng-message='minlength'>Votre nom doit inclure un minimum de 3 lettres!</div>"
                                   +"<div ng-message='maxlength'>Votre nom doit inclure un maximum de  25 lettres!</div>"
                                   +"<div ng-message='pattern'>Votre nom doit seulement inclure des lettres!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#lnameField").contents())($scope) ;  
              $compile($("#modifyT").contents())($scope) ;  
              vm.lname="" ; 
            },100) ;  
           current='lname' ;
       }
       vm.modifyCandidateCin=function(){
            $("#cin").children().hide() ;
              $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#cin").prepend(                   
                        "<div id='cinField'>"
                        +"<md-input-container style='width:80%;height:5%' class='md-block'>"
                                +"<label>Cin</label>"
                                +"<input class='fields' md-autofocus required ng-minlength='3' ng-maxlength='25' pattern='^[A-Za-z0-9]*$' ng-model='cd.cin' name='last_name'>"
                                +"<div class='validation-messages' ng-messages='cd.cform.last_name.$error'>"
                                   +"<div ng-message='required'>Votre cin est indispensable!</div>"
                                   +"<div ng-message='minlength'>Votre cin doit inclure un minimum de 4 caractères!</div>"
                                   +"<div ng-message='maxlength'>Votre cin doit inclure un maximum de  20 caractères!</div>"
                                   +"<div ng-message='pattern'>Votre cin ne doit contenir que des lettres et des chiffres!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#cinField").contents())($scope) ;  
              vm.cin="" ; 
            },100) ;  
           current='cin' ;
       }

       
        vm.modifyCandidateCne=function(){
            $("#cne").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#cne").prepend(                   
                        "<div id='cneField'>"
                        +"<md-input-container style='width:80%; height:5%' class='md-block'>"
                                +"<label>Cne</label>"
                                +"<input class='fields' md-autofocus required ng-minlength='10' ng-maxlength='10' ng-model='cd.cne' name='cne'>"
                                +"<div class='validation-messages' ng-messages='cd.cform.cne.$error'>"
                                   +"<div ng-message='required'>Votre cne est indispensable!</div>"
                                   +"<div ng-message='minlength'>Votre cne doit contenir exactement 10 chiffres!</div>"
                                   +"<div ng-message='maxlength'>Votre cne doit contenir exactement 10 chiffres!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#cneField").contents())($scope) ;  
              vm.cne="" ; 
            },100) ;  
           current='cne' ;
       }

         vm.modifyBac2Option=function(){
            $("#bac2Option").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bac2Option").prepend(                   
                        "<div id='bac2OptionField'>"
                        +"<md-input-container class='md-block'>"
                                +"<label>Bac 2 Option</label>"
                                +"<input class='fields' md-autofocus required ng-minlength='5' ng-maxlength='50' ng-model='cd.bac2Option' name='bac2Option'>"
                                +"<div class='validation-messages' ng-messages='cd.cform.bac2Option.$error'>"
                                   +"<div ng-message='required'>L'option est indispensable!</div>"
                                   +"<div ng-message='minlength'>La longueur minimale correspond à 5 caractères!</div>"
                                   +"<div ng-message='maxlength'>La longueur maximale correspond à 50 caractères!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bac2OptionField").contents())($scope) ;  
              vm.bac2Option="" ; 
            },100) ;  
           current='bac2Option' ;
       }
        vm.modifyBac3Option=function(){
            $("#bac3Option").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bac3Option").prepend(                   
                        "<div id='bac3OptionField' style=' margin-top: -10%; height: 1%;display: inline-block;margin-left: 10%;'>"
                        +"<md-input-container class='md-block'>"
                                +"<label>Bac 3 Option</label>"
                                +"<input class='fields' md-autofocus required ng-minlength='5' ng-maxlength='50' ng-model='cd.bac3Option' name='bac3Option'>"
                                +"<div class='validation-messages' ng-messages='cd.cform.bac3Option.$error'>"
                                   +"<div ng-message='required'>L'option est indispensable!</div>"
                                   +"<div ng-message='minlength'>La longueur minimale correspond à 5 caractères!</div>"
                                   +"<div ng-message='maxlength'>La longueur maximale correspond à 50 caractères!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bac3OptionField").contents())($scope) ;  
              vm.bac3Option="" ; 
            },100) ;  
           current='bac3Option' ;
       }
        vm.modifyBacNote=function(){
            $("#bacNote").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bacNote").prepend(                   
                        "<div id='bacNoteField'>"
                        +"<md-input-container style='width:80%; height: 8%;' class='md-block'>"
                                +"<label>bac note</label>"
                                +"<input class='fields' required type='number'  step='0.01' md-autofocusrequired min='10' max='20' ng-model='cd.bacNote' name='bacNote'>"
                                +"<div class='validation-messages' ng-messages='cd.cform.bacNote.$error'>"
                                   +"<div ng-message='required'>La note de votre bac est indispensable!</div>"
                                   +"<div ng-message='min'>La note minimale est de 10!</div>"
                                   +"<div ng-message='max'>La note maximal est de 20!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bacNoteField").contents())($scope) ;  
              vm.bacNote="" ; 
            },100) ;  

           $("#bac2Note").css("margin-top","-8%") ;
           current='bacNote' ;
       }
        vm.modifyBac2Note=function(){
            $("#bac2Note").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bac2Note").prepend(                   
                        "<div id='bac2NoteField'>"
                        +"<md-input-container style='width:80%; height: 8%; ' class='md-block'>"
                                +"<label>bac+2 note</label>"
                                +"<input class='fields' required type='number'  step='0.01' md-autofocusrequired min='10' max='20' ng-model='cd.bac2Note' name='bac2Note'>"
                                +"<div class='validation-messages' ng-messages='cd.cform.bac2Note.$error'>"
                                   +"<div ng-message='required'>La note de votre bac est indispensable!</div>"
                                   +"<div ng-message='min'>La note minimale est de 10!</div>"
                                   +"<div ng-message='max'>La note maximal est de 20!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bac2NoteField").contents())($scope) ;  
              vm.bac2Note="" ; 
            },100) ;  
           current='bac2Note' ;
       }

        vm.modifyBac3Note=function(){
            $("#bac3Note").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bac3Note").prepend(                   
                        "<div id='bac3NoteField'>"
                        +"<md-input-container style='width:80%; height: 8%; ' class='md-block'>"
                                +"<label>bac+3 note</label>"
                                +"<input class='fields' required type='number'  step='0.01' md-autofocusrequired min='10' max='20' ng-model='cd.bac3Note' name='bac3Note'>"
                                +"<div class='validation-messages' ng-messages='cd.cform.bac3Note.$error'>"
                                   +"<div ng-message='required'>La note de votre bac est indispensable!</div>"
                                   +"<div ng-message='min'>La note minimale est de 10!</div>"
                                   +"<div ng-message='max'>La note maximal est de 20!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bac3NoteField").contents())($scope) ;  
              vm.bac3Note="" ; 
            },100) ;  
           current='bac3Note' ;
       }
        vm.modifyBac2Note1=function(){
            $("#bac2Note1").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bac2Note1").prepend(                   
                        "<div id='bac2Note1Field'>"
                        +"<md-input-container style='width:80%;' class='md-block'>"
                                +"<label>bac+2 note 1</label>"
                                +"<input class='fields' required type='number'  step='0.01' md-autofocusrequired min='10' max='20' ng-model='cd.bac2Note1' name='bac2Note1'>"
                                +"<div class='validation-messages' ng-messages='cd.cform.bac2Note1.$error'>"
                                   +"<div ng-message='required'>La note de votre bac est indispensable!</div>"
                                   +"<div ng-message='min'>La note minimale est de 10!</div>"
                                   +"<div ng-message='max'>La note maximal est de 20!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bac2Note1Field").contents())($scope) ;  
              vm.bac2Note1="" ; 
            },100) ;  
           current='bac2Note1' ;
       }
        vm.modifyBac2Note2=function(){
            $("#bac2Note2").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bac2Note2").prepend(                   
                        "<div id='bac2Note2Field'>"
                        +"<md-input-container style='width:80%;' class='md-block'>"
                                +"<label>bac+2 note 2</label>"
                                +"<input class='fields' required type='number'  step='0.01' md-autofocusrequired min='10' max='20' ng-model='cd.bac2Note2' name='bac2Note2'>"
                                +"<div class='validation-messages' ng-messages='cd.cform.bac2Note2.$error'>"
                                   +"<div ng-message='required'>La note de votre bac est indispensable!</div>"
                                   +"<div ng-message='min'>La note minimale est de 10!</div>"
                                   +"<div ng-message='max'>La note maximal est de 20!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bac2Note2Field").contents())($scope) ;  
              vm.bac2Note2="" ; 
            },100) ;  
           current='bac2Note2' ;
       }

        vm.modifyBac2Note3=function(){
            $("#bac2Note3").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bac2Note3").prepend(                   
                        "<div id='bac2Note3Field'>"
                        +"<md-input-container style='width:80%;' class='md-block'>"
                                +"<label>bac+2 note 3</label>"
                                +"<input class='fields' required type='number'  step='0.01' md-autofocusrequired min='10' max='20' ng-model='cd.bac2Note3' name='bac2Note3'>"
                                +"<div class='validation-messages' ng-messages='cd.cform.bac2Note3.$error'>"
                                   +"<div ng-message='required'>La note de votre bac est indispensable!</div>"
                                   +"<div ng-message='min'>La note minimale est de 10!</div>"
                                   +"<div ng-message='max'>La note maximal est de 20!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bac2Note3Field").contents())($scope) ;  
              vm.bac2Note3="" ; 
            },100) ;  
           current='bac2Note3' ;
       }
       vm.modifyBac2Note4=function(){
            $("#bac2Note4").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bac2Note4").prepend(                   
                        "<div id='bac2Note4Field'>"
                        +"<md-input-container style='width:80%;' class='md-block'>"
                                +"<label>bac+2 note 4</label>"
                                +"<input class='fields' required type='number'  step='0.01' md-autofocusrequired min='10' max='20' ng-model='cd.bac2Note4' name='bac2Note4'>"
                                +"<div class='validation-messages' ng-messages='cd.cform.bac2Note4.$error'>"
                                   +"<div ng-message='required'>La note de votre bac est indispensable!</div>"
                                   +"<div ng-message='min'>La note minimale est de 10!</div>"
                                   +"<div ng-message='max'>La note maximal est de 20!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bac2Note4Field").contents())($scope) ;  
              vm.bac2Note4="" ; 
            },100) ;  
           current='bac2Note4' ;
       }

        vm.modifyBac3Note1=function(){
            $("#bac3Note1").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bac3Note1").prepend(                   
                        "<div id='bac3Note1Field'>"
                        +"<md-input-container style='width:80%;' class='md-block'>"
                                +"<label>bac+3 note 1</label>"
                                +"<input class='fields' required type='number'  step='0.01' md-autofocusrequired min='10' max='20' ng-model='cd.bac3Note1' name='bac3Note1'>"
                                +"<div class='validation-messages' ng-messages='cd.cform.bac3Note1.$error'>"
                                   +"<div ng-message='required'>La note de votre bac est indispensable!</div>"
                                   +"<div ng-message='min'>La note minimale est de 10!</div>"
                                   +"<div ng-message='max'>La note maximal est de 20!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bac3Note1Field").contents())($scope) ;  
              vm.bac3Note1="" ; 
            },100) ;  
           current='bac3Note1' ;
       }

        vm.modifyBac3Note2=function(){
            $("#bac3Note2").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bac3Note2").prepend(                   
                        "<div id='bac3Note2Field'>"
                        +"<md-input-container style='width:80%;' class='md-block'>"
                                +"<label>bac+3 note 2</label>"
                                +"<input class='fields' required type='number'  step='0.01' md-autofocusrequired min='10' max='20' ng-model='cd.bac3Note2' name='bac3Note2'>"
                                +"<div class='validation-messages' ng-messages='cd.cform.bac3Note2.$error'>"
                                   +"<div ng-message='required'>La note de votre bac est indispensable!</div>"
                                   +"<div ng-message='min'>La note minimale est de 10!</div>"
                                   +"<div ng-message='max'>La note maximal est de 20!</div>"
                                +"</div>"
                       +"</md-input-container></div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bac3Note2Field").contents())($scope) ;  
              vm.bac3Note2="" ; 
            },100) ;  
           current='bac3Note2' ;
       }

        vm.modifyBirthDate=function(){
            $("#bdate").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bdate").prepend(                   
                        "<div id='bdateField'>"
                        +" <md-datepicker style='margin-left: -8%;'  md-placeholder='Né(e) le' ng-model='cd.bdate'></md-datepicker>"+
                     "</div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bdateField").contents())($scope) ; 
              $scope.minBDate= new Date(1992,1,1);
              $scope.maxBDate= new Date(1996,11,31); 
            },100) ;  
           current='bdate' ;
           mdate=true ;
       }

        vm.modifyCandidateBacDate=function(){
            $("#bacDate").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bacDate").prepend(                   
                        "<div id='bacDateField'>"
                        +" <md-datepicker  md-placeholder='Bac Date' ng-model='cd.bacDate'></md-datepicker>"+
                     "</div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bacDateField").contents())($scope) ; 
              $scope.minbacDate=  new Date(2010,7,31);
              $scope.maxbacDate= new Date(2014,7,31);
            },100) ;  
           current='bacDate' ;
           mdate=true ;
       }

        vm.modifyBac2Date=function(){
            $("#bac2Date").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bac2Date").prepend(                   
                        "<div id='bac2DateField'>"
                        +" <md-datepicker  style='margin-left: -8%;' md-placeholder='Bac+2 Date' ng-model='cd.bac2Date'></md-datepicker>"+
                     "</div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bac2DateField").contents())($scope) ; 
              $scope.minbac2Date=  new Date(2012,6,31);
              $scope.maxbac2Date= new Date(2016,6,31);
            },100) ;  
           current='bac2Date' ;
           mdate=true ;
       }

        vm.modifyBac3Date=function(){
            $("#bac3Date").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bac3Date").prepend(                   
                        "<div id='bac3DateField'>"
                        +" <md-datepicker  style='margin-left: -8%;'  md-placeholder='Bac+3 Date' ng-model='cd.bac3Date'></md-datepicker>"+
                     "</div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bac3DateField").contents())($scope) ; 
              $scope.minbac3Date=  new Date(2013,6,31);
              $scope.maxbac3Date= new Date(2017,6,31);
            },100) ;  
           current='bac3Date' ;
           mdate=true ;
       }


        vm.modifyAddress=function(){
            $("#adresse").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#adresse").prepend(                   
                        "<div id='adresseField'>"+
                          "<md-input-container class='md-block'flex-gt-sm>"+
                            "<label>Adresse</label>"+
                            "<textarea ng-model='cd.adresse' class='fields' required ng-minlength='10' ng-maxlength='50' name='address' md-maxlength='50' rows='2' md-select-on-focus></textarea>"+
                            "<div class='validation-messages' ng-messages='cd.cform.address.$error'>"+
                                       "<div ng-message='required'>Votre adresse est indispensable!</div>"+
                                        "<div ng-message='minlength'>Votre adresse doit contenir un minimum de  10 caractères!</div>"+
                                       "<div ng-message='maxlength'>Votre adresse doit contenir un maximum de 50 caractères!</div>"+
                             "</div>"+
                          "</md-input-container>"+
                     "</div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#adresseField").contents())($scope) ; 
            },100) ;  
           current='adresse' ;
       }


       /***Types**/
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
          vm.loadBac3 = function(){
          return $timeout(function() {

                $scope.bac3_types =  $scope.bac3_types  || [
                  { name: 'Licence Fondamentale' },
                  { name: 'Licence des scienses et techniques' },
                  { name: 'Licence Professionnelle' },
                  {name:'Autre'}
                ];

          }, 650);
        } ;

        vm.chargeBacT=function(){
          if(vm.bacType=="Autre"){
            $("#bacTypeField").empty() ;
            $("#bacTypeField").append(
              "<md-input-container class='md-block'>"
                    +"<label>Bac type</label>"
                    +"<input md-autofocus required ng-minlength='5'  ng-maxlength='40' ng-model='cd.bacType' name='other_bactype'>"
                    +"<div class='validation-messages' ng-messages='cd.cform.other_bactype.$error'>"
                        +"<div ng-message='required'>Le type est indispensable!</div>"
                        +"<div ng-message='minlength'>Le type doit inclure un minimum de 5 lettres!</div>"
                        +"<div ng-message='maxlength'>Le type doit inclure un maximum de 40 lettres!</div>"
                    +"</div>"
                    +"</md-input-container>"
              );
            $timeout(function(){
              $compile($("#bacTypeField").contents())($scope) ;   
               vm.bacType="";
            },10) ; 
          }
        }

          vm.chargeBac2T=function(){
          if(vm.bac2Type=="Autre"){
            $("#bac2TypeField").empty() ;
            $("#bac2TypeField").append(
                "<md-input-container class='md-block'>"
                    +"<label>Bac 2 type</label>"
                    +"<input md-autofocus required  ng-maxlength='40' ng-minlength='5'  ng-model='cd.bac2Type' name='bac2Type'>"
                    +"<div class='validation-messages' ng-messages='cd.cform.bac2Type.$error'>"
                        +"<div ng-message='required'>Le type est indispensable!</div>"
                        +"<div ng-message='minlength'>Le type doit inclure un minimum de 5 lettres!</div>"
                        +"<div ng-message='maxlength'>Le type doit inclure un maximum de 40 lettres!</div>"
                    +"</div>"
                    +"</md-input-container>"
              );
            $timeout(function(){
              $compile($("#bac2TypeField").contents())($scope) ;   
               vm.bac2Type="";
            },10) ; 
          }
        }
        vm.chargeBac3T=function(){
          if(vm.bac3Type=="Autre"){
            $("#bac3TypeField").empty() ;
            $("#bac3TypeField").append(
              "<md-input-container class='md-block'>"
                    +"<label>Bac 3 type</label>"
                    +"<input md-autofocus required  ng-maxlength='40' ng-minlength='5' ng-model='cd.bac3Type' name='bac3Type'>"
                    +"<div class='validation-messages' ng-messages='cd.cform.bac3Type.$error'>"
                      +"<div ng-message='required'>Le type est indispensable!</div>"
                      +"<div ng-message='minlength'>Le type doit inclure un minimum de 5 lettres!</div>"
                      +"<div ng-message='maxlength'>Le type doit inclure un maximum de 40 lettres!</div>"
                    +"</div>"
                    +"</md-input-container>"
              );
            $timeout(function(){
              $compile($("#bac3TypeField").contents())($scope) ;   
               vm.bac3Type="";
            },10) ; 
          }
        }


        vm.modifyBacType=function(){
            $("#bacType").children().hide() ;
             $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bacType").prepend(                   
                        "<div id='bacTypeField' style='height: 5%;margin-top: -10%;'>"
                          +"<md-input-container >"
                            +"<md-select name='bacType' placeholder='Bac Type' ng-model='cd.bacType' required md-on-open='cd.loadBac()' md-on-close='cd.chargeBacT()' >"
                                     +"<md-option ng-value='bac_type.name' ng-repeat='bac_type in bac_types'>{{bac_type.name}}</md-option>"
                            +"</md-select>"
                            +"<div class='validation-messages'  ng-messages='cd.cform.bacType.$error'>"
                                    +"<div ng-message='required'>Le type de votre bac est indispensable!</div>"
                            +"</div>"
                          +"</md-input-container>"
                       +"</div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bacTypeField").contents())($scope) ;  
              vm.bacType="" ; 
            },100) ;  
           current='bacType' ;
       }

         vm.modifyBac2Type=function(){
            $("#bac2Type").children().hide() ;
             $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bac2Type").prepend(                   
                        "<div id='bac2TypeField' style='height: 5%;margin-top: -10%;'>"
                          +"<md-input-container >"
                            +"<md-select  name='bac2Type' placeholder='Bac 2 Type' ng-model='cd.bac2Type' required md-on-open='cd.loadBac2()' md-on-close='cd.chargeBac2T()'>"
                                     +"<md-option ng-value='bac2_type.name' ng-repeat='bac2_type in bac2_types'>{{bac2_type.name}}</md-option>"
                            +"</md-select>"
                            +"<div class='validation-messages'  ng-messages='cd.cform.bac2Type.$error'>"
                                    +"<div ng-message='required'>Le type de votre bac est indispensable!</div>"
                            +"</div>"
                          +"</md-input-container>"
                       +"</div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bac2TypeField").contents())($scope) ;  
              vm.bac2Type="" ; 
            },100) ;  
           current='bac2Type' ;
       }

       vm.modifyBac3Type=function(){
            $("#bac3Type").children().hide() ;
             $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#bac3Type").prepend(                   
                        "<div id='bac3TypeField' style='height: 5%;margin-top: -10%;'>"
                          +"<md-input-container >"
                            +"<md-select  name='bac3Type' placeholder='Bac 3 Type' ng-model='cd.bac3Type' required md-on-open='cd.loadBac3()' md-on-close='cd.chargeBac3T()'>"
                                     +"<md-option ng-value='bac3_type.name' ng-repeat='bac3_type in bac3_types'>{{bac3_type.name}}</md-option>"
                            +"</md-select>"
                            +"<div class='validation-messages'  ng-messages='cd.cform.bac3Type.$error'>"
                                    +"<div ng-message='required'>Le type de votre bac est indispensable!</div>"
                            +"</div>"
                          +"</md-input-container>"
                       +"</div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#bac3TypeField").contents())($scope) ;  
              vm.bac3Type="" ; 
            },100) ;  
           current='bac3Type' ;
       }

       /***Université****/
          var loadEstab=vm.loadEstab=function(){
             if(settedUni){
                var uni=vm.uni ;
             }else{
               var uni=vm.candidate.bac2_university ;
             }
                if(uni=='Université Ibn Zohr'){
                  $scope.b_estabs =  $scope.b_estabs  || [
                    { name: 'Ecole Superieure de Technologie Agadir' },              
                    { name: 'Faculte des Sciences Agadir' },              
                    { name: 'Faculte Polydisciplinaire Ouarzazate'},
                    { name: 'Faculté Polydisciplinaire Taroudannt' },
                    { name: 'École Supérieure de Technologie Guelmim'},
                    { name: 'Autre' }
                    ];
                }
                else if(uni=='Université Hassan I'){
                     $scope.b_estabs =  $scope.b_estabs  || [
                         {name: 'Faculté des Sciences et Techniques Settat'},
                         {name: 'Faculté Polydisciplinaire Khouribga'},
                         { name: 'École Supérieure de Technologie Berrechid'},
                         {name: 'Autre' } 
                    ];
                }

                else if(uni=='Université Hassan II'){
                     $scope.b_estabs =  $scope.b_estabs  || [
                         {name: 'Faculte de Sciences - Ain Chock' },
                         {name: 'École Supérieure de Technologie Casablanca' },
                         {name: 'Faculté des Sciences Ben M’Sik' },
                         {name: 'Faculté des Sciences et Techniques Mohammedia'},
                         {name: 'Autre' } 
                    ];
                }
                else if(uni=='Université Chouaib Doukkali'){
                     $scope.b_estabs =  $scope.b_estabs  || [
                         { name: 'Faculté des Sciences El Jadida' },                 
                         { name: 'Faculté Polydisciplinaire El Jadida' },
                         {name: 'Autre' } 
                    ];
                }
                else if(uni=='Université Cadi Ayyad'){
                     $scope.b_estabs =  $scope.b_estabs  || [
                        { name: 'Faculté des Sciences - Semlalia' },
                        { name: 'Faculté des Sciences et Techniques Marrakech' },
                        {name: 'Autre' } 
                    ];
                }
                else if(uni=='Université Sultan Moulay Slimane'){
                     $scope.b_estabs =  $scope.b_estabs  || [
                          { name: "Faculté des Sciences et Techniques Béni Mellal"},
                          { name: "Faculté Polydisciplinaire Béni Mellal"},
                          { name: "École Supérieure de Technologie Béni Mellal"},
                          {name: 'Autre' } 
                    ];
                }
                else if(uni=='Université Moulay-Ismail'){
                     $scope.b_estabs =  $scope.b_estabs  || [
                         { name: 'Faculté Polydisciplinaire Errachidia' },
                        { name: 'Faculté des Sciences Meknès' },
                        { name: 'École Supérieure de Technologie Khénifra' },
                        { name: 'École Supérieure de Technologie Meknès' },
                        { name: 'Faculté des Sciences et Techniques Errachidia' }, 
                        {name: 'Autre' } 
                    ];
                }
                else if(uni=='Université Sidi Mohammed Ben Abdellah'){
                     $scope.b_estabs =  $scope.b_estabs  || [
                       { name: 'Faculté des Sciences et Techniques Fès' },
                       { name: 'École Supérieure de Technologie Fès' },
                       { name: 'Faculté des Sciences Fès' },
                       { name: 'Faculté Polydisciplinaire Taza' },                   
                       {name: 'Autre' } 
                    ];
                }
                else if(uni=='Université Ibn-Tofail'){
                     $scope.b_estabs =  $scope.b_estabs  || [
                         { name: 'Faculté des Sciences Kénitra' },
                         {name: 'Autre' }
                    ]; 
                }
                else if(uni=='Université Mohammed Ier'){
                     $scope.b_estabs =  $scope.b_estabs  || [
                          { name: 'Faculté des Sciences Oujda' },
                         { name: "École Supérieure de Technologie Oujda"},
                         { name: 'Faculté Polydisciplinaire Nador '},
                         { name: "Faculté des Sciences et Techniques Alhoceima"},
                         {name: 'Autre' }
                    ];
                }
                 else if(uni=='Université Mohammed V'){
                     $scope.b_estabs =  $scope.b_estabs  || [
                        {name: 'Faculté des Sciences Rabat' },
                        { name: 'École Supérieure de Technologie Salé'},
                        { name: 'Autre' }
                    ];
                }
                else if(uni=='Université Abdelmalek Essaadi'){
                     $scope.b_estabs =  $scope.b_estabs  || [
                         { name: 'Faculté Polydisciplinaire Larache' },
                         { name: 'Faculté des Sciences et Techniques Tanger' },
                         { name: 'Faculté Polydisciplinaire Tétouan' },
                         { name: 'Faculté des Sciences Tétouan' },
                         {name: 'Autre' } 
                    ];
                }
          }


          vm.chargeUni=function(field){
              if(vm.uni){
                  var efield ;
                if(field=="bac2Uni"){
                    efield='bac2Estab' ;
                }else{
                  efield='bac3Estab' ;
                }
                settedUni=true ;
                modifyEstab(efield) ;
                if(vm.uni=="Autre"){
                    $("#"+field+"Field").empty() ;
                    $("#"+field+"Field").append(
                          "<md-input-container style='margin-left:20px' class='md-block'>"  +"<label>Université</label>"
                              +"<input md-autofocus required  ng-maxlength='50' ng-minlength='5' ng-model='cd.uni' name='uni'>"
                              +"<div class='validation-messages' ng-messages='cd.cform.uni.$error'>"
                                    +"<div ng-message='required'>L'université est indispensable!</div>"
                                    +"<div ng-message='minlength'>L'université  doit inclure un minimum de 5 lettres!</div>"
                                    +"<div ng-message='maxlength'>L'université doit inclure un maximum de 40 lettres!</div>"
                              +"</div>"
                              +"</md-input-container>"
                        );

                       $("#"+efield+"Field").empty() ;
                       $("#"+efield+"Field").append("<md-input-container style='margin-left:20px' class='md-block'>"
                              +"<label>&#201;tablissement</label>"
                              +"<input required  ng-maxlength='50' ng-minlength='5' ng-model='cd.estab' name='estab'>"
                              +"<div class='validation-messages' ng-messages='cd.cform.estab.$error'>"
                                    +"<div ng-message='required'>L'établissement est indispensable!</div>"
                                    +"<div ng-message='minlength'>L'établissement doit inclure un minimum de 5 lettres!</div>"
                                    +"<div ng-message='maxlength'>L'établissement doit inclure un maximum de 40 lettres!</div>"
                              +"</div>"
                              +"</md-input-container>"
                        );
                      $timeout(function(){
                        $compile($("#"+field+"Field").contents())($scope) ;   
                        $compile($("#"+efield+"Field").contents())($scope) ;   
                         vm.estab=""; vm.uni="";
                      },10) ; 
                }
                return false ;
            }

        }
        vm.chargeEstab=function(field){
          if(vm.estab=="Autre"){
                  $("#"+field+"Field").empty() ;
                  $("#"+field+"Field").append(
                    "<md-input-container class='md-block'>"
                          +"<label>&#201;tablissement</label>"
                          +"<input required  ng-maxlength='50' ng-minlength='5'  ng-model='cd.estab' name='estab'>"
                          +"<div class='validation-messages' ng-messages='cd.cform.estab.$error'>"
                                +"<div ng-message='required'>L'établissement est indispensable!</div>"
                                +"<div ng-message='minlength'>L'établissement doit inclure un minimum de 5 lettres!</div>"
                                +"<div ng-message='maxlength'>L'établissement doit inclure un maximum de 50 lettres!</div>"
                          +"</div>"
                          +"</md-input-container>"
                    );
                  $timeout(function(){
                    $compile($("#"+field+"Field").contents())($scope) ; 
                     vm.estab="" ; 
                  },10) ; 
          }

        }

        vm.loadUni = function(){
          return $timeout(function() {
                $scope.b_unis =  $scope.b_unis  || [
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

         vm.modifyUni=function(field){
            $("#"+field).children().hide() ;
             $mdToast.show(
                $mdToast.modify()
              );
            vm.field=field ;
            vm.disabledBtns=true ;
            $("#"+field+"").prepend(                   
                        "<div id='"+field+"Field' >"
                          +"<md-input-container >"
                            +"<md-select  name='uni' placeholder='Université' ng-model='cd.uni' required md-on-open='cd.loadUni()' md-on-close='cd.chargeUni(cd.field)'>"
                                     +"<md-option ng-value='b_uni.name' ng-repeat='b_uni in b_unis'>{{b_uni.name}}</md-option>"
                            +"</md-select>"
                            +"<div class='validation-messages'  ng-messages='cd.cform.uni.$error'>"
                                    +"<div ng-message='required'>L'université est indispensable!</div>"
                            +"</div>"
                          +"</md-input-container>"
                       +"</div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#"+field+"Field").contents())($scope) ;  
              vm.uni="" ; 
            },100) ;  
           mCoordinates=true ;
           current=field ;
       }

        var modifyEstab=vm.modifyEstab=function(field){
            $("#"+field).children().hide() ;
            if(!settedUni){
                $mdToast.show(
                  $mdToast.modify()
                );
            }
           
            vm.disabledBtns=true ;
            vm.field=field ;
            $("#"+field).prepend(                   
                        "<div id='"+field+"Field'>"
                          +"<md-input-container >"
                            +"<md-select  name='estab' placeholder='&#201;tablissement' ng-model='cd.estab' required md-on-open='cd.loadEstab()'  md-on-close='cd.chargeEstab(cd.field)'>"
                                     +"<md-option ng-value='b_estab.name' ng-repeat='b_estab in b_estabs'>{{b_estab.name}}</md-option>"
                            +"</md-select>"
                            +"<div class='validation-messages'  ng-messages='cd.cform.estab.$error'>"
                                    +"<div ng-message='required'>L'établissement est indispensable!</div>"
                            +"</div>"
                          +"</md-input-container>"
                       +"</div>") ;              
           setTimeout(function(){
             if(!settedUni){
                 $compile($("#modifyT").contents())($scope) ;  
             }
              $compile($("#"+field+"Field").contents())($scope) ; 
              vm.estab="" ; 
            },100) ;  
           mCoordinates=true ;
           current=field ;
       }
       /****Numbers***/
        vm.modifyNumber=function(){
            $("#phone").children().hide() ;
             $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;

            $("#phone").prepend(                   
                        "<div id='phoneField' style='padding-right: 11%;width:25%;  padding-top: 5%; padding-bottom: 5%;'>"
                          +" <input style='height:4%' type='tel' id='phoneTel' name='phone' required ng-model='cd.phone' intl-tel-input>"
                       +"</div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#phoneField").contents())($scope) ;  
              $("#phone").css('padding-right','14%') ;
            },100) ;  

           current='phone' ;
           settedNumber=true ;
       }
       var settedNumber=false ;
        vm.modifyGSM=function(){
            $("#gsm").children().hide() ;
             $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;

            $("#gsm").prepend(                   
                        "<div id='gsmField' style='padding-right: 11%; width:25%; padding-top: 5%; padding-bottom: 5%;'>"
                          +" <input style='height:4%' type='tel' id='gsmTel' name='gsm' required ng-model='cd.gsm' intl-tel-input>"
                       +"</div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#gsmField").contents())($scope) ; 
              $("#gsm").css('padding-right','14%') ;
            },100) ;  

           current='gsm' ;
           settedNumber=true ;

       }

       /***Country**/
       var settedStates=false ;
       vm.modifyCountry=function(){
            $("#country").children().hide() ;
            $("#city").children().hide() ;
            $mdToast.show(
                $mdToast.modify()
              );
            vm.disabledBtns=true ;
            $("#country").prepend(                   
                        "<div id='countryField'>"+
                          "<country-state-select  state-label='City' country='cd.country' state='cd.city'></country-state-select>"
                        +"</div>") ;              
           setTimeout(function(){
              $compile($("#modifyT").contents())($scope) ;  
              $compile($("#countryField").contents())($scope) ; 
              $("#countryField").css("padding-right","8%") ;
            },100) ;  

           current='country' ;
           settedStates=true ;
       }
                         

      vm.validate=function(){
        var ufield ;

         if($(".fields").hasClass('ng-invalid')){
                  alertify.error('Requête invalide; veuillez revérifier les cases!') ;
                  return false ;  
         }    
         var mdata=new FormData() ;
         mdata.append('user_id',userId) ;
         if(mgender){
             if(vm.gender==null){
                alertify.error("Veuillez ne pas oublier de citer votre sexe!") ;
                return false ;
            }
            var sex=vm.gender ;
            mdata.append("sex", sex) ;
         }else{
               if(mdate){
                  var currentDate=vm[current] ;
                  var year =currentDate.getFullYear() ;
                  var month=currentDate.getMonth()+1 ;
                  var day=currentDate.getDate() ;
                  mdata.append(current, year+"-"+month+"-"+day) ;
               }else{
                if(mCoordinates){
                      if(settedUni){
                         if(current=="bac2Estab"){
                              ufield='bac2Uni' ;
                         }else{
                              ufield='bac3Uni' ;
                         }
                         mdata.append(ufield,vm.uni) ;
                      }
                      mdata.append(current,vm.estab) ;
                    
                } else{
                  if(settedNumber){
                       var number=$("#"+current+"tel").intlTelInput("getNumber") ;
                       var isValid = $("#"+current+"Tel").intlTelInput("isValidNumber");
                       if(!isValid){
                            alertify.error("Numéro de téléphone incorrecte!") ;
                            return false ;
                       }
                       mdata.append(current,vm[current]) ;

                  }
                  else{

                    if(avatar){
                        mdata.append("avatar",avFile) ;
                    }else{
                        if(settedStates){
                            if(vm.country==null || vm.city==null){
                                alertify.error("N'oubliez pas de citer votre pays et ville!") ;
                                return false ;
                            }
                             mdata.append("city",vm.city) ;
                             mdata.append("country",vm.country) ;
                        }else{
                           mdata.append(current,vm[current]) ;
                        }
                    }
                              
                 }     
                }
            }
         }

          $http({ method: 'POST', url: '/mcandidate',data:mdata, headers: {'Content-Type': undefined },
            transformRequest: angular.identity})
              .then(function successCallback(response) {
                  console.log(response) ;
                  var userInf=response.data ;
                  vm.candidate=userInf ;
                  $("#"+current+"Field").remove() ;
                  $("#"+current).children().show() ;
                  vm.disabledBtns=false ;
                   $mdToast.hide() ;
                   if(settedUni){
                      $("#"+ufield+"Field").remove() ;
                      $("#"+ufield).children().show() ;
                   }
                   if(settedStates){
                      $("#city").children().show() ;
                   }
                   mgender=false ;
                   mdate=false ;
                   mCoordinates=false ;
                   settedUni=false ;
                   settedNumber=false ;
                   avatar=false ;
                   avFile=null ;
                   settedStates=false ;
                }, function errorCallback(response) {
                    console.log(response) ;
          });  
      }
        var settedUpload=false ;
        var limit=false ;
    	 	var getInfos=function(){
    	 		  $http.get('/user/'+userId).then(function successCallback(response) {
                      var userInf=response.data ;
                      console.log(userInf) ;
                      vm.candidate=userInf ;
                      getAvatar(vm.candidate.avatar) ;
                      if(userInf.gender=='Male'){
                        vm.naissance='Né le :'
                      }else{
                         vm.naissance='Née le :'
                      }
                         $http.get("/gear").then(function successCallback(response) {
                              var data=response.data.flag ;
                              if(data.setted!="unsetted"){
                                var today=new Date() ;
                                var date=new Date(data.setted) ;
                                var tmp=Math.floor(((date-today)/1000));
                                if(tmp>0){
                                    limit=tmp ;
                                    if(userInf.infos==null){
                                      $mdToast.show(
                                          $mdToast.import()
                                       );
                                      $("#linker").hide() ;
                                      settedUpload=true ;
                                      vm.disabledBtns=true ;
                                      $timeout(function() {
                                            $compile($("#uploadT").contents())($scope) ;  
                                      }, 100) ;
                                    }else{
                                        var year =date.getFullYear() ;
                                        var month=date.getMonth()+1 ;
                                        var day=date.getDate() ;

                                        $mdToast.show(
                                        $mdToast.simple()
                                          .textContent("Vos coordonnées pouvent être modifier jusqu'à le : "+year+"-"+month+"-"+day+", de même avec votre fichier de candidature!")
                                          .position("top right")
                                          .hideDelay(5000)
                                        );
                                        $mdToast.show({
                                              template:""+
                                              "<div class='w3-pink' style='position: absolute; z-index: 1;margin-top: 1%; width: 22%;height: 5%;'>"+
                                                "<timer style='margin-top: 2%; padding-left: 4%;display: block;' interval='1000' countdown='"+tmp+"'>{{days}} days, {{hours}} hours, {{minutes}} minutes, {{seconds}} seconds</timer>"+
                                              "<div>",
                                              position:"top left",
                                              hideDelay:0, 
                                        });
                                    }
                                }else{
                                     vm.disabledBtns=true ;
                                }
                              }else{
                                     vm.disabledBtns=true ;
                              }   
                         }, function errorCallback(response) {
                                    console.log(response) ;

                         }) ;
                     
                  //}
                  }).catch(function(response) {
                       console.log(response) ;
                  });

    	 	}
       var getAvatar=function(avatar){
          $http({ method: 'GET', url: '/candidateAv/'+vm.candidate.avatar, responseType: 'arraybuffer'})
              .then(function successCallback(response) {
                var data=response.data ;
                var str = _arrayBufferToBase64(data);
                $scope.profileAvatar = 'data:image/gif;base64,'+str;
                }, function errorCallback(response) {
                    console.log(response) ;
          });   
      }
  	  $timeout(function(){
            getInfos() ;
      },100) ;

      var avatar=false ; var avFile=null ;
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
          $mdToast.show(
                $mdToast.modify()
          );
          vm.disabledBtns=true ;
          $timeout(function() {
                $compile($("#modifyT").contents())($scope) ;  
          }, 100);

          $('#avatarImage').css("border-radius","0%") ;
     }




      var uploader ;
      vm.validU=function(flag){
        if(flag){
          uploadV(true) ;
        }
        $mdToast.cancel() ;
        if(limit){
           $mdToast.show({
              template:""+
                  "<div class='w3-pink' style='position: absolute; z-index: 1;margin-top: 1%; width: 22%;height: 5%;'>"+
                      "<timer style='margin-top: 2%;display: block; padding-left: 4%;' interval='1000' countdown='"+limit+"'>{{days}} days, {{hours}} hours, {{minutes}} minutes, {{seconds}} seconds</timer>"+
                   "<div>",
              position:"top left",
              hideDelay:0, 
          });
        }
        
                                   
      }

      var gearUpload=function(){
           $scope.candidateTemplate="../template/candidateUpload.html" ;
           uploader=$scope.uploader = new FileUploader({
                      url: '/ucandidate',
                      queueLimit:1,
                      headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('satellizer_token')
                      }

            });
            uploader.filters.push({
              name: 'syncFilter',
              fn: function(item /*{File|FileLikeObject}*/, options) {
                var validExts = new Array(".zip", ".rar");
          
                var fname = item.name.substring(item.name.lastIndexOf('.'));
                if (validExts.indexOf(fname) < 0) {
                  alertify.error("Fichier invalid, les formats acceptés sont: "+
                           validExts.toString() + " types.",10);
                  return false;
                }
                else return this.queue.length < 10;
                    
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
             item.formData.push({userId: localStorage.getItem('userId')});
          }


          uploader.onSuccessItem = function(fileItem, response, status, headers) {
              alertify.notify("L'Upload s'est bien achevé.", 'message', 10) ;
              $("#linker").show() ;
              settedUpload=false ;
              vm.disabledBtns=false ;
              userV() ; 
           };
        
           uploader.onErrorItem = function(fileItem, response, status, headers) {
                  console.log(response) ;
                  var errs=response.errors ;
                  if(errs.file){
                       alertify.error(errs.file,10); 
                   } 
           };
      }


      var userV=vm.userV=function(){
          $scope.candidateTemplate="../template/candidateCard.html" ;
          $("#dialogId").css("top","10px") ;          
        }


      var uploadV=vm.uploadV=function(flag){
        if(!limit){
          $mdToast.show(
           $mdToast.simple()
                .textContent("La date de la modification de vos données s'est achevée!!")
                .position("top right")
                .hideDelay(5000)) ;
        
          return false ;
        }
          if(flag){
              gearUpload() ;
              $mdToast.cancel() ;
          }else{
              if(settedUpload){
                $mdToast.cancel() ;
                settedUpload=false ;
                vm.disabledBtns=false ;
                gearUpload() ;

              }else{
                $mdToast.show(
                  $mdToast.confirmU()
                );
                $timeout(function() {
                    $compile($("#confirmT").contents())($scope) ;  
                }, 1000);
              }
          }
     }

   
      vm.triggerUpload=function(){
                $("#uzone").click() ;
      }


  }

})() ;