document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");
    const tasks = [];
  
    taskForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const title = document.getElementById("task-title").value;
      const priority = document.getElementById("task-priority").value;
      const status = document.querySelector('input[name="task-status"]:checked').value;
  
      const task = { title, priority, status };
      tasks.push(task);
      addTaskToDOM(task);
      taskForm.reset();
    });
  
    function addTaskToDOM(task) {
      const li = document.createElement("li");
      li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
      li.innerHTML = `
        ${task.title} - ${task.priority}
        <span>
          <button class="btn btn-success btn-sm mr-2" onclick="markAsComplete(this)">Mark as Complete</button>
          <button class="btn btn-danger btn-sm" onclick="removeTask(this)">Remove</button>
        </span>
      `;
      if (task.status === "completed") {
        li.style.textDecoration = "line-through";
      }
      taskList.appendChild(li);
    }
  
    function markAsComplete(button) {
      const li = button.parentElement.parentElement;
      li.style.textDecoration = "line-through";
      const index = Array.from(li.parentElement.children).indexOf(li);
      tasks[index].status = "completed";
    }
  
    function removeTask(button) {
      const li = button.parentElement.parentElement;
      li.remove();
      const index = Array.from(li.parentElement.children).indexOf(li);
      tasks.splice(index, 1);
    }
  });
