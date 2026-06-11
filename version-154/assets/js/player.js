(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('.hls-player'));
    players.forEach(setupPlayer);
  });

  function setupPlayer(video) {
    var shell = video.closest('.video-shell');
    var button = shell ? shell.querySelector('.video-start') : null;
    var message = shell ? shell.querySelector('.player-message') : null;
    var source = video.getAttribute('data-hls');
    var hlsInstance = null;

    function setMessage(text) {
      if (message) {
        message.textContent = text || '';
      }
    }

    function attachSource() {
      if (!source) {
        setMessage('当前影片暂无可用播放源。');
        return Promise.reject(new Error('Missing HLS source'));
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        if (!hlsInstance) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
            if (data && data.fatal) {
              setMessage('播放源加载失败，请稍后重试。');
              hlsInstance.destroy();
              hlsInstance = null;
            }
          });
        }
        return Promise.resolve();
      }

      video.src = source;
      setMessage('浏览器不支持 HLS 自动解析，已尝试使用原生播放。');
      return Promise.resolve();
    }

    function play() {
      setMessage('正在加载高清播放源...');
      attachSource()
        .then(function () {
          return video.play();
        })
        .then(function () {
          if (button) {
            button.hidden = true;
          }
          setMessage('');
        })
        .catch(function () {
          setMessage('浏览器阻止了自动播放，请再次点击播放器播放。');
          video.controls = true;
        });
    }

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('play', function () {
      if (button) {
        button.hidden = true;
      }
      setMessage('');
    });
  }
})();
