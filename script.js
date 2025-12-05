document.getElementById("date").textContent =
  "Today: " + new Date().toLocaleDateString();

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function load(student) {
  return JSON.parse(localStorage.getItem("att_" + student)) || [];
}

function save(student, data) {
  localStorage.setItem("att_" + student, JSON.stringify(data));
}

function updateUI(card, history, student) {
  card.querySelector(".present-count").textContent =
    history.filter(x => x.status === "present").length;

  card.querySelector(".absent-count").textContent =
    history.filter(x => x.status === "absent").length;

  const tbody = card.querySelector(".history-body");
  tbody.innerHTML = "";

  history.forEach((entry, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.status}</td>
      <td><button class="delete-btn" data-id="${i}">X</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = () => {
      const index = btn.dataset.id;
      history.splice(index, 1);
      save(student, history);
      updateUI(card, history, student);
    };
  });
}

document.querySelectorAll(".student-card").forEach(card => {
  const student = card.id;
  let history = load(student);

  updateUI(card, history, student);

  card.querySelector(".present-btn").onclick = () => {
    const today = todayISO();
    if (history.some(x => x.date === today)) {
      alert("Already marked today!");
      return;
    }
    history.push({ date: today, status: "present" });
    save(student, history);
    updateUI(card, history, student);
  };

  card.querySelector(".absent-btn").onclick = () => {
    const today = todayISO();
    if (history.some(x => x.date === today)) {
      alert("Already marked today!");
      return;
    }
    history.push({ date: today, status: "absent" });
    save(student, history);
    updateUI(card, history, student);
  };
});
