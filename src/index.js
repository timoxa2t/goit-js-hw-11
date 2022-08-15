import axios from 'axios';
import Notiflix from 'notiflix';

const containerEl = document.querySelector(".gallery")
const searchEl = document.querySelector(`input[name="searchQuery"]`)

const searchBtn = document.querySelector(`button[type="submit"]`)
const loadMoreBtn = document.querySelector(`.load-more`)
loadMoreBtn.toggleAttribute("hidden")
let mPage = 1

searchBtn.addEventListener("click", (event) => {
    event.preventDefault()
    containerEl.textContent = ""
    mPage = 1
    updateView()
    loadMoreBtn.removeAttribute("hidden")
})

loadMoreBtn.addEventListener("click", (event) => {
    updateView()
})

async function updateView(){
    const searchText = searchEl.value
    const data = await sendRequest(searchText, mPage++)
    console.log(data)
    if(data.hits && data.hits.length > 0){
        createCards(data.hits)
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
    
   const params = new URLSearchParams({
        key: "29290264-6b96edcd60ed9fd64e47be52c",
        q: queryText, 
        image_type: "photo",
        orientation: "horizontal",
        safesearch: false, 
        per_page: 20, 
        page: page
   })

   const url = "https://pixabay.com/api?" + params

   return axios.get(url)
    .then((res) => res.data)
    .catch(err => err)
}