var express = require('express');
var port = 3000;
var app = express();
var http = require('http').Server(app);
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'db1'
});

app.use(cookieParser());
app.use(bodyParser());

app.get('/', function (req, res) {
	if(req.cookies.user_id) {
		res.redirect('/todo');
	} else {	
	app.use(express.static(__dirname + '/authorization/'));
    res.sendFile(__dirname + '/authorization/index.html');
	}
});

app.get('/todo', function (req, res) {
	if(!req.cookies.user_id) {
		res.redirect('/');
	}
	app.use(express.static(__dirname + '/todo-list/'));
    res.sendFile(__dirname + '/todo-list/index.html');
});

app.post('/login', function (req, res) {
    var queryString = "SELECT password, user_id FROM users WHERE user_name = '" + req.body.user_name + "'";
   
    mySqlQuery(queryString, function (data) {

        if (req.body.password == data[0]["password"]) {
        	console.log('login');
            res.cookie('user_id', data[0]["user_id"]);
            res.cookie('filter', data[0]["filter_condition"]);

            getActiveTasksCountAndWriteToCookies(user_id, function(count) { 	
            res.cookie('count', count);
            res.send('ok');
            });

        } else {
            res.send('password_does_not_match');
        }
    });
});

app.post('/registration', function (req, res) {
    var queryString = "INSERT INTO users (password, filter_condition, user_name) VALUES (" + "'" + req.body.password + "'" + ", '"
            + "all" + "', " + "'" + req.body.user_name + "'" + ")";
    mySqlQuery(queryString, function (data) {
        res.send('ok');
    });
});

app.post('/add_new_task_and_get_id', function (req, res) {
    var queryString = "INSERT INTO tasks (user_id, task_definition, finished) VALUES (" + req.cookies.user_id + ", '"
            + req.body.task_definition + "', " + req.body.finished + ")";
    mySqlQuery(queryString, null);
    
    getActiveTasksCountAndWriteToCookies(user_id, function(count) { 	
        res.cookie('count', count);
        });

    selectAllTaskAccordingToFilter(req.cookies.user_id, req.cookies.filter_condition, res.send(tasks));
});

app.post('/remove_one_task', function (req, res) {
    var queryString = "DELETE FROM tasks WHERE task_id = " + req.body.task_id;
    mySqlQuery(queryString, null);

	getActiveTasksCountAndWriteToCookies(user_id, function(count) { 	
        res.cookie('count', count);
        });   

    selectAllTaskAccordingToFilter(req.cookies.user_id, req.cookies.filter_condition, res.send(tasks));
});

app.post('/remove_all_finished_tasks', function (req, res) {
    var queryString = "DELETE FROM tasks WHERE user_id = " + req.cookies.user_id + " AND finished = 1";
    mySqlQuery(queryString, null);
    selectAllTaskAccordingToFilter(req.cookies.user_id, req.cookies.filter_condition, res.send(tasks));
});

app.post('/update_filter_condition_to_active', function (req, res) {
    var queryString = '' + "UPDATE users SET filter_condition = 'active' WHERE user_id = " + req.cookies.user_id;
    res.cookie('filter', data[0]["filter_condition"]);
    mySqlQuery(queryString, null);
    selectAllTaskAccordingToFilter(req.cookies.user_id, '0', res.send(tasks));
});

app.post('/update_filter_condition_to_all', function (req, res) { 
	var queryString = "UPDATE users SET filter_condition = 'all' WHERE user_id = " + req.cookies.user_id;
    res.cookie('filter', data[0]["filter_condition"]);
    mySqlQuery(queryString, null);
    selectAllTaskAccordingToFilter(req.cookies.user_id, '2', res.send(tasks));
});

app.post('/update_filter_condition_to_finished', function (req, res) {
    var queryString = "UPDATE users SET filter_condition = 'finished' WHERE user_id = " + req.cookies.user_id;
    res.cookie('filter', data[0]["filter_condition"]);
    mySqlQuery(queryString, null);
    selectAllTaskAccordingToFilter(req.cookies.user_id, '0', res.send(tasks));
});

app.post('/reverse_finished_status_off_all', function (req, res) {
	var filter = (req.cookies.filter == 2) ? '*' : req.cookies.filter;
    var queryString = "UPDATE tasks SET finished = " + req.body.status + " WHERE user_id = " 
    + req.cookies.user_id "AND finished = " + filter;
    mySqlQuery(queryString, null);

    getActiveTasksCountAndWriteToCookies(user_id, function(count) { 	
        res.cookie('count', count);
        });

    selectAllTaskAccordingToFilter(req.cookies.user_id, req.cookies.filter_condition, res.send(tasks));
});

app.post('/update_finished_status_of_one_task', function (req, res) {
    var queryString = "UPDATE tasks SET finished = " + req.body.finished +
            " WHERE task_id = " + req.body.task_id;
    mySqlQuery(queryString, null);

    getActiveTasksCountAndWriteToCookies(user_id, function(count) { 	
        res.cookie('count', count);
        });
    
    selectAllTaskAccordingToFilter(req.cookies.user_id, req.cookies.filter_condition, res.send(tasks));
});

app.post('/update_task_definition', function (req, res) {
    var queryString = "UPDATE tasks SET task_definition = '" + req.body.task_definition +
            "' WHERE task_id = " + req.body.task_id;
    mySqlQuery(queryString, null);
    selectAllTaskAccordingToFilter(req.cookies.user_id, req.cookies.filter_condition, res.send(tasks));    
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});

function mySqlQuery(queryString, callback) {
    mysqlConnection.query(queryString, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            callback(data);
        }
    });
}

function selectAllTaskAccordingToFilter(user_id, filter_condition, callback) {
	var finished = (filter_condition == 2) ? '*' : filter_condition;
	var queryString = "SELECT * FROM tasks WHERE user_id = " +
            user_id + " AND finished = " + finished;

    mySqlQuery(queryString, function (data) {
        var dataStr = JSON.stringify(data);
        callback(JSON.parse(dataStr));
    });        
}

function getActiveTasksCountAndWriteToCookies(user_id) {
	var queryString = "SELECT COUNT(task_id) AS amount FROM tasks WHERE finished = 0 AND user_id = " + req.cookies.user_id;
    mySqlQuery(queryString, function (data) {
        callback((data[0]["amount"]).toString());
    });
}
