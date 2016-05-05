// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
//chrome.extension.onMessage.addListener(
//  function(request, sender, sendResponse) {
//  	chrome.pageAction.show(sender.tab.id);
//    sendResponse();
//  });

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({'url': chrome.extension.getURL('src/timer/www/index.html')}, function(tab) {
    console.log('Background');
    // Tab opened.
    // itemType = TASK || 101_ERROR
    // effortSpent = "00:20"
    // loggedTime = "05/05/2016 13:11"
    var logTime = function(itemType, taskId, effortSpent, loggedTime) {

      var inTicket = false;
      if (inTicket) {
        window.frames.remoteCommand.updateEffortSpend([{
          name: "loggedTime",
          value: loggedTime
        }, {
          name: "taskId",
          value: taskId
        }, {
          name: "effortSpent",
          value: effortSpent
        }, {
          name: "itemType",
          value: itemType
        },
          {
            name: "comment",
            value: comment
          }, {
            name: "userId",
            value: userId
          }
        ]);
      }
      else {
        headerScope.updateInlineEffortSpend(taskId, itemType, loggedTime,  effortSpent, "", "");
      }
    };


  });
});
