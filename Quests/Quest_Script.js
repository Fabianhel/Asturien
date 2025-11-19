$(document).ready(function () {

	document.getElementById("close-btn").addEventListener("click", function () {
		window.parent.postMessage("#Quest-info-container", "*");
	});

	load();

});


const DB_NAME = "QuestDB";
const STORE_NAME = "QuestList";

// Öffnet oder erstellt die Datenbank
function openDB(callback) {
	const request = indexedDB.open(DB_NAME, 2);

	request.onupgradeneeded = function (event) {
		const db = event.target.result;
		if (!db.objectStoreNames.contains(STORE_NAME)) {
			db.createObjectStore(STORE_NAME, { autoIncrement: true });
		}
	};

	request.onsuccess = function (event) {
		const db = event.target.result;
		callback(db);
	};

	request.onerror = function () {
		console.error("Fehler beim Öffnen der IndexedDB.");
	};
}

// Speichert die Eingaben als XML
function save() {
	const name = document.getElementById("Quest-name").value;
	const description = document.getElementById("Quest-description").value;


const xml = `
<Quest>
  <name>${name}</name>
  <description>${description}</description>
</Quest>
`.trim();

	openDB(function (db) {
		const tx = db.transaction(STORE_NAME, "readwrite");
		const store = tx.objectStore(STORE_NAME);
		store.add({ xml });

		tx.oncomplete = function() {
			alert("Quest wurde gespeichert!");
			load();
		};
	});
}



// Lädt die XML-Daten und füllt die Felder
function load() {
	openDB(function (db) {
		const tx = db.transaction(STORE_NAME, "readonly");
		const store = tx.objectStore(STORE_NAME);
		const request = store.openCursor();

		const tbody = document.querySelector("#datenTabelle tbody");
		tbody.innerHTML = "";

		request.onsuccess = function (event) {
			const cursor = event.target.result;
			if (cursor) {
				const xml = cursor.value.xml;
				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(xml, "application/xml");

				const name = xmlDoc.querySelector("name")?.textContent || "";
				const description = xmlDoc.querySelector("description")?.textContent || "";


				console.log(xml);
				console.log(xmlDoc);
				console.log("Name:", name);
				console.log("Beschreibung:", description);


				const row = document.createElement("tr");
				row.innerHTML = `<td>${name}</td><td>${description}</td>`;
				tbody.appendChild(row);

				cursor.continue();
			}
		};
	});
}