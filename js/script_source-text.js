document.addEventListener('DOMContentLoaded', function() {
    const allAudios = document.querySelectorAll('audio');
    allAudios.forEach(audio => {
        audio.addEventListener('play', function() {
            allAudios.forEach(otherAudio => {
                if (otherAudio !== audio) {
                    otherAudio.pause();
                }
            });
        });
    });

});
