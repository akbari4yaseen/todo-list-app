const taskInput = document.querySelector('.task-input input')
const taskBox = document.querySelector('.task-box')
var todos = JSON.parse(localStorage.getItem('todo-list'))
const filters = document.querySelectorAll('.filter span')
const clearAll = document.querySelector('.control .btn-clear')

var taskEditId 
var isEditedTask = false

taskInput.addEventListener('keyup', e => {
    const userTask = taskInput.value.trim()
    if (e.key == 'Enter' && userTask){
        if(!isEditedTask){
            if (!todos){ // if todos isn't exist, pass an empty array 
                todos = []
            }
            let taskInfo = {name: userTask, status: 'pending'}
            todos.push(taskInfo)
        } else {
            isEditedTask = false
            todos[taskEditId].name = userTask
        }
        taskInput.value = ''
        updateLocalSotrage()
        showTodo('all')
    }
})

filters.forEach(btn =>{
    btn.addEventListener('click', ()=>{
        document.querySelector('span.active').classList.remove('active')
        btn.classList.add('active')
        showTodo(btn.id)
    })
})

function showTodo(filter){
    let li = ''
    if(todos){
        todos.forEach((todo, id) => {
            let isDone = todo.status == 'completed' ? 'checked' : ''
            if (filter == todo.status || filter == 'all'){
                li += `<li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isDone}>
                        <p class="${isDone}">${todo.name}</p>
                    </label>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="task-menu">
                            <li onclick="editTask(${id}, '${todo.name}')"><i class="uil uil-pen"></i>Edit</li>
                            <li onclick="deleteTask(${id})"><i class="uil uil-trash"></i>Delete</li>
                        </ul>
                    </div>
                </li>`
            }
        })
    }
    taskBox.innerHTML = li || `<span>You don't have any task here</span>`
}

updateLocalSotrage = () => {
    localStorage.setItem('todo-list', JSON.stringify(todos))
}

function updateStatus(selectetTask){
    let taskName = selectetTask.parentElement.lastElementChild
    todos[selectetTask.id].status = 'completed'
    if (selectetTask.checked){
        taskName.classList.add('checked')
    } else {
        todos[selectetTask.id].status = 'pending'
        taskName.classList.remove('checked')
    }
    updateLocalSotrage()
}

function showMenu(selectetTask){
    let taskMenu = selectetTask.parentElement.lastElementChild
    taskMenu.classList.add('show')

    document.addEventListener('click', e =>{
        if(e.target.tagName != 'I' || e.target != selectetTask){
            taskMenu.classList.remove('show')
        }
    })
}

function deleteTask(taskId){
    todos.splice(taskId, 1)
    updateLocalSotrage()
    showTodo('all')
}

function editTask(taskId, taskName){
    [taskEditId, taskInput.value] = [taskId, taskName]
    isEditedTask = true
}
clearAll.addEventListener('click', ()=>{
    todos.splice(0, todos.length)
    updateLocalSotrage()
    showTodo('all')
})

showTodo('all')