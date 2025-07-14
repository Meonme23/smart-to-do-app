document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const taskInput = document.getElementById('task-input');
  const dueDateInput = document.getElementById('due-date');
  const taskList = document.getElementById('task-list');
  const themeToggle = document.getElementById('theme-toggle');

  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(addTaskToDOM);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    if (taskText) {
      const task = { text: taskText, due: dueDate };
      addTaskToDOM(task);
      saveTask(task);
      taskInput.value = '';
      dueDateInput.value = '';
    }
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${task.text} ${task.due ? '(' + task.due + ')' : ''}</span>
      <button onclick="this.parentElement.remove(); removeTask('${task.text}');">❌</button>
    `;
    taskList.appendChild(li);
  }

  function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function removeTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
});
