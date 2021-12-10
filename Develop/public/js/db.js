let db;
// creat a new db request
const request = indexedDB.open("budget, 1");

request.onupgradeneeded = function (e) {
  const db = e.target.result; // create object store called "pending"
  db.creatObjectStore("pending", { autoIncrement: true });
};

if (navigator.onLine) {
  checkDatabase(); // check to see if app is online before reading from db
}

request.onerror = function (event) {
  console.log("Woops! " + event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite"); // create transaction on pending db
  const store = transaction.objectStore("pending"); // access pending transation
  store.add(record); // add record to your store
}

function checkDatabase() {
  const transaction = db.transaction(["pending"], "readwrite"); // open a transaction on your pending db
  const store = transaction.objectStore("pending");
  const getAll = store.getAll(); // get all records from store

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      });
      then((response) => response.json()).then(() => {
        const transaction = db.transaction(["pending"], "readwrite");

        const store = transaction.objectStore("pending");

        store.clear();
      });
    }
  };
}

window.addEventListener("online", checkDatabase);
