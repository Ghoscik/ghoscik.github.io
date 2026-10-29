const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function changeOnClick(task, changeTo, type="text") {

    task.addEventListener("click", () => {
      const input = document.createElement(changeTo);
      input.type = type;
      input.value = task.textContent;
      if(type === "date")
      {
        input.value = new Date(input.value).toISOString().split("T")[0];
        input.setAttribute("min", input.value);
      }
      task.replaceWith(input);

      const handleDocumentClick = (event) => {
        if (!input.contains(event.target)) {
          task.textContent = input.value;
          input.replaceWith(task);

          const taskItem = task.closest(".task_item");
          const allTasks = document.querySelectorAll(".task_item:not(.hidden)");
          const index = Array.from(allTasks).indexOf(taskItem);

          if (type === "date")
            tasks[index].date = input.value;

          else
            tasks[index].name = input.value;

          saveToLocal();
          document.removeEventListener("click", handleDocumentClick);
        }
      };

      setTimeout(() => {
        document.addEventListener("click", handleDocumentClick);
      }, 0);
    });
}
function removeTask(task) {
  const taskItem = task.closest(".task_item");

  const allTasks = document.querySelectorAll(".task_item:not(.hidden)");
  const index = Array.from(allTasks).indexOf(taskItem);

  tasks.splice(index, 1);
  saveToLocal();
  taskItem.remove();
}

function addTask() {

  const newTask = {
    name: document.querySelector(".task_add").value,
    date: document.querySelector(".task_date").value
  };

  tasks.push(newTask);
  saveToLocal();

  drawTasks();
}

function drawTasks()
{
  const newElement = document.querySelector(".task_item.hidden").cloneNode(true);
  newElement.classList.remove("hidden");

  newElement.querySelector(".span_name").textContent = document.querySelector(".task_add").value;
  newElement.querySelector(".span_date").textContent = document.querySelector(".task_date").value;

  document.querySelector(".task_list").appendChild(newElement);
  document.querySelector(".task_add").value = "";

  changeOnClick(newElement.querySelector(".span_name"), "input", "text");
  changeOnClick(newElement.querySelector(".span_date"), "input", "date");
}
function saveToLocal()
{
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  tasks.forEach((task) => {
    const newElement = document.querySelector(".task_item.hidden").cloneNode(true);
    newElement.classList.remove("hidden");

    newElement.querySelector(".span_name").textContent = task.name;
    newElement.querySelector(".span_date").textContent = task.date;

    document.querySelector(".task_list").appendChild(newElement);

    changeOnClick(newElement.querySelector(".span_name"), "input", "text");
    changeOnClick(newElement.querySelector(".span_date"), "input", "date");
  });
}

function searchTasks() {
  const searchBar = document.querySelector(".task_search");

  const query = searchBar.value.trim();
  const taskItems = document.querySelectorAll(".task_item:not(.hidden)");

  taskItems.forEach((task) => {
    const spanName = task.querySelector(".span_name");

    const originalText = spanName.textContent;

    if(query.length < 2) {
      task.style.display = "";
      spanName.textContent = originalText;
    }
    else if (originalText.toLowerCase().includes(query.toLowerCase())) {
        task.style.display = "";
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(${escaped})`, "gi");
        spanName.innerHTML = originalText.replace(regex, `<mark style="background-color: #ffe066;">$1</mark>`);
    } else {
      task.style.display = "none";
    }



  });
}


let today = new Date().toISOString().split("T")[0];
let dateInput = document.querySelector(".task_date");
dateInput.setAttribute("min", today);
dateInput.value = today;

loadTasks();

const searchBar = document.querySelector(".task_search");
if (searchBar) {
  searchBar.addEventListener("input", searchTasks);
}
