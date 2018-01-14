function getOffset(elapsedTime, fullTime, fullWidth){
  return ((elapsedTime*fullWidth)/fullTime)
}
function drawArc (id, songTime){
  var player = document.getElementById(id);
  if(!player.paused){
    var passedSecs = player.currentTime;
    var duration = player.duration;
    var passedTime = (passedSecs*100)/duration;
    var path = document.getElementById(songTime);
    var length = path.getTotalLength();
    var offset = (passedTime*length)/100;
    var dashOffset = length-offset;
    document.getElementById(songTime).style.strokeDashoffset = -dashOffset;
  }
}
var currDurr;
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.soundcloud.com/playlists/4350720?client_id=d7a1ecf371228b24c36e4c031255f0fa&enable_api=true');
	xhr.send(null);
	xhr.onreadystatechange = function () {
		var DONE = 4; // readyState 4 means the request is done.
		var OK = 200; // status 200 is a successful return.
		if (xhr.readyState === DONE) {
			if (xhr.status === OK){
        SC.initialize({
          client_id: 'd7a1ecf371228b24c36e4c031255f0fa'
        }); 
        var json = JSON.parse(xhr.responseText);
				var tracks = json.tracks;
        for(var i = 0; i<tracks.length; i++){
          var playlist = document.querySelector('#playlist ul');
          var songLi = document.createElement('li');
          var song = document.createElement('a');
          
          // var songSpan = document.createElement('span');
          song.id = tracks[i].id;
          song.dataset.trackId = tracks[i].id;
          song.dataset.songLength = tracks[i].duration;
          song.dataset.albumArt = tracks[i].artwork_url;
          song.dataset.artist = tracks[i].user.username;
          song.className = 'song';
          song.innerHTML = tracks[i].title;
          // song.appendChild(songSpan);
          songLi.appendChild(song);
          playlist.appendChild(songLi);
        }
        var songs = document.querySelectorAll('.song');
        for(var i = 0; i<songs.length; i++){
          songs[i].addEventListener('click', function(e){
            var songLink, songStream;
            currDurr = e.target.dataset.songLength;  
            SC.get('/tracks/'+e.target.id+'?enable_api=true').then(function(song){
              if(document.getElementById('play')!==null){
                document.getElementById('play').id = 'pause';
              }
   if(document.getElementById('pause')!==null){
     document.getElementById('pause').style.display = 'block';
   }
              document.getElementById('artist').innerHTML = song.user.username;
              document.getElementById('song').innerHTML = song.permalink;
  songLink = song.stream_url;
   var audio = document.getElementById('audio-player');
   audio.src = songLink + '?client_id=d7a1ecf371228b24c36e4c031255f0fa';
   audio.play();
   drawArc('audio-player', 'song-time');
   setInterval(function(){
     return drawArc('audio-player', 'song-time');
   }, 1000);
    var allLinks = document.querySelectorAll('.song');
    for(var j = 0; j<allLinks.length; j++){
      if(allLinks[j].childNodes[1] !== undefined){
        var childEl = allLinks[j].childNodes[1];
        childEl.parentNode.removeChild(childEl);
      }
      allLinks[j].className = 'song';
    }
    e.target.className += ' active';
    var activeSpan = document.createElement('span');
    activeSpan.className = 'waves';
    e.target.appendChild(activeSpan);
            });
          });
        }
			}
		} else {
			//Error Message Goes Here
		}
	}
  window.onload = function(){
    document.body.addEventListener('click', function(e){
      if(e.target.id === 'pause'){
        document.getElementById('audio-player').pause();
        e.target.id = 'play';
      } else if(e.target.id === 'play'){
        document.getElementById('audio-player').play();
        e.target.id = 'pause';
      }
    });
   var mouseDown = false, markerdown = false;
    var marker = document.getElementById('marker');
    document.addEventListener('mousedown', function(e){
      e.preventDefault();
      mouseDown = true;
      if(e.target.id === 'marker'){
        markerdown = true;
      }
    });
    document.addEventListener('mousemove', function(e){
      if(mouseDown && !markerdown){ document.getElementById('player').style.top = (e.pageY) + 'px';
                    document.getElementById('player').style.left = e.pageX + 'px';
      }
    });
    document.addEventListener('mouseup', function(e){
      mouseDown = false;
      markerdown = false;
    });
    document.getElementById('scrollbar').addEventListener('mousemove', function(e){
      e.preventDefault();
    if(markerdown){
          var scrollBar = document.getElementById('bar');
          var barStyles = getComputedStyle(scrollBar);
          var markerStyles = getComputedStyle(marker);
          
          var barHeight = Number(barStyles.height.replace('px',''));
          var barTop = Number(barStyles.top.replace('px',''));
          var barBottom = Number(barStyles.bottom.replace('px',''));
          var scrollDiff = (e.pageY -document.getElementById('player').offsetTop + barTop)-16;
      if(scrollDiff>0 && scrollDiff < (barHeight-8)){
        var scrollPerc = (scrollDiff*100)/(barHeight-8);
        var playList = document.getElementById('playlist').childNodes[3];
        var getScrollTop = (Number(getComputedStyle(playList).height.replace('px',''))*scrollPerc)/100;
        playList.scrollTop = getScrollTop/2;
        marker.style.top = (scrollDiff + 16) + 'px';
      } 
    }
  });
  }
  document.querySelector('#playlist ul').addEventListener('scroll', function(e){
    var list = e.target;
    var maxScroll = list.scrollHeight - Number(getComputedStyle(list).height.replace('px',''));
    var percentScrolled = ((list.scrollTop+8)*100)/maxScroll;
    var barHeight = Number(getComputedStyle(document.getElementById('bar')).height.replace('px',''));
    var fromBarTop = ((percentScrolled*(barHeight-12))/100);
    var marker = document.getElementById('marker');
    marker.style.top = fromBarTop + 'px';
  });