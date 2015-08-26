/*===============================================================================
 * @author: Jae Yong Lee
 * @file: menu-modals.js
 *  
 * @summary:
 *      handles modal events on show/close
 *      should be loaded after modal-events for right-index access
 *
 *===============================================================================*/


//===============================================================================//
//===============================================================================//
//
//                            modal events
//
//===============================================================================//
//===============================================================================//
/**
 *  convert Option modal show event
 *  @params: none
 *  @return: none
 */
$('#convertOptionModal').on('show.bs.modal', function (event) {
    updateConvertOptionModal();
});



/**
 *  retrieves parameters from video
 *  @param: none
 *  @return: none
 */
function updateConvertOptionModal(){
    var filename = $('#browser').children().eq(rightIndex).find('.browser-files-file').text();
    $.ajax({
        type: 'POST',
        url: '/video-info',
        beforeSend: function(e){
            /*
              function called before send
            */
            $('.option-parameter-name').addClass('col-md-offset-2 col-sm-offset-2 col-xs-offset-2 col-md-6 col-sm-6 col-xs-6');
            $('#convert-option-parameter-finalFramePos').children(".option-parameter-name").text("Final Frame Pos input :");
            $('#convert-option-parameter-framerate').children(".option-parameter-name").text("Skip per capture input :");
        },
        success:  function(e){
            /*
              function called after success
            */
            var frameCount = JSON.parse(e).totalCount;
            $('.info-parameter-name').text("Total Frame Count :");
            $('.info-parameter-value').text(frameCount);
            $('#convert-option-parameter-finalFramePos').children(".option-parameter-value").val(frameCount);
        },
        error:  function(e){
            /*
              function called on fail
            */
            alert("video-info retrieval failed");
        },
        data: filename,
        contentType: false,
        cache: false,
        processData: false
    });
}

/**
 *  image modal show event
 *  @params: none
 *  @return: none
 */
$('#imageModal').on('show.bs.modal', function (event) {
    $('#imageModal').focus();
    updateImageModal();
});
/**
 *  retrieves image from server to place in imagemodal
 *  @params: none
 *  @return: none
 */
function updateImageModal(){
    var filename = $('#browser').children().eq(rightIndex).find('.browser-files-file').text();
    var string ='<img src="get-imgs?type='+filename+'" alt="' +filename+'" class= "imageModal-image"></img>';
    $('#imageModal').find('.modal-body').empty();
    $('#imageModal').find('.modal-body').append(string);
}

/**
 *  upload modal show event
 *  @params: none
 *  @return: none
 */
$('#uploadModal').on('show.bs.modal', function (event) {
    $('.upload-table').empty();
    $('.progress-place').empty();
    updateUploadModal();
});
/**
 *  update allowed extension from uploadmodal
 *  @params: none
 *  @return: none
 */
function updateUploadModal(){
    $('.allowed-extension').empty();
    $.ajax({
        type: 'GET',
        url: '/allowed-extension',
        success: function(data){
            $('.allowed-extension').text(data);
        }
    });
}


/**
 *  progress modal show event
 *  @params: none
 *  @return: none
 */
$('#progressModal').on('show.bs.modal', function (event) {
    progressModalData(rightIndex);
});


/**
 *  progress modal status check
 *  @params: {Integer} rI = index of right clicked element
 *  @return: none
 */
function progressModalData(rI){ // rI stands for right Index
    
    //create a test form and sequentially check whether vsfm/pmvs/potree has been processed
    var testForm = new FormData();
    testForm.append('folder_id' , $('#browser').children().eq(rI).find('.browser-files-file').text());
    $.ajax({
        type: 'POST',
        url: '/done-potree',
        data: testForm,
        contentType: false,
        cache: false,
        processData: false,
        success: function(data){
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
                    processData: false,
                    success: function(data){
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
                                processData: false,
                                success:function(data){
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
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}
