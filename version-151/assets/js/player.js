(function () {
    function attachPlayer(container) {
        var video = container.querySelector('video');
        var button = container.querySelector('.player-overlay');
        var streamUrl = container.getAttribute('data-stream');
        var ready = false;
        var hlsInstance = null;

        function prepare() {
            if (ready || !video || !streamUrl) {
                return;
            }
            ready = true;
            video.controls = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }

        function start() {
            prepare();
            if (button) {
                button.classList.add('is-hidden');
            }
            var action = video.play();
            if (action && typeof action.catch === 'function') {
                action.catch(function () {
                    if (button) {
                        button.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (button) {
            button.addEventListener('click', start);
        }

        if (video) {
            video.addEventListener('click', start);
        }

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        Array.prototype.slice.call(document.querySelectorAll('.stream-player')).forEach(attachPlayer);
    });
})();
