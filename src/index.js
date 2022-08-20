import axios from 'axios';
import Notiflix from 'notiflix';

const containerEl = document.querySelector(".gallery")
const searchEl = document.querySelector(`input[name="searchQuery"]`)

const searchBtn = document.querySelector(`button[type="submit"]`)
const loadMoreBtn = document.querySelector(`.load-more`)
loadMoreBtn.toggleAttribute("hidden")

let searchText = ""

const baseURL = "https://pixabay.com/api/?"

const queryParams = new URLSearchParams({
    key: "29290264-6b96edcd60ed9fd64e47be52c",
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true, 
    per_page: 40, 
    page: 1
})

searchBtn.addEventListener("click", (event) => {
    event.preventDefault()
    containerEl.textContent = ""
    searchText = searchEl.value.trim()
    if(searchText){
        queryParams.set("page", 1)
        updateView()
    }else{
        loadMoreBtn.setAttribute("hidden", true)
        Notiflix.Notify.warning("Search query is empty");
    }
})

loadMoreBtn.addEventListener("click", (event) => {
    nextPage()
    updateView()
})

async function updateView(){
    const data = await sendRequest(searchText)

    if(data.hits && data.hits.length > 0){
        searchEl.value = ""
        createCards(data.hits)
        if(data.totalHits <= queryParams.get("per_page") * queryParams.get("page")){
            loadMoreBtn.setAttribute("hidden", true)
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }else{
            loadMoreBtn.removeAttribute("hidden")
        }
    }else{
        loadMoreBtn.setAttribute("hidden", true)
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
}

function createCards(imgData){
    const cards = imgData.map(({webformatURL, largeImageURL, tags, comments, downloads, likes, views}) => `
    <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
        <div class="info">
            <p class="info-item">
            <b>Likes</b>
            ${likes}
            </p>
            <p class="info-item">
            <b>Views</b>
            ${views}
            </p>
            <p class="info-item">
            <b>Comments</b>
            ${comments}
            </p>
            <p class="info-item">
            <b>Downloads</b>
            ${downloads}
            </p>
        </div>
        </div>
    `).join("")
    containerEl.insertAdjacentHTML("beforeend", cards)
}

function sendRequest(queryText, page){

    queryParams.set('q', queryText)
    console.log(queryParams.toString())

    const url = baseURL + queryParams

    return axios.get(url)
        .then((res) => res.data)
        .catch(err => err)
}

function nextPage(){
    queryParams.set('page', parseInt(queryParams.get("page")) + 1)
}