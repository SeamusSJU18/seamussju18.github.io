document.addEventListener("DOMContentLoaded", function() {
      const taskForm = document.getElementById("task");
      const taskList = document.getElementById("task-list");

      taskForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const title = document.getElementById("taskname").value;
        const priority = document.getElementById("ispriority").value;
        const status = document.querySelector('input[name="task-status"]:checked').value;
        addTaskToDOM(title, priority, status);
        taskForm.reset();
      });

      function addTaskToDOM(title, priority, status) {
        const li = document.createElement("li");
        li.classList.add("list-group-item");

        if (status === "completed") {
          li.innerHTML = `<del>${title} - ${priority}</del>`;
        } else {
          li.innerHTML = `${title} - ${priority}`;
        }

        taskList.appendChild(li);
      }
    });
