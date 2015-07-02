/*	created by Jae Yong Lee
	
	menu-modal.js

	handles javascript/jquery events for server menu page on modals
	
		javascript
		functions 		: 	progressModalData(rI) 
								over-all function for calling appropriate progressModal's button properties & progress bar length
		
		
		Jquery 
		Scripts 		: 	$('#imageModal').on()
								 when image modal is shown update imageModal
							
							$('#uploadModal').on()		
								 when upload modal is shown update UploadModal

							$('#progressModal').on()	
								 when progress modal is shown call progressModalData
*/



$('#imageModal').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget) // Button that triggered the modal
	var recipient = button.data('toggle') // Extract info from data-* attributes
	// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
	// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
	$('#imageModal').focus();
	updateImageModal();
})



$('#uploadModal').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget) // Button that triggered the modal
	var recipient = button.data('toggle') // Extract info from data-* attributes
	// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
	// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.

	$('.upload-table').empty();
	updateUploadModal();
})



$('#progressModal').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget) // Button that triggered the modal
	var recipient = button.data('toggle') // Extract info from data-* attributes
	// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
	// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
	progressModalData(rightIndex);
})


function progressModalData(rI){ // rI stands for right Index

	//create a test form and sequentially check whether vsfm/pmvs/potree has been processed
	var testForm = new FormData();
	testForm.append('folder_id' , $('#browser').children().eq(rI).find('.browser-files-name-name').text());
	$.ajax({
			type: 'POST',
			url: '/done-potree',
			data: testForm,
			contentType: false,
			cache: false,
			processData: false
	}).done(function(data){
			if(data == "true"){
				$('.sparse-button').prop("disabled",false);
				$('.dense-button').prop("disabled",false);
				$('.process-button').prop("disabled",false);
				$('.visualize-button').prop("disabled",false);
				document.getElementById('progress-sparse').style.width = '100' + '%';
				document.getElementById('progress-dense').style.width = '100' + '%';
				document.getElementById('progress-process').style.width = '100' + '%';
			}
			else{
				$.ajax({
					type: 'POST',
					url: '/done-pmvs',
					data: testForm,
					contentType: false,
					cache: false,
					processData: false
				}).done(function(data){
					if(data == "true"){
						$('.sparse-button').prop("disabled",false);
						$('.dense-button').prop("disabled",false);
						$('.process-button').prop("disabled",false);
						$('.visualize-button').prop("disabled",true);
						document.getElementById('progress-sparse').style.width = '100' + '%';
						document.getElementById('progress-dense').style.width = '100' + '%';
						document.getElementById('progress-process').style.width = '0' + '%';
					}
					else{
						$.ajax({
							type: 'POST',
							url: '/done-vsfm',
							data: testForm,
							contentType: false,
							cache: false,
							processData: false
						}).done(function(data){
							if(data == "true"){
								$('.sparse-button').prop("disabled",false);
								$('.dense-button').prop("disabled",false);
								$('.process-button').prop("disabled",true);
								$('.visualize-button').prop("disabled",true);
								document.getElementById('progress-sparse').style.width = '100' + '%';
								document.getElementById('progress-dense').style.width = '0' + '%';
								document.getElementById('progress-process').style.width = '0' + '%';
							}
							else{
								$('.sparse-button').prop("disabled",false);
								$('.dense-button').prop("disabled",true);
								$('.process-button').prop("disabled",true);
								$('.visualize-button').prop("disabled",true);
								document.getElementById('progress-sparse').style.width = '0' + '%';
								document.getElementById('progress-dense').style.width = '0' + '%';
								document.getElementById('progress-process').style.width = '0' + '%';
							}
						})
					}
				})
			}

	})	
}