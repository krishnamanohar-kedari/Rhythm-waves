let inputValue = document.getElementById("inputValue");
let container = document.getElementById("container");
let searchButton = document.getElementById("searchBtn");
let spinner = document.getElementById("spinner");

spinner.style.display = "none";

let searchValue = "";

function createMusicCard(each) {
    let musicItem = document.createElement("div");
    musicItem.classList.add("music-card");
    container.appendChild(musicItem);

   
    let songImageTag = document.createElement("img");
    songImageTag.classList.add("song-image");
    let coverUrl = each.artworkUrl100 ? each.artworkUrl100.replace("100x100", "300x300") : "https://picsum.photos/300/300";
    songImageTag.src = coverUrl;
    songImageTag.alt = each.trackName || "Song Cover";
    musicItem.appendChild(songImageTag);

   
    let songTitleTag = document.createElement("h3");
    songTitleTag.classList.add("song-title");
    songTitleTag.textContent = each.trackName || "Untitled Song";
    musicItem.appendChild(songTitleTag);

   
    let songTextTag = document.createElement("p");
    songTextTag.classList.add("song-text");
    let artistName = each.artistName ? each.artistName : "Unknown Artist";
    songTextTag.textContent = artistName;
    musicItem.appendChild(songTextTag);

    
    let audioTag = document.createElement("audio");
    audioTag.controls = true;
    audioTag.preload = "metadata";
    audioTag.src = each.previewUrl;
    audioTag.classList.add("audio-tag-styling");

    musicItem.appendChild(audioTag);
}

function displayResults(songs) {
    container.replaceChildren();

    if (!songs || songs.length === 0) { //vs code modification
        container.innerHTML = "<p style='text-align: center; width: 100%; color: #b0bec5;'>No songs found. Try searching for something else!</p>";
        return;
    }

    for (let each of songs) {
        if (each.previewUrl) {
            createMusicCard(each);
        }
    }
}

function fetchSongsByQuery(query) { //function to fetch songs based on the search query
    spinner.style.display = "flex";

    let url = "https://itunes.apple.com/search?term=" + encodeURIComponent(query) + "&media=music&limit=12";

    fetch(url)
        .then(function(response) {
            if (!response.ok) throw new Error("Network response not ok");
            return response.json();
        })
        .then(function(data) {
            spinner.style.display = "none";
            if (data && data.results && data.results.length > 0) {
                displayResults(data.results);
            } else {
                container.innerHTML = "<p style='text-align: center; width: 100%; color: #b0bec5;'>No songs found for '" + query + "'.</p>";
            }
        })
        .catch(function(error) {
            spinner.style.display = "none";
            console.error("Fetch failed:", error);//extra modification suggested by chatgpt
            container.innerHTML = "<p style='text-align: center; width: 100%; color: #ff6b6b;'>Failed to load music.</p>";
        });
}

function searchMusic() {
    searchValue = inputValue.value.trim();

    if (searchValue === "") {
        alert("Please enter a song name");
        return;
    }

    fetchSongsByQuery(searchValue);
    inputValue.value = "";
}

function searchElement(event) {
    if (event.key === "Enter") {
        searchMusic();
    }
}


searchButton.addEventListener("click", searchMusic);
inputValue.addEventListener("keydown", searchElement);


window.addEventListener("DOMContentLoaded", function() {
    fetchSongsByQuery("Top Hits");// Fetch and display top hits on page load(extra modification suggested by chatgpt)
});