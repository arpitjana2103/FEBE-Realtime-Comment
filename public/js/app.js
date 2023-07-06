const socket = io();
const textarea = document.querySelector('#textarea');
const submitBtn = document.querySelector('#submitbtn');
const commentBox = document.querySelector('.comment__box');
const typingDiv = document.querySelector('.typing');

let userName = null;
do {
    userName = prompt('Enter your name');
} while (!userName);


socket.on('comment', function (comData) {
    appendComment(comData);
});

socket.on('typing', function (comData) {
    typingDiv.innerText = `${comData.userName} is typing...`;
    debounce(function () {
        typingDiv.innerText = null;
    }, 2000);
});

// Load All Comments
document.addEventListener('DOMContentLoaded', async function () {
    const response = await fetch('/api/comments', {method: 'GET'});
    const result = await response.json();
    result.comments.forEach(function(comData){
        console.log(comData);
        appendComment(comData);
    });
});

// Submit Comment
submitBtn.addEventListener('click', function (e) {
    e.preventDefault();
    let comment = textarea.value;
    if (!comment) return;
    const comData = {userName, comment};
    appendComment(comData);
    broadcastComment(comData);
    syncWithDB(comData);
    textarea.value = null;
});

textarea.addEventListener('keyup', function () {
    broadcastTyping({userName});
});

function appendComment(comData) {
    const liTag = document.createElement('li');
    liTag.className = 'comment mb-3';
    const markUp = `
    <div class="card border-light mb-3">
        <div class="card-body">
            <h6>${comData.userName}</h6>
            <p>${comData.comment}</p>
            <div>
                <small>${moment(comData.time).format('LT')}</small>
            </div>
        </div>
    </div>
    `;

    liTag.innerHTML = markUp;
    commentBox.prepend(liTag);
}

function broadcastComment(comData) {
    socket.emit('comment', comData);
}

function broadcastTyping(comData) {
    socket.emit('typing', comData);
}

// DeBounce
let timerID = null;
function debounce(func, timer) {
    if (timerID) {
        clearTimeout(timerID);
    }
    timerID = setTimeout(function () {
        func();
    }, timer);
}

// Sync with DB
async function syncWithDB(comData) {
    const headers = {
        'Content-Type': 'application/json',
    };
    const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify(comData),
        headers,
    });
    const result = await response.json();
    console.log(result);
}

