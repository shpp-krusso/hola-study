var express = require('express');
var app = express();
var http = require('http').Server(app);
var mysql = require('mysql');
var bodyParser = require('body-parser');
var mysqlConnection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'db1'
});

app.use(bodyParser.json());

app.use(express.static(__dirname + '/todo-list/'));

app.post('/', function(req, res) {
	var queryString = getQueryStringFromRequest(req);
	switch(typeOfQuery(queryString)) {
		
		case 'put':
			mysqlConnection.connect();
			mySqlPutQuery(queryString);
			mysqlConnection.end();
			break;

		case 'get':
			mysqlConnection.connect();
			mySqlGetQuery(queryString, function(data) {
				req.send(data);
			});
			mysqlConnection.end(); 
	}
});
getQueryStringFromRequest(req)
http.listen(3000, function(){
    console.log('listening on *:3000');
});

function mySqlGetQuery(queryString, callback) {
	mysqlConnection.connect();
	mysqlConnection.query(queryString, function(err, data) {
		if (err){
           thow err;	
		} else {
           callback(data);	
		}
 	});

	mysqlConnection.end();
}

function mySqlPutQuery(queryString) {
	mysqlConnection.connect();
	mysqlConnection.query(queryString);
	mysqlConnection.end();
}

function getQueryStringFromRequest(req) {
	var action = req.action;
	var queryString;
	switch(action) {

		case 'remove_one_task':
	
			return queryString = "DELETE FROM `tasks` WHERE 'task_id' = " req.body.taskId;

		case 'get_all_tasks':
			var cond = req.body.filterCondition;
			var finished;
			if (cond == all) {
				finished = 'finished'
			} else {
				finished = (cond == active) ? 0 : 1;
			}

			return queryString = "SELECT `user_id`, `task_id`, `task_definition`, `finished` FROM `tasks` WHERE user_id = " +
			req.body.user_id + "'finished' = " + finished;
		
		case 'remove_all_finished_tasks':

			return queryString = "DELETE FROM `tasks` WHERE 'finished' = " + req.body.finished + 
			"'AND user_id' = " + req.body.userId;

		case 'update_filter-condition_to_active':
			""
		case 'update_filter-condition_to_all':
		case 'update_filter-condition_to_finished':
		case 'update_all_tasks_finished_status':
		case 'get_filter_condition':
		case 'update_finished_status_of_one_taskchange_task_definition':
		case 'change_task_definition':
	}
}