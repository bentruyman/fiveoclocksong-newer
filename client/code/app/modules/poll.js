var container    = $('#poll')[0];

ss.rpc('poll.today', function (resp) {
  var tracks = resp.poll.tracks,
      votes  = resp.votes;
  
  tracks.forEach(function (t, index) {
    var $track = $(ss.tmpl.track.render(t));
    
    $track.find('.vote-count').html(calculateVoteTotal(votes[index]));
    
    $track.find('.upvote').on('click', function (event) {
      event.preventDefault();
      ss.rpc('poll.upvote', index);
    });
    
    $track.find('.downvote').on('click', function (event) {
      event.preventDefault();
      ss.rpc('poll.downvote', index);
    });
    
    $(container).append($track);
  });
  
  // TODO: reformat to use proper data
  ss.event.on('/poll/upvote', function (trackIndex) {
    var $track = $(container).find('.track').eq(trackIndex),
        voteCount = parseInt($track.find('.vote-count').text(), 10) + 1;
    
    $track.find('.vote-count').text(voteCount);
  });
  
  ss.event.on('/poll/downvote', function (trackIndex) {
    var $track = $(container).find('.track').eq(trackIndex),
        voteCount = parseInt($track.find('.vote-count').text(), 10) - 1;
    
    $track.find('.vote-count').text(voteCount);
  });
});

function calculateVoteTotal(votes) {
  var voters = Object.keys(votes),
      amount = 0;
  
  if (voters.length > 0) {
    voters.forEach(function (voter) {
      amount += parseInt(votes[voter], 10);
    });
  }
  
  return amount;
}
