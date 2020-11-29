// let changeColor = document.getElementById('changeColor');
//
// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });
//
// changeColor.onclick = function(element) {
//     let color = element.target.value;
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       chrome.tabs.executeScript(
//           tabs[0].id,
//           {code: 'document.body.style.backgroundColor = "' + color + '";'});
//     });
//   };

function executeScript (tab) {
    chrome.tabs.executeScript(null, {file: "inject.js"});
}


function main() {
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('alertButton').addEventListener('click', executeScript);
    });
}

main()
