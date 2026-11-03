const locateBtn = document.querySelector("#locate-btn");
const downloadMapBtn = document.querySelector("#download-map-btn");
const unsolvedContainer = document.querySelector("#unsolved-puzzles");
const puzzleCanvas = document.querySelector("#puzzle-canvas");
let userMarker = null;

const map = L.map('panel--map').setView([51.1079, 17.0385], 13);

if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  crossOrigin: true,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

locateBtn.addEventListener("click", getCurrentLocation);

unsolvedContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
});

unsolvedContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  const draggedId = e.dataTransfer.getData("text/plain");
  const draggedElement = document.getElementById(draggedId);

  if (draggedElement?.classList.contains("tile")) {
    unsolvedContainer.appendChild(draggedElement);
    checkPuzzleCompletion();
  }
});

downloadMapBtn.addEventListener("click", () => {
  leafletImage(map, (err, canvasResult) => {
    const rows = parseInt(document.querySelector("#rows").value);
    const cols = parseInt(document.querySelector("#columns").value);

    const tiles = [];

    unsolvedContainer.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    unsolvedContainer.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
    puzzleCanvas.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    puzzleCanvas.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;

    unsolvedContainer.innerHTML = '';
    puzzleCanvas.innerHTML = '';

    createTargetTiles(rows * cols);

    divideBoard(canvasResult, tiles, rows, cols);

    renderPuzzles(tiles);
  });
});

function geoError(error) {
  console.error("Błąd geolokalizacji:", error.message);
  alert("Nie udało się pobrać Twojej lokalizacji.");
}

function getCurrentLocation() {
  if (!navigator.geolocation) {
    window.alert("Twoja przeglądarka nie obsługuje geolokalizacji");
    return;
  }

  const options = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 99999
  };

  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, options);
}

function geoSuccess(position) {
  const lon = position.coords.longitude;
  const lat = position.coords.latitude;
  const coords = [lat, lon];
  map.setView(coords, 16);

  if (userMarker) {
    userMarker.setLatLng(coords);
  } else {
    userMarker = L.marker(coords).addTo(map);
  }
}
function divideBoard(canvasResult, tiles, rows, cols) {
  const tileWidth = canvasResult.width / cols;
  const tileHeight = canvasResult.height / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const onePiece = document.createElement('canvas');
      onePiece.width = tileWidth;
      onePiece.height = tileHeight;
      const ctxOnePiece = onePiece.getContext('2d');

      ctxOnePiece.drawImage(
        canvasResult,
        c * tileWidth, r * tileHeight,
        tileWidth, tileHeight,
        0, 0,
        tileWidth, tileHeight
      );

      tiles.push({
        dataUrl: onePiece.toDataURL(),
        correctIndex: r * cols + c
      });
    }
  }
}

function createTargetTiles(tilesCount) {
  for (let i = 0; i < tilesCount; i++) {
    const dropZone = document.createElement('span');
    dropZone.dataset.slotIndex = i;

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData('text/plain');
      const draggedElement = document.getElementById(draggedId);

      if (dropZone.children.length === 0) {
        dropZone.appendChild(draggedElement);

        const elementIndex = draggedElement.dataset.correctIndex;
        const slotIndex = dropZone.dataset.slotIndex;

        console.debug(`Element ${elementIndex} do pola ${slotIndex}`);
        checkPuzzleCompletion();
      }
    });

    puzzleCanvas.appendChild(dropZone);
  }
}
function renderPuzzles(tiles) {
  const shuffledTiles = [...tiles].sort(() => Math.random() - 0.5);

  shuffledTiles.forEach((tile, index) => {
    const piece = document.createElement('div');
    piece.classList.add('tile');
    piece.draggable = true;
    piece.id = `tile-${index}`;
    piece.dataset.correctIndex = tile.correctIndex;

    piece.style.backgroundImage = `url(${tile.dataUrl})`;
    piece.style.backgroundSize = 'cover';
    piece.style.width = '100%';
    piece.style.height = '100%';

    piece.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", e.target.id);
    });

    unsolvedContainer.appendChild(piece);
  });
}

function checkPuzzleCompletion() {
  const slots = puzzleCanvas.querySelectorAll('span');
  let isComplete = true;

  if (slots.length === 0) return;

  slots.forEach((slot, index) => {
    const tile = slot.querySelector('.tile');
    if (!tile || parseInt(tile.dataset.correctIndex) !== index)
      isComplete = false;

  });

  if (isComplete) {
    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification("Gratulacje!", {
          body: "Pomyślnie ułożyłeś całą mapę z puzzli!",
        });
      } else {
        alert("Gratulacje! Pomyślnie ułożyłeś mapę!");
      }
    }, 100);
  }
}
