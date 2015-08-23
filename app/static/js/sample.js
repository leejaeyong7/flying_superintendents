/*	created by Jae Yong Lee
	
	sample.js

	sample js file for task access
    
		javascript
		functions 		: 	
*/


function getTaskTableData() {
    $.ajax({
        type:'GET',
        url: '/get-db',
        data: 'table=Task',
        beforeSend: function(e){
            /*
              put function to run before ajax call here
             */
        },
        success: function (e){
            /*
              put function after ajax successively get data from server
              e: data from server in json format
             */
            console.log(e);
        },
        error: function (e){
            /*
              put function to handel error here
             */
        }
    });
}

$(document).ready(function(){
    getTableData();
});
