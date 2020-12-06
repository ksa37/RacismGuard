
function signoutPledge() {
    chrome.storage.local.set({signed_in: false});

    chrome.browserAction.setPopup({
        popup: "popup.html"
    }, () => {
        location.href = "popup.html"
    });

}

function gotoURL() {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.update(tab.id, {url: 'http://twitter.com/racismguard/status/1333606092849377280?s=20'});
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
        document.getElementById('gotoURL').addEventListener('click', gotoURL);

    });
}

main();
