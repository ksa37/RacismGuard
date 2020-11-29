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

function start() {
    chrome.tabs.executeScript({file: "inject.js"});
    console.log("done");
}


function main() {
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('alertButton').addEventListener('click', start);
    });
}

main()
