#### `script.js`
```javascript
const taskForm = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const dueDate = document.getElementById("due-date");
const taskList = document.getElementById("task-list");
const themeToggle = document.getElementById("theme-toggle");

// Load tasks from localStorage
window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";

  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  saved.forEach((task) => renderTask(task));
};

// Theme toggle
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

// Add task
taskForm.onsubmit = (e) => {
  e.preventDefault();
  const task = { id: Date.now(), text: taskInput.value, due: dueDate.value };
  renderTask(task);
  saveTask(task);
  taskForm.reset();
};

function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task";
  li.setAttribute("draggable", true);
  li.dataset.id = task.id;
  li.innerHTML = `
    <span>${task.text} ${task.due ? "<small>Due: " + task.due + "</small>" : ""}</span>
    <button onclick="removeTask(${task.id})">❌</button>
  `;
  taskList.appendChild(li);
  addDragEvents(li);
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTask(id) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((t) => t.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.querySelector(`li[data-id='${id}']`).remove();
}

// Drag-and-drop logic
let dragSrc;
function addDragEvents(task) {
  task.addEventListener("dragstart", (e) => {
    dragSrc = task;
    task.classList.add("dragging");
  });
  task.addEventListener("dragend", () => {
    dragSrc = null;
    document.querySelectorAll(".task").forEach((el) => el.classList.remove("dragging"));
  });
  task.addEventListener("dragover", (e) => e.preventDefault());
  task.addEventListener("drop", (e) => {
    e.preventDefault();
    if (dragSrc && dragSrc !== task) {
      taskList.insertBefore(dragSrc, task.nextSibling);
      updateTaskOrder();
    }
  });
}

function updateTaskOrder() {
  const newTasks = [...taskList.children].map((li) => {
    const id = parseInt(li.dataset.id);
    const text = li.querySelector("span").innerText.split(" Due: ")[0];
    const due = li.querySelector("small")?.innerText.replace("Due: ", "") || "";
    return { id, text, due };
  });
  localStorage.setItem("tasks", JSON.stringify(newTasks));
}
