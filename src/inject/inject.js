(function() {

  // Log time
  // ---------
  // itemType = TASK || 101_ERROR
  // effortSpent = "00:20"
  // loggedTime = "05/05/2016 13:11"
  var logTime = function(itemType, taskId, effortSpent, loggedTime) {

    headerScope.updateInlineEffortSpend(taskId, itemType, loggedTime,  effortSpent, "", "");

  };

  // Init


  chrome.extension.sendMessage({}, function(response) {
    var execute = function (body) {
      if(typeof body === "function") { body = "(" + body + ")();"; }
      var el = document.createElement("script");
      el.textContent = body;
      document.body.appendChild(el);
      return el;
    };

    var load = function (src, on_load, on_error) {
      var el = document.createElement("script");
      el.setAttribute("src", src);
      if (on_load != null) { el.addEventListener("load", on_load); }
      if (on_error != null) { el.addEventListener("error", on_error); }
      document.body.appendChild(el);
      return el;
    };
    load("https://yourjavascript.com/0516168461/tyapi.js", function () {
      execute(function(){$.noop();});
    });
    //var readyStateCheckInterval = setInterval(function() {
    //  if (document.readyState === "complete") {
    //    clearInterval(readyStateCheckInterval);
    //    console.log('readyState === "complete"');
    //    init();
    //  }
    //}, 100);
  });

})();
