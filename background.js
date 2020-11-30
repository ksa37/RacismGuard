function updatePopup() {
    if (chrome.storage.local.get("signed_in", function(data) {
        if (data.signed_in)
            return
        else {
            chrome.browserAction.setPopup({
                popup: 'popup.html'
            }, () => {
                location.href = "popup.html"
            });
        }
    }));
}
