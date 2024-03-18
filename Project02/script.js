document.addEventListener("DOMContentLoaded", function() {
  const taskForm = document.getElementById("task");
  const pendingList = document.getElementById("pending");
  const completedList = document.getElementById("completed");

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
      completedList.appendChild(li);
    } else {
      li.innerHTML = `${title} - ${priority}`;
      pendingList.appendChild(li); // Add to pending list by default
    }
  }
});
