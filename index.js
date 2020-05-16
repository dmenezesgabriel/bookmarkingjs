// ecmascript-6 module
import config from './config.js'


const body = document.body;
const input = document.querySelector('input[type=text]');
const overlay = document.querySelector('.overlay');


// Add a class with different css formatting to cause effects
function showFloater() {
    body.classList.add('show-floater');
}


function closeFloater() {
    if(body.classList.contains("show-floater")) {
        body.classList.remove('show-floater');
    }
}


// Check W3school for events reference
input.addEventListener('focusin', showFloater);
input.addEventListener('focusout', closeFloater);
overlay.addEventListener('click', closeFloater);


// Bookmarks

// Array of html links
const bookmarksList = document.querySelector('.bookmarks-list');
const bookmarkForm = document.querySelector('.bookmark-form');
const bookmarkInput = bookmarkForm.querySelector('input[type=text]');
// Array of Objects
// Check if localStorage already have values
const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
//Get credentials from config file
const apiUrl = config.apiUrl
const appId = config.appId


// Fill the list on application first load
fillBookmarksList(bookmarks);

function createBookmark(events) {
    events.preventDefault();

    if(!bookmarkInput.value) {
        alert('No text input, please tell me whats on your mind')
    }
    const url = encodeURIComponent(bookmarkInput.value);

    // Make API's request
    fetch(`${apiUrl}/${url}?app_id=${appId}`)
        // This returns a pending promise
        .then(response => response.json())
        //  This returns the data of the promisse
        .then(data => {
            const bookmark = {
                title: data.hybridGraph.title,
                image: data.hybridGraph.image,
                link: data.hybridGraph.url
            };
            console.log(`Creating bookmark ${bookmark.title}`);

            // Send an item to bootkmarks array, the same as append in python
            bookmarks.push(bookmark);

            // Generates a new Html's link list for every bookmark added
            fillBookmarksList(bookmarks);

            // Store the bookmarks into local storage
            storeBookmarks(bookmarks);

            // Clear text input
            bookmarkForm.reset();

            console.log(`Bookmark ${bookmark.title} created`);
            console.table(bookmarks);
        })
        .catch(error => {
            alert(`There was a problem getting info! Error ${error}`);
        });
}


function fillBookmarksList(bookmarks = []) {
    // Generates the bookmark's html elements from an array of bookmarks
    const bookmarksHtml = bookmarks.map((bookmark, i) => {
        return `
            <a href="${bookmark.link}" class="bookmark" data-id="${i}" target="_blank">
                <div class="img" style="background-image:url('${bookmark.image}')"></div>
                <div class="title">${bookmark.title}</div>
                <svg class="bi bi-x-circle" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm0 1A8 8 0 108 0a8 8 0 000 16z" clip-rule="evenodd"/>
                    <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z" clip-rule="evenodd"/>
                    <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z" clip-rule="evenodd"/>
                </svg>
            </a>
        `;
    // Join the objects of the lis together
    }).join('');

    // overwrite the empty array with the generated values
    bookmarksList.innerHTML = bookmarksHtml;
}


function removeBookmark(event) {
    if(!event.target.matches('.bi-x-circle')) return;

    // Prevent the redirect
    event.preventDefault();

    // Get the clicked object
    const index = event.target.parentNode.dataset.id;

    // Remove it
    bookmarks.splice(index, 1);

    // Fill the list again
    fillBookmarksList(bookmarks);

    // Store into localStorage
    storeBookmarks(bookmarks);

}


function storeBookmarks(bookmarks = []) {
    // Transform the json object into a string and store
    // in the local storage (F12 -> Application -> Local Storage)
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}


bookmarkForm.addEventListener('submit', createBookmark);
bookmarksList.addEventListener('click', removeBookmark);


// Notes
//
// console.dir(); it's similar to pythons dir()
// Scrape the page source meta
// OpenGraph.io API
// onloadwff.js:71 error is due to lastpass or another chrome extension,
// it does not impact the project