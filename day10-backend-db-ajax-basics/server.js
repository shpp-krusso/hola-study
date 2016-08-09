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

app.use(bodyParser());

app.use(express.static(__dirname + '/todo-list/'));

// app.get('/', function(req,res) {
// 	res.sendFile(__dirname + '/todo-list/index.html');
// });

app.post('/get_filter_condition', function(req, res) {
	var queryString = "SELECT filter_condition FROM users WHERE user_id = " + req.body.user_id;
	mySqlQuery(queryString, function(data) {
				var dataString = JSON.stringify(data);
				data = JSON.parse(dataString);
				res.send((data[0].filter_condition));
			});
	});

app.post('/add_new_task_and_get_id', function(req, res) {
	var queryString = "INSERT INTO tasks (user_id, task_definition, finished) VALUES (" + req.body.user_id + ", '" 
	+ req.body.task_definition + "', " + req.body.finished + ")";
	mySqlQuery(queryString, function(data) {
				res.send(data.insertId.toString());
			});
	});

app.post('/remove_one_task', function(req, res) {
	var queryString = "DELETE FROM tasks WHERE task_id = " + req.body.task_id;
	mySqlQuery(queryString, function(data) {
				res.send(data);
			});
	});

app.post('/get_all_tasks_according_to_filter', function(req, res) {
	var cond = req.body.filterCondition;
			var finished;
			if (cond == 'all') {
				finished = 'finished'
			} else {
				finished = (cond == 'active') ? 0 : 1;
			}

	var queryString = "SELECT * FROM tasks WHERE user_id = " +
			req.body.user_id + " AND finished = " + finished;
	mySqlQuery(queryString, function(data) {
				var dataStr = JSON.stringify(data);
				res.send(JSON.parse(dataStr));
			});
	});

app.post('/remove_all_finished_tasks', function(req, res) {
	var queryString = "DELETE FROM tasks WHERE user_id = " + req.body.user_id + " AND finished = 1";
	mySqlQuery(queryString,function(data) {
				res.send(data);
			});
	});

app.post('/update_filter_condition_to_active', function(req, res) {
	var queryString = '' + "UPDATE users SET filter_condition = 'active' WHERE user_id = " + req.body.user_id;

	mySqlQuery(queryString, function(data) {
				res.send(data);
			});
	});

app.post('/update_filter_condition_to_all', function(req, res) {
	var queryString = "UPDATE users SET filter_condition = 'all' WHERE user_id = " + req.body.user_id;
		
	mySqlQuery(queryString, function(data) {		
				res.send(data);
			});
	});

app.post('/update_filter_condition_to_finished', function(req, res) {
	var queryString = "UPDATE users SET filter_condition = 'finished' WHERE user_id = " + req.body.user_id;
	mySqlQuery(queryString, function(data) {
				res.send(data);
			});
	});

app.post('/reverse_finished_status_off_all', function(req, res) {
	var queryString = "UPDATE tasks SET finished = " + req.body.status + " WHERE user_id = " + req.body.user_id;
	mySqlQuery(queryString, function(data) {
				res.send(data);
			});
	});

app.post('/update_finished_status_of_one_task', function(req, res) {
	var queryString = "UPDATE tasks SET finished = " + req.body.finished + 
	" WHERE task_id = " + req.body.task_id;
	mySqlQuery(queryString, function(data) {
				res.send(data);
			});
	});

app.post('/update_task_definition', function(req, res) {
	var queryString = "UPDATE tasks SET task_definition = '" + req.body.task_definition + 
	"' WHERE task_id = " + req.body.task_id;
	mySqlQuery(queryString, function(data) {
				res.send(data);
			});
	});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

function mySqlQuery(queryString, callback) {
	mysqlConnection.query(queryString, function(err, data) {
		if (err){
           throw err;	
		} else {
           callback(data);	
		}
 	});
}

