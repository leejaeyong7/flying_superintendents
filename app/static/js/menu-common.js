/*	created by Jae Yong Lee
	
	menu-common.js

	handles common javascript functions for menu.html
	
		javascript
		functions 		: 	updateUploadModal()
								 updates upload modal with allowed extension

							updateImageModal()
								 updates imageviewer with imagefile

							getFileList(classname, vO)
								 receives file list information in JSON format

							upload(i, file)
								 post file data to server with ajax call post

							deleteFiles()
								 call ajax to remove clicked files

							currenttime()
								 get current time

							usernameVal()
								 get username value from server

							renamefile()
								 call ajax function to rename files

							createNewFolder(name)
								 call ajax function to create new folder with name
		
		
		Jquery 
		Scripts 		: 	none
*/


//--------------------------------------------------------------------
//--------------------------------------------------------------------
/*
	Update Data in modals
*/
//--------------------------------------------------------------------
//--------------------------------------------------------------------

	function updateUploadModal(){
		//var allowedExtensions = '';
		$('.allowed-extension').empty();
		$.ajax({
			type: 'GET',
			url: '/allowed-extension',
			success: function(data){
				//alert(data);
				$('.allowed-extension').text(data);
			}
		})

	}


	/*
		updates image modal and its image
	*/
	function updateImageModal(){
		var filename = $('#browser').children().eq(rightIndex).find('.browser-files-file').text();
		//alert(filename);
		var string ='<img src="get-imgs?type='+filename+'" alt="' +filename+'" class= "imageModal-image"></img>';

		$('#imageModal').find('.modal-body').empty();
		$('#imageModal').find('.modal-body').append(string);
	}


//--------------------------------------------------------------------
//--------------------------------------------------------------------
/*
	Browser file list parser in menu-files.js
*/
//--------------------------------------------------------------------
//--------------------------------------------------------------------



//--------------------------------------------------------------------
//--------------------------------------------------------------------
/*
	helper functions
*/
//--------------------------------------------------------------------
//--------------------------------------------------------------------




function currenttime(){

	$.ajax({
		type: 'GET',
		url: '/current-time',
		success: function(text){
			return text;
		},
		error: function(){
            alert("error retrieving time");
		}
	});
}




function usernameVal(){
	var username;
	$.ajax({
		type: 'GET',
		url: '/username',
        contentType: false,
        cache: false,
        processData: false,
		success: function(text){
			username = text;
		},
		error: function(){
		}
	});
	$('.username-input').text(username);
}




