let db;

const request = indexedDB.open("budget, 1");

request.onupgradeneeded = function (e) {
  const db = e.target.result;
  db.creatObjectStore("pending", { autoIncrement: true });
};

if (navigator.onLine) {
  checkDatabase();
}

request.onerror = function (event) {
  console.log("Woops! " + event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  store.add(record);
}
