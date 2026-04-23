const validateTiles = () => {
    const tile_container = document.querySelector(".tiles_game");
    for (let i = 0; i < 16; i++) {
        let tile_g = document.querySelector(`#tile-g-${i}`);
        if (tile_g.children.length === 0) {
            console.log(`Kafelek ${i} jest pusty. Przerywam dalsze sprawdzanie.`);
            return;
        }
        if (tile_g.id.split("-").pop() !== tile_g.children[0].id.split("-").pop()) {
            console.log(`Kafelek ${i} jest błędny. Przerywam dalsze sprawdzanie.`);
            return;
        }
    }

    if (Notification.permission === "granted") {
        new Notification("Puzzle rozwiązane!", {
            body: "Gratulacje! Udało Ci się ułożyć puzzle.",
        });
    }

    console.log(`Puzzle rozwiązane.`);
    setTimeout(() => {
        alert("Gratulacje! Udało Ci się ułożyć puzzle.");
    }, 100);
}

const createTiles = () => {
    //Create draggable tiles
    const tiles = document.querySelector(".tiles");
    const tile_container = document.querySelector(".tiles_game");

    if(tiles.children.length > 0) {
        return;
    }

    let sequence = Array.from({length: 16}, (v, k) => k);

    for (let i = sequence.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
    }

    for (let i = 0; i < 16; i++) {
        const randomID = sequence[i];
        const tile = document.createElement("canvas");
        tile.height = 75;
        tile.width = 150;
        tile.classList.add("tile");
        tile.draggable = true;
        tile.id = `tile-${randomID}`;
        tile.addEventListener("dragstart", function (event) {
            event.dataTransfer.setData("text/plain", randomID);
        });
        tiles.appendChild(tile);

        const tile_g = document.createElement("div");
        tile_g.classList.add("tile");
        tile_g.id = `tile-g-${i}`;

        tile_g.addEventListener("dragenter", function (event) {
            // this.style.border = "1px solid black";
        });
        tile_g.addEventListener("dragexit", function (event) {
            this.style.border = "1px solid rgba(0, 0, 0, 0.1);";
        });
        tile_g.addEventListener("dragover", function (event) {
            event.preventDefault();
        });
        tile_g.addEventListener("drop", function (event) {
            if(this.children.length > 0) {
                return;
            }
            let myElement = document.querySelector(`#tile-${event.dataTransfer.getData("text")}`);
            this.appendChild(myElement)
            this.style.border = "1px solid rgba(0, 0, 0, 0.1);";

            validateTiles();
        }, false);

        tile_container.appendChild(tile_g);
    }
}


//MAP
let map = L.map('map').setView([53.430127, 14.564802], 18);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");
document.getElementById("saveButton").addEventListener("click", function() {

    if ("Notification" in window) {
        if (Notification.permission === "default") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    console.log("Zgoda na powiadomienia.");
                }
            });
        }
    }

    createTiles();

    leafletImage(map, function (err, canvas) {
        // here we have the canvas
        let rasterMap = document.getElementById("rasterMap");
        let rasterContext = rasterMap.getContext("2d");

        rasterContext.drawImage(canvas, 0, 0, 600, 300);

        for (let i = 0; i < 16; i++) {
            let tile = document.getElementById(`tile-${i}`);
            let x = (i % 4) * 150;
            let y = Math.floor(i / 4) * 75;

            let tileContext = tile.getContext("2d");
            tileContext.drawImage(canvas, x, y, 150, 75, 0, 0, 150, 75);
        }
        
        // rasterContext.drawImage(canvas, 0, 0, 150, 75, 0, 0, 150, 75);
    });
});

document.getElementById("getLocation").addEventListener("click", function(event) {
    if (! navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);
    }, positionError => {
        console.error(positionError);
    });
});