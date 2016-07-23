if (typeof(Storage) == 'undefined') {
    alert('Your browser doesn\'t support Local Storage! Errors may occur!');
}
        
var inputNewTask = document.getElementById('addNewTask');
var countOfTasks = 0;
var id = 0;
var archive = [];
inputNewTask.addEventListener('keyup', function (event) {
    switch (Number(event.keyCode)) {
        case 13:
            var taskText = this.value;
            this.value = '';
            if (taskText !== '') {
                var newTask = createNewTask(taskText);
            }
            break;

        case 27:
            this.value = '';
            this.blur();
    }
});


function createNewTask(value) {
    var checkbox = createCheckBox();
    var p = createTaskText(value);
    var taskChangeField = createInputField();
    var del = createDeleteButton();
    var newTask = createOneTaskBody(checkbox, p, taskChangeField, del);
    var task = {id: newTask.id, finished: isFinished(checkbox), text: p.value};
    addTaskToArchive(task);
    reloadTaskCounter();
    return newTask;
}

function createCheckBox() {
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'main-oneTask-checkbox_todo';
    checkbox.addEventListener('click', function() {
        var p = this.parentElement.getElementsByClassName('main-oneTask-p_todo')[0];
        p.style.textDecoration = this.checked ? 'line-through' : 'none';
        changeFinishedStatus(this);
        reloadTaskCounter();
    });
    return checkbox;
}

function createTaskText(value) {
    var p = document.createElement('p');
    p.appendChild(document.createTextNode(value));
    p.className = 'main-oneTask-p_todo';
    p.addEventListener('dblclick', function() {
        this.style.display = 'none';
        var inputField = this.parentElement.getElementsByClassName('main-oneTask-hidden_todo')[0];
        inputField.focus();
        inputField.style.display = 'block';
        inputField.value = this.innerHTML;
    });
    return p;
}

function createInputField() {
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'main-oneTask-hidden_todo';
    input.style.display = 'none';
    input.addEventListener('keyup', function(event) {
        switch(event.keyCode) {
         case 13:
            this.style.display = 'none';
            var p = this.parentElement.getElementsByClassName('main-oneTask-p_todo')[0];
            p.innerHTML = this.value;
            p.style.display = 'block';
            this.blur();
            break;

        case 27:
            this.blur();
            this.style.display = 'none';
            var p = this.parentElement.getElementsByClassName('main-oneTask-p_todo')[0];
            p.style.display = 'block';
        }
    });
    return input;
}

function createDeleteButton() {
    var del = document.createElement('img');
    del.src = 'img/del.png';
    del.className = 'main-oneTask-delete_todo';
    del.style.visibility = 'hidden';   
    del.addEventListener('click', function() {
        removeTask(this.parentElement);
        reloadTaskCounter();
    });
    return del;
}

function createOneTaskBody(checkbox, p, taskChangeField, del) {
    var div = document.createElement('div');
    div.id = 'task' + getAndIncremId();
    div.className = 'main-oneTask_todo';
    div.appendChild(checkbox);
    div.appendChild(p);
    div.appendChild(taskChangeField);
    div.appendChild(del);
    div.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#e0cae9';
        var del = this.getElementsByClassName('main-oneTask-delete_todo')[0];
        del.style.visibility = 'visible';
    });
    div.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#b9d2ff';
        var del = this.getElementsByClassName('main-oneTask-delete_todo')[0];
        del.style.visibility = 'hidden';
    }); 
    document.getElementById('taskList').appendChild(div);
    return div;
}

function getAndIncremId() {
    id++;
    return id;
}

function isFinished(chbxElem) {
    return (chbxElem.checked) ? 1 : 0;
}

function addTaskToArchive(taskElem) {
    archive.push(taskElem);
}

function changeFinishedStatus(chbxElem) {
    var id = chbxElem.parentElement.id;
    for (var i = 0; i < archive.length; i++) {
        if (archive[i].id == id) {
            archive[i].finished = isFinished(chbxElem);
            break;
        }
    }
}

function reloadTaskCounter() {
    var count = 0;
    for (var i = 0; i < archive.length; i++) {
        count += (archive[i].finished) ? 0 : 1;   
    }
    document.getElementById('taskCounter').innerHTML = 'Всего: ' + count;
}

function removeTask(taskElem) {
    for (var i = 0; i < archive.length; i++) {
        if (taskElem.id == archive[i].id) {
            archive.splice(i, 1);
            break;
        }
    }
    taskElem.remove();
}