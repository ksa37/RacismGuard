chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("Hello World");
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'developer.chrome.com'},
          })
          ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
  });

// chrome.webRequest.onBeforeRequest.addListener(
//     function(details) {
//         details.requestBody.formData.status="Change the tweet";
//         console.log(details.url);
//         if(details.method === "POST") {
//             console.log(details.requestBody.formData);
//
//             if(details.requestBody.formData.status!==null && details.requestBody.formData.status!==undefined ){
//                 console.log(details.requestBody.formData.status);
//             }
//         }
//     },
//     {urls: ["<all_urls>"]},
//     ["requestBody"]
//);
