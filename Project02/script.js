
document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById("task");
    const taskList = document.getElementById("task-list");
    const tasks = [];

    // Function to add a new task
    function addTask(title, priority, status) {
        const task = { title, priority, status };
        tasks.push(task);
        addTaskToDOM(task);
    }

    // Function to remove a task
    function removeTask(index) {
        tasks.splice(index, 1);
        renderTasks();
    }

    // Function to mark a task as complete
    function markAsComplete(index) {
        tasks[index].status = "completed";
        renderTasks();
    }

    // Function to render tasks
    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            li.innerHTML = `
                ${task.title} - ${task.priority}
                <span>
                    <button class="btn btn-success btn-sm mr-2" onclick="markAsComplete(${index})">Mark as Complete</button>
                    <button class="btn btn-danger btn-sm" onclick="removeTask(${index})">Remove</button>
                </span>
            `;
            if (task.status === "completed") {
                li.style.textDecoration = "line-through";
            }
            taskList.appendChild(li);
        });
    }

    // Event listener for form submission
    taskForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const title = document.getElementById("taskname").value;
        const priority = document.getElementById("ispriority").value;
        const status = document.querySelector('input[name="task-status"]:checked').value;
        addTask(title, priority, status);
        taskForm.reset();
    });

    // Initial rendering of tasks
    renderTasks();
});
