
function signoutPledge() {
    chrome.storage.local.set({signed_in: false});

    chrome.browserAction.setPopup({
        popup: "popup.html"
    }, () => {
        location.href = "popup.html"
    });

}

//TODO:
// 1. Show list of "racism remarks" by:
//   -   Fetch JSON from python server
//   -   Parse JSON
//


function main() {
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('signoutButton').addEventListener('click', signoutPledge);
    });
}

main();
