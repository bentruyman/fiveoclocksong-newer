var EventEmitter = require('events').EventEmitter;

var config = require('../config');

var STARTED = 'started',
    STOPPED = 'stopped';

var PollTimer = module.exports = function () {
  var self = this,
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
  
  // a ticker function ran on an interval to check to see if a poll should be
  // started or stopped
  function tick() {
    var newState = getPollState();
    
    // start the new poll
    if (currentState === STOPPED && newState === STARTED) {
      self.emit('pollstart');
    }
    // stop the current poll
    else if (currentState === STARTED && newState === STOPPED) {
      self.emit('pollstop');
    }
    
    currentState = newState;
    
    self.emit('tick', currentState);
  }
  
  self.start = function () {
    // set initial timer state
    resetTimers();
    
    // set initial poll state
    currentState = getPollState();
    
    // start the ticker
    currentTicker = setInterval(tick, config.timer.tick);
  };
  
  self.stop = function () {
    clearInterval(currentTicker);
  };
  
  self.getState = function () {
    return getPollState();
  };
};

PollTimer.prototype = new EventEmitter;
