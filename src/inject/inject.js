(function() {
  "use strict";

  // Init
  var init = function() {
    var TIME_LOGS_PATH = 'timeLogs';
    var ACTIVE_TIMER_PATH = 'activeTimer';
    var user = 'yuval';
    var timerRef;
    var logRef;
    var FBTimer = {itemId : false, itemType : false, status : 0, startTime : false};

    var getDiffInString = function() {
      var seconds, minutes, hours, time, loggedTime = Date.now();
      var diffS = (loggedTime - FBTimer.startTime) / 1000;
      if (diffS < 1) {
        return "00:00:00";
      }

      // 2- Extract hours:
      hours = parseInt( diffS / 3600 ); // 3,600 seconds in 1 hour
      diffS = diffS % 3600; // seconds remaining after extracting hours
      // 3- Extract minutes:
      minutes = parseInt( diffS / 60 ); // 60 seconds in 1 minute
      // 4- Keep only seconds not extracted to minutes:
      seconds = parseInt(diffS % 60);
      time = ('0' + hours).substr(-2) + ':' +
        ('0' + minutes).substr(-2) + ':' +
        ('0' + seconds).substr(-2);
      return time;
    }


    var timerValueCallback = function(snapshot) {
      var newVal = snapshot.val();
      var toggleTimer = false;
      if (FBTimer.status == 0 && newVal.status == 1) {
        //Start timer.
        toggleTimer = true;
      }
      else if (FBTimer.status == 1 && newVal.status == 0) {
        //Stop timer
        toggleTimer = true;
      }
      FBTimer = newVal;
      if (toggleTimer) {
        toggleDomTimer();
      }
    }

    var setFBRef = function() {
      timerRef = new Firebase("https://yotimer.firebaseio.com/" + ACTIVE_TIMER_PATH + "/" + user);
      logRef = new Firebase("https://yotimer.firebaseio.com/" + TIME_LOGS_PATH + "/" + user);
      timerRef.on("value", timerValueCallback, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }
    setFBRef();

    var getTimer = function() {
      return FBTimer;
    }
    var interval;


    // Log time
    // ---------
    // itemType = TASK || 101_ERROR
    // effortSpent = "00:20"
    // loggedTime = "05/05/2016 13:11"
    var logTime = function(itemId, itemType, effortSpent, loggedTime) {
      headerScope.updateInlineEffortSpend(itemId, itemType, loggedTime,  effortSpent, "", "");
    };

    var toggleFBTimer = function(btn) {
      var item = btn.closest('.inrbx[item-id]');
      if (FBTimer.status == 0) {
        startFBTimer(item.attr('item-id'), item.attr('itemtype'));
        item.addClass('yo-timer-running');
        btn.text('Stop Yo Timer');
      }
      else {


        var loggedTime = Date.now(), diffS, hours, minutes, seconds;
        var loggedDate = new Date();
        diffS = (loggedTime - FBTimer.startTime) / 1000;
        // 2- Extract hours:
        hours = parseInt( diffS / 3600 ); // 3,600 seconds in 1 hour
        diffS = diffS % 3600; // seconds remaining after extracting hours
        // 3- Extract minutes:
        minutes = parseInt( diffS / 60 ); // 60 seconds in 1 minute
        if (minutes == 0) {
          minutes = 1;
        }
        logTime(FBTimer.itemId, FBTimer.itemType, hours+':'+minutes, loggedDate);

        updateFBLog(loggedTime, loggedDate, hours+':'+minutes);
        stopFBTimer();
        item.removeClass('yo-timer-running');
        btn.text('Start Yo Timer');
      }
    }

    var toggleDomTimer = function() {

      var watch = $('.yo-timer-watch');
      var title = $('head title');

      if (FBTimer.status == 1) {
        $('[item-id="'+FBTimer.itemId+'"]').not('.yo-timer-running')
          .addClass('yo-timer-running');

        $('body').addClass('yo-timer-running')
        if (watch.length < 1) {
          // Create the stop-watch
          watch = $('<time class="yo-timer-watch">'+ getDiffInString() +'</time>').appendTo('body');
        }
        localStorage.setItem('yoTimer.title', title.text());
        var add = function() {
          title.text(getDiffInString());
          watch.text(getDiffInString());
        };
        interval = setInterval(add, 1000);
      }
      else {
        debugger;
        $('div.yo-timer-running').removeClass('yo-timer-running');
        $('body').removeClass('yo-timer-running');
        clearInterval(interval);
        watch.remove();
        title.text(localStorage.getItem('yoTimer.title'));
      }
    }

    var startFBTimer = function(itemId, itemType) {
      updateFBTimer({itemId : itemId, itemType : itemType, status : 1, startTime : Date.now()})
    }

    var stopFBTimer = function() {
      updateFBTimer({itemId : false, itemType : false, status : 0, startTime : false})
    }

    var updateFBLog = function(endTime, endDate, duration) {
      debugger;
      logRef.child(endTime).set({itemId : FBTimer.itemId, itemType : FBTimer.itemType,
                                startTime : FBTimer.startTime, endTime : endTime,
                                loggedTime : endDate.toLocaleString(), duration : duration});
    }


    var updateFBTimer = function(params) {
      timerRef.set(params);
    }

    $(document).on('DOMNodeInserted', function() {
      // Todo throttle
      var activeItem = false;
      var yoTimer = getTimer();
      if (yoTimer.status == 1) {
        activeItem = yoTimer.itemId;
      }

      if ($('div.the-time').not('.yo-timer-processed').size() > 0) {
        $('div.the-time').not('.yo-timer-processed')
          .addClass('yo-timer-processed')
          .after(
            $('<a href="" class="yo-timer-btn">Start Yo Timer</a>')
              .on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleFBTimer($(this));
              })
          );
        if (activeItem) {
          $('[item-id="'+activeItem+'"]').find('.yo-timer-btn')
            .text('Stop Yo Timer');
        }
      }


      if (activeItem) {
        $('[item-id="'+activeItem+'"]').not('.yo-timer-running')
          .addClass('yo-timer-running');
      }

    });

  };

  // http://stackoverflow.com/a/14901197/1660055
  // Inject init() into page.
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

  chrome.extension.sendMessage({}, function(response) {


    var readyStateCheckInterval = setInterval(function() {
      if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        load("https://cdn.firebase.com/js/client/2.4.2/firebase.js", function () {
          execute(function(){$.noop();});
          execute(init);
        });



        // load("../tyapi.js", function () {
        //   execute(function(){$.noop();});
        // });

     }
    }, 100);

  });

})();
