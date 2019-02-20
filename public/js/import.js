function ImportsDialogController($mdDialog,$scope,$timeout, $http, FileUploader){
		  var im=this ;
		 
		 
		  var uploader = $scope.uploader = new FileUploader({
            url: '/istudent'
     	   });

		  im.triggerUpload=function(){
		  	$("#uzone").click() ;
		  }

      
        uploader.filters.push({
            name: 'syncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
            	var validExts = new Array(".xlsx", ".xls", ".csv");
				
			    var fname = item.name.substring(item.name.lastIndexOf('.'));
			    if (validExts.indexOf(fname) < 0) {
			      alert("Invalid file selected, valid files are of " +
			               validExts.toString() + " types.");
			      return false;
			    }
			    else return this.queue.length < 10;
              
           	 }
            
        });      
       

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            ////console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            ////console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
           // console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            //udata.append({"file":fileItem.file}) ;
          //  console.log(udata) ;
           // console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            //console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem',  response);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            ////console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            //console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
           // console.info('onCompleteItem', response);
        };
        uploader.onCompleteAll = function() {
            //console.info('onCompleteAll');
        };
			  
			
	}