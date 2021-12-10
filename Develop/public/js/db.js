let db;

const request = indexedDB.open("budget, 1");

request.onupgradeneeded = function (e) {
  const db = e.target.result;
  db.creatObjectStore("pending", { autoIncrement: true });
};
