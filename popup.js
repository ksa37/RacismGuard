

function signupPledge() {
    chrome.storage.local.set({signed_in: true});
    chrome.browserAction.setPopup({
        popup: 'main-feed.html'
    }, () => {
        location.href = "main-feed.html";
    });
}


//TODO:
// 1. save accountID to local storage
// 2.Send accountID to python server by XMLHttpRequest in JSON


function main() {
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('startButton').addEventListener('click', signupPledge);
    });
}

main();
