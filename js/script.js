const searchBtn = document.getElementById('search-button').addEventListener("click", getData);

const pictureContainer = document.getElementById("picture-container");

const errorMsg = document.createElement("div").innerHTML = "Try again!";

const input = document.getElementById("search-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById('search-button').click();
    }
});

function getData() {
    const input = document.getElementById("search-input");
    if(input.value == ""){
        if(pictureContainer.innerHTML !== ""){
            pictureContainer.innerHTML = "";
        }
        pictureContainer.append(errorMsg);
        return;
    }
    let loader = document.createElement("div");
    loader.className = "square el";
    if (pictureContainer.innerHTML !== "") {
        pictureContainer.innerHTML = '';
        pictureContainer.append(loader);
    }
    displayLoading(true);
    setTimeout(fetchDataFromApi, 2000)
    
}

async function fetchDataFromApi() {
    const input = document.getElementById("search-input");
    const dropDownFilters = document.getElementById("filters")
    const dropDownAmount = document.getElementById("numbers")
    let selectedValueFromDropDown = dropDownFilters.value;
    let selectedValueFromAmount = dropDownAmount.value;
 
    pictureContainer.innerHTML = '';
    let searchPhrase = input.value;

    let apiUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=3711549301e595f9af88b2a73ba3a0aa&text=${searchPhrase}&sort=${selectedValueFromDropDown}&per_page=${selectedValueFromAmount}=&format=json&nojsoncallback=1`;

    await fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => appendDataToDom(data))
        .then(function () {
            displayLoading(false)
        });
    
}

function appendDataToDom(data) {
    if(data.photos.length < 0){
        pictureContainer.append(errorMsg);
        return;
    }
    data.photos.photo.forEach(photo => {
        let div = document.createElement("div");
        let img = document.createElement("img");
        let size = Array.from(document.getElementsByName("flexRadioDefault")).find(r => r.checked).value;
        img.src = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`
        div.append(img);
        pictureContainer.append(div);
    });
};

function displayLoading(doDisplay) {
    if (doDisplay) {
        anime({
            targets: '.el',
            rotate: {
                value: 360,
                duration: 1800,
                easing: 'easeInOutSine'
            },
            scale: {
                value: 2,
                duration: 1600,
                delay: 800,
                easing: 'easeInOutQuart'
            },
            delay: 250
        });
    }
};