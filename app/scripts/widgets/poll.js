define(
  'widgets/poll',
  ['services/jquery', 'services/poll'],
  function ($, pollService) {
    'use strict';
    
    return {
      creator: function (sandbox) {
        var app = sandbox.app,
            container = document.getElementById(sandbox.getOption('container')),
            tracks = [],
            votingBooth;
        
        // shows the voting booth
        function showVotingBooth(poll) {
          
        }
        
        // hides the voting booth
        function hideVotingBooth() {
          
        }
        
        return {
          create: function () {
            pollService.getCurrentPoll().then(function (data) {
              // if a poll exists, determine if the voting booth or winner
              // should be shown
              if (data) {
                // iterate through the poll's tracks, and create track widgets
                data.poll.tracks.forEach(function (track) {
                  tracks.push(
                    app.create('track', {
                      parent: sandbox.getOption('container'),
                      track: track
                    })
                  );
                });
                
                // start each of the track widgets
                tracks.forEach(function (track) {
                  app.start(track);
                });
              }
              // no poll exists...this is awkward
              else {
                
              }
            });
          },
          destroy: function () {
            tracks.forEach(function (track) {
              app.stop(track);
            });
          }
        };
      }
    };
  }
);
