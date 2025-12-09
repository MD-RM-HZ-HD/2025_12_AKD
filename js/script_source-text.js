/**
 * مشغل الصوت المخصص - Custom Audio Player
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // البحث عن جميع عناصر audio في الصفحة
    const audioElements = document.querySelectorAll('audio');
    
    audioElements.forEach((audio, index) => {
        // إنشاء المشغل المخصص
        const player = createCustomPlayer(audio, index);
        
        // استبدال عنصر audio بالمشغل المخصص
        audio.parentNode.insertBefore(player, audio);
        audio.style.display = 'none';
    });
    
    // التحكم في الأصوات: إيقاف الآخرين عند تشغيل صوت
    audioElements.forEach(audio => {
        audio.addEventListener('play', function() {
            audioElements.forEach(otherAudio => {
                if (otherAudio !== audio && !otherAudio.paused) {
                    otherAudio.pause();
                }
            });
        });
    });
});

