define(
  ['services/jquery', 'services/poll'],
  function ($, pollService) {
    return {
      creator: function (sandbox) {
        var votingBooth;
        
        // shows the voting booth
        function showVotingBooth(poll) {
          
        }
        
        // hides the voting booth
        function hideVotingBooth() {
          
        }
        
        return {
          create: function () {
            pollService.getCurrentPoll().then(function (poll) {
              // if a poll exists, determine if the voting booth or winner
              // should be shown
              if (poll) {
                
              }
              // no poll exists...this is awkward
              else {
                
              }
            });
          },
          destroy: function () {
            
          }
        };
      }
    };
  }
);
