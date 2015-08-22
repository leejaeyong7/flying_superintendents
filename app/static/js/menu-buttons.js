/*	created by Jae Yong Lee
	
	menu-buttons.js

	handles jquery events for button click/input events
	
		javascript
		functions 		: 	none
		
		
		Jquery 
		Scripts 		: 	$(document).on('click','.delete-button',function(e)..
								 delete clicked files based on classes

							$(document).on('click','.home-button',function(e)..
								 call ajax function to change subdirectory to home address

							$(document).on('click','.levelup-button',function(e)..
								 call ajax function to change subdirectory to up one level

							$(document).on('click','.transform-button',function(e)..
								 change viewOption from 0 1 2

							$(document).on('click','.newfolder-button',function(e)..
								 create new folder

							$('#password-form').on('submit',function(e)..
								 handles password form (change password form)

							$(document).on('click','.rename-button',function(e)..
								 rename clicked files

							$(document).on('keydown','#rename-text-input',function(e)..
								 handles events in rename input form

							$(document).on('keydown','#newFolder-text-input',function(e)..
								 handles events in newfolder name input form

							$(document).on('click','.visualize-button',function(e)..
								 handles viewer calling function

							$(document).on('click','.sparse-button',function(e)..
								 handles sparse button

							$(document).on('click','.dense-button',function(e)..
								 handles dense button

							$(document).on('click','.process-button',function(e)..
								 handles process button

                        $(document).on('click','.convert-video-button',function(e)..
                            converts from video to image by creating new folder and putting in images converted from video 
                                 


*/


//--------------------------------------------------------------------
//--------------------------------------------------------------------
//
// buttons on headers
//
//--------------------------------------------------------------------
//--------------------------------------------------------------------

$(document).on('click','.delete-button',function(e){
	deleteFiles();
	$('#browser').empty();
	getFileList('browser-files-list',viewOption);
})

$(document).on('click','.home-button',function(e){
	$.ajax({
        type: 'POST',
        url: '/home-directory'
    });
	$('#browser').empty();
	getFileList('browser-files-list',viewOption);
})

$(document).on('click','.levelup-button',function(e){
	$.ajax({
        type: 'POST',
        url: '/up-directory'
    });
	$('#browser').empty();
	getFileList('browser-files-list',viewOption);
})
$(document).on('click','.transform-button',function(e){
	viewOption = viewOption+1;
	if(viewOption == 3)
		viewOption = 0;
	$('#browser').empty();
	getFileList('browser-files-list',viewOption);
})

$(document).on('click','.newfolder-button',function(e){

	var ct = currenttime();
	var newFolderForm = '';
	newFolderForm +='<form id = "newFolder-text col-md-12 col-sm-12 col-xs-12">';
	newFolderForm += 	'<input id="newFolder-text-input" type="text" placeholder="New name for folder...">';
	newFolderForm += 	'</input>';
	newFolderForm += 	'<input id="newFolder-text-submit" type="submit">';
	newFolderForm += 	'</input>';
	newFolderForm += '</form>';
	var newFolderData = parseFileData('Folder', newFolderForm, ct, 'browser-files-list',viewOption);

	$('#browser').append(newFolderData);
	parseViewMode('.browser-files-list',viewOption);
	$('#newFolder-text-input').focus();
})

$('#password-form').on('submit',function(e){
	var passwordData = new FormData();
	passwordData.append('oldPassword',document.getElementById('oldPassword').value)
	passwordData.append('password',document.getElementById('password').value)
	$.ajax({
		type: 'POST',
		url: '/change-password',
		data: passwordData,
		contentType: false,
		cache: false,
		processData: false,
		/*success: function(e){
		  alert(e);
		  }*/
	})
	document.getElementById('password-form').reset();
	//alert('done');
	getFileList('browser-files-list',viewOption)
})

//--------------------------------------------------------------------
//--------------------------------------------------------------------
/*
  Buttons on right click menu
*/
//--------------------------------------------------------------------
//--------------------------------------------------------------------

var backupName;
$(document).on('click','.rename-button',function(e){

	backupName = $('#browser').children().eq(rightIndex).children('.browser-files-file').text();
	$('#browser').children().eq(rightIndex).children('.browser-files-file').text('');
	$('#browser').children().eq(rightIndex).removeClass('browser-clicked');

	var renameForm = '';
	renameForm +='<form id = "rename-text col-md-12 col-sm-12 col-xs-12">';
	renameForm += 	'<input id="rename-text-input" type="text" placeholder="New name for file...">';
	renameForm += 	'</input>';
	renameForm += 	'<input id="rename-text-submit" type="submit">';
	renameForm += 	'</input>';
	renameForm += '</form>';
	$('#browser').children().eq(rightIndex).children('.browser-files-file').append(renameForm);
	$('#rename-text').css({
		display: 'block',
	});

	$('#rename-text-input').focus();
})

$(document).on('click','.convert-video-button',function(e){
    fileName = $('#browser').children().eq(rightIndex).children('.browser-files-file').text();
    var source = new EventSource("/stream");
    var i = 0;
    source.onmessage = function(event){
        $('#convert-process').width(parseInt(parseFloat(event.data)*100)+'%')
        console.log(parseInt(parseFloat(event.data)*100)+'%')
    }
    $.ajax({
	    type: 'POST',
	    url: '/convert-video',
        data: fileName,
        beforeSend: function(data){
            $('#convert-process').width('0%')
            $('#convertProgressModal').modal('show')
        },
        error: function(data){
            $('#browser').empty();
 		    getFileList('browser-files-list',viewOption);
            source.close();
            $('#convertProgressModal').modal('hide')
        },
	    success: function(data){
            $('#browser').empty();
 		    getFileList('browser-files-list',viewOption);
            source.close();
            $('#convert-process').width('100%')
            $('#convertProgressModal').modal('hide')
	    }
	})

    
})
  
$(document).on('keydown','#rename-text-input',function(e){
	var rex;
	switch(e.keyCode){
		//when hit enter
	case 13:
		renamefile();
		$('#browser').empty();
		
		getFileList('browser-files-list',viewOption);
		break;
	case 27:
		$('#browser').children().eq(rightIndex).children('.browser-files-file').empty();
		$('#browser').children().eq(rightIndex).children('.browser-files-file').text(backupName);
		break;
	default:
		rex = new RegExp($(this).val(), 'i');
		break;
	}

})
$(document).on('keydown','#newFolder-text-input',function(e){
	var rex;
	switch(e.keyCode){
		//when hit enter
	case 13:
		createNewFolder($(this).val());
		$('#browser').empty();
		getFileList('browser-files-list',viewOption);
		break;
	case 27:
		$('#browser').empty();
		getFileList('browser-files-list',viewOption);
		break;
	default:
		rex = new RegExp($(this).val(), 'i');
		break;
	}

})

//--------------------------------------------------------------------
//--------------------------------------------------------------------
/*
  Buttons for visualization
*/
//--------------------------------------------------------------------
//--------------------------------------------------------------------

$(document).on('click','.visualize-button',function(e){
	alert("visual!")
	/*$.ajax({
	  type: 'GET',
	  url: '/viewer',
	  success: function(data){
	  $('body').html(data);
	  }
	  })*/

})
$(document).on('click','.sparse-button',function(e){
	var testForm = new FormData();
	testForm.append('folder_id' , $('#browser').children().eq(rightIndex).find('.browser-files-file').text());

	$('.close-button').prop("disabled",true);
	var sparseFinished = false;
    console.log(testForm)
	$.ajax({
		type: 'POST',
		url: '/run-vsfm',
		data: testForm,
		contentType: false,
		cache: false,
		processData: false,
        error: function(){
            //error handling func
            alert("error!")
        },
        success: function(data){
		    if(data == '100'){
			    $('.close-button').prop("disabled",false);
			    progressModalData(rightIndex);
			    $('#browser').empty();
			    sparseFinished = true;
			    getFileList('browser-files-list',viewOption);
		    }
		    document.getElementById('progress-sparse').style.width = data + '%';

	    }
	})
})

$(document).on('click','.dense-button',function(e){
	var sparseFinished = false;
	var testForm = new FormData();
	testForm.append('folder_id' , $('#browser').children().eq(rightIndex).find('.browser-files-file').text());
	
	$.ajax({
        type: 'POST',
        url: '/run-pmvs',
        data: testForm,
        contentType: false,
        cache: false,
        processData: false,
        error: function(){
            //error handling func
            alert("error!")
        },
        success:function(data){
		    if(data == '100'){
			    $('.close-button').prop("disabled",false);
			    progressModalData(rightIndex);
			    $('#browser').empty();
			    getFileList('browser-files-list',viewOption);
		    }
		    document.getElementById('progress-dense').style.width = data + '%';

	    }
	})
})

$(document).on('click','.process-button',function(e){
    //alert("sparse!");


	var sparseFinished = false;
	
	var testForm = new FormData();
	testForm.append('folder_id' , $('#browser').children().eq(rightIndex).find('.browser-files-file').text());
	
	$.ajax({
		type: 'POST',
		url: '/run-potree',
		data: testForm,
		contentType: false,
		cache: false,
		processData: false,
        error: function(){
            //error handling func
            alert("error!")
        },
        success:function(data){
		    if(data == '100'){
			    $('.close-button').prop("disabled",false);
			    progressModalData(rightIndex);
			    $('#browser').empty();
			    getFileList('browser-files-list',viewOption);
		    }
		    document.getElementById('progress-process').style.width = data + '%';

	    }
	})
})

