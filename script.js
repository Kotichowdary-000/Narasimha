const STORAGE = "attendanceHistory_v1";

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

document.getElementById("date").innerText =
  "Today: " + new Date().toLocaleDateString();

let history = JSON.parse(localStorage.getItem(STORAGE)) || [];

const historyBody = document.getElementById("historyBody");

function updateCounts() {
  const present = history.filter(h => h.status === "present").length;
  const absent = history.filter(h => h.status === "absent").length;

  document.getElementById("presentCount").innerText = present;
  document.getElementById("absentCount").innerText = absent;

  const today = todayISO();
  const todayEntry = history.find(h => h.date === today);

  document.getElementById("presentPreview").innerText =
    todayEntry?.status === "present" ? "✓" : "—";

  document.getElementById("absentPreview").innerText =
    todayEntry?.status === "absent" ? "✓" : "—";
}

function renderHistory() {
  historyBody.innerHTML = "";
  const emptyMsg = document.getElementById("emptyMsg");

  if (history.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  [...history].reverse().forEach(entry => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.date}</td>
      <td class="status">${entry.status}</td>
      <td class="actions">
        <button onclick="removeEntry('${entry.date}','${entry.status}')">Delete</button>
      </td>
    `;
    historyBody.appendChild(tr);
  });
}

function removeEntry(date, status) {
  history = history.filter(h => !(h.date === date && h.status === status));
  localStorage.setItem(STORAGE, JSON.stringify(history));
  renderHistory();
  updateCounts();
}

function mark(status) {
  const today = todayISO();

  if (history.some(h => h.date === today)) {
    alert("Attendance already marked today.");
    return;
  }

  history.push({ date: today, status });
  localStorage.setItem(STORAGE, JSON.stringify(history));

  renderHistory();
  updateCounts();
  alert("Marked: " + status.toUpperCase());
}

document.getElementById("presentCard").onclick = () => mark("present");
document.getElementById("absentCard").onclick = () => mark("absent");

document.getElementById("clearBtn").onclick = () => {
  if (!confirm("Clear entire history?")) return;
  history = [];
  localStorage.removeItem(STORAGE);
  renderHistory();
  updateCounts();
};

document.getElementById("exportBtn").onclick = () => {
  if (history.length === 0) return alert("No data to export.");

  let csv = "date,status\n";
  history.forEach(entry => csv += `${entry.date},${entry.status}\n`);

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "attendance.csv";
  a.click();
};

renderHistory();
updateCounts();
