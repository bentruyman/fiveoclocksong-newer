var EventEmitter = require('events').EventEmitter;

var config = require('../../../config');

var STARTED = 'started',
    STOPPED = 'stopped',
    currentState = null,
    currentTicker,
    startTime, stopTime;

// gets the current state of the poll
function getPollState() {
  var now = new Date;
  
  if (now < stopTime || now.getDate() > stopTime.getDate()) {
    return STARTED;
  }
  
  return STOPPED;
}

// sets the polls start/stop time
function resetTimers() {
  startTime = new Date;
  startTime.setHours(0);
  startTime.setMinutes(0);
  startTime.setSeconds(0);
  startTime.setMilliseconds(0);
  
  stopTime = new Date;
  stopTime.setHours(config.timer.hour);
  stopTime.setMinutes(config.timer.minute);
  stopTime.setSeconds(0);
  stopTime.setMilliseconds(0);
}

// starts the poll ticker
function startTicker() {
  currentTicker = setInterval(tick, config.timer.tick);
}

// stops the poll ticker
function stopTicker() {
  clearInterval(currentTicker);
}

// a ticker function ran on an interval to check to see if a poll should be
// started or stopped
function tick() {
  var newState = getPollState();
  
  // start the new poll
  if (currentState === STOPPED && newState === STARTED) {
    PollTimer.emit('pollstart');
  }
  // stop the current poll
  else if (currentState === STARTED && newState === STOPPED) {
    PollTimer.emit('pollstop');
  }
  
  currentState = newState;
  
  PollTimer.emit('tick', currentState);
}

var PollTimer = new EventEmitter;

PollTimer.start = function () {
  // set initial timer state
  resetTimers();
  
  // set initial poll state
  currentState = getPollState();
  
  // start the ticker
  startTicker();
};

PollTimer.stop = function () {
  stopTicker();
};

PollTimer.getState = function () {
  return getPollState();
};

module.exports = PollTimer;
