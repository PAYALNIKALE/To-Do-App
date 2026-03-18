let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filteredTasks = [...tasks];

let currentPage = 1;
let rowsPerPage = 5;
let editIndex = null;

// ADD TASK
function addTask() {
  let name = document.getElementById("name").value;
  let task = document.getElementById("task").value;
  let time = document.getElementById("time").value;
  let address = document.getElementById("address").value;

  if (!name || !task) return alert("Fill required fields");

  tasks.push({ name, task, time, address, completed: false });

  localStorage.setItem("tasks", JSON.stringify(tasks));

  clearInputs();
  applySearchAndFilter();
}

// SEARCH + FILTER
function applySearchAndFilter() {
  let value = document.getElementById("search").value.toLowerCase();
  let type = document.getElementById("statusFilter").value;

  filteredTasks = tasks.filter(t => {
    let matchSearch =
      t.name.toLowerCase().includes(value) ||
      t.task.toLowerCase().includes(value);

    let matchStatus =
      type === "all" ||
      (type === "completed" && t.completed) ||
      (type === "pending" && !t.completed);

    return matchSearch && matchStatus;
  });

  currentPage = 1;
  displayTasks();
}

// DISPLAY TASKS
function displayTasks() {
  let table = document.getElementById("taskTable");
  table.innerHTML = "";

  let start = (currentPage - 1) * rowsPerPage;
  let paginated = filteredTasks.slice(start, start + rowsPerPage);

  paginated.forEach((item, index) => {
    let row = document.createElement("tr");

    row.innerHTML = `
      <td>${start + index + 1}</td>
      <td>${item.name}</td>
      <td class="${item.completed ? 'completed' : ''}">${item.task}</td>
      <td>${item.time}</td>
      <td>${item.address}</td>
      <td>
        <button onclick="toggleComplete(${start + index})">
          ${item.completed ? "✅" : "❌"}
        </button>
      </td>
      <td>
        <button onclick="openEdit(${start + index})">✏️</button>
        <button onclick="deleteTask(${start + index})">🗑️</button>
      </td>
    `;

    table.appendChild(row);
  });

  updatePagination();
}

// DELETE
function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  applySearchAndFilter();
}

// COMPLETE
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  applySearchAndFilter();
}

// PAGINATION
function updatePagination() {
  let pageInfo = document.getElementById("pageInfo");
  let totalPages = Math.ceil(filteredTasks.length / rowsPerPage);

  pageInfo.innerText = `Page ${currentPage} of ${totalPages || 1}`;
}

function nextPage() {
  let totalPages = Math.ceil(filteredTasks.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayTasks();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayTasks();
  }
}

// EDIT MODAL
function openEdit(index) {
  editIndex = index;
  document.getElementById("editTaskInput").value = tasks[index].task;
  document.getElementById("editModal").style.display = "block";
}

function saveEdit() {
  let newTask = document.getElementById("editTaskInput").value;
  tasks[editIndex].task = newTask;

  localStorage.setItem("tasks", JSON.stringify(tasks));
  closeModal();
  applySearchAndFilter();
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

// CLEAR INPUT
function clearInputs() {
  document.getElementById("name").value = "";
  document.getElementById("task").value = "";
  document.getElementById("time").value = "";
  document.getElementById("address").value = "";
}

// INIT
window.onload = () => applySearchAndFilter();