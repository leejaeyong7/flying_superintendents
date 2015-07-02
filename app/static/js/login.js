

function stopVideo(){
	var video = document.getElementById('videoId');
	var tmp = video.src;
	/*//var video = $("video").get(0);
	video.pause(0);*/
	//$(document).ajaxStop();
	video.src = "";
	video.load();
	$("video").remove();

	$("#videoId").html('<video id="videoId" loop class="embed-responsive-item" preload = "none"></video>');
	video = $("video").get(0);
	video.src = tmp;
	video.addEventListener('pause', stopVideo);


}

$('.form-signin').on('submit', function(e){
	stopVideo();
});

$('.stopv').on('mousedown', function(e){
	stopVideo();
});

/*$(document).bind('beforeunload',function(e){
	alert("reloading..")
	stopVideo();
})*/

$(window).ready(function(){
	
	var video = $('video').get(0);
	video.play();
	window.onbeforeunload = stopVideo;
	video.addEventListener('pause',	$(document).ajaxStop(function(e){
		var tmp = video.src;
		video.src = "";
		video.load();
		$("video").remove();
		$("#videoId").html('<video id="videoId" loop class="embed-responsive-item" preload = "none"></video>');
		video = $("video").get(0);
		video.src = tmp;
		})
	);


})
