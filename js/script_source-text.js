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

/**
 * إنشاء مشغل صوت مخصص
 */
function createCustomPlayer(audio, index) {
    // إنشاء الحاوية الرئيسية
    const playerDiv = document.createElement('div');
    playerDiv.className = 'custom-audio-player';
    playerDiv.onclick = (e) => e.stopPropagation(); // منع إغلاق الأكورديون
    
    // HTML الخاص بالمشغل
    playerDiv.innerHTML = `
        <div class="audio-controls">
            <button class="play-pause-btn" data-audio-id="${index}">
                <svg class="play-icon" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                <svg class="pause-icon" style="display:none;" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
            </button>
            
            <div class="audio-info">
                <div class="audio-times">
                    <span class="current-time">0:00</span>
                    <span class="total-time">0:00</span>
                </div>
                <div class="progress-container" data-audio-id="${index}">
                    <div class="progress-bar"></div>
                </div>
            </div>
        </div>
        
        <div class="speed-controls">
            <button class="speed-btn active" data-speed="1" data-audio-id="${index}">عادي</button>
            <button class="speed-btn" data-speed="1.25" data-audio-id="${index}">1.25×</button>
            <button class="speed-btn" data-speed="1.5" data-audio-id="${index}">1.5×</button>
            <button class="speed-btn" data-speed="1.75" data-audio-id="${index}">1.75×</button>
            <button class="speed-btn" data-speed="2" data-audio-id="${index}">2×</button>
        </div>
    `;
    
    // ربط الأحداث
    setupPlayerEvents(playerDiv, audio, index);
    
    return playerDiv;
}

/**
 * ربط أحداث المشغل
 */
function setupPlayerEvents(playerDiv, audio, index) {
    // عناصر واجهة المشغل
    const playPauseBtn = playerDiv.querySelector('.play-pause-btn');
    const playIcon = playerDiv.querySelector('.play-icon');
    const pauseIcon = playerDiv.querySelector('.pause-icon');
    const progressContainer = playerDiv.querySelector('.progress-container');
    const progressBar = playerDiv.querySelector('.progress-bar');
    const currentTimeSpan = playerDiv.querySelector('.current-time');
    const totalTimeSpan = playerDiv.querySelector('.total-time');
    const speedBtns = playerDiv.querySelectorAll('.speed-btn');
    
    // --- زر التشغيل/الإيقاف ---
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            audio.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    });
    
    // --- تحديث شريط التقدم والوقت ---
    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + '%';
        currentTimeSpan.textContent = formatTime(audio.currentTime);
    });
    
    // --- عند تحميل البيانات: عرض المدة الكلية ---
    audio.addEventListener('loadedmetadata', () => {
        totalTimeSpan.textContent = formatTime(audio.duration);
    });
    
    // --- عند انتهاء الصوت: إعادة الأيقونات ---
    audio.addEventListener('ended', () => {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        progressBar.style.width = '0%';
    });
    
    // --- النقر على شريط التقدم للتنقل ---
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        audio.currentTime = percent * audio.duration;
    });
    
    // --- أزرار السرعة ---
    speedBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const speed = parseFloat(btn.dataset.speed);
            audio.playbackRate = speed;
            
            // تحديث الزر النشط
            speedBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

/**
 * تنسيق الوقت (ثواني → دقائق:ثواني)
 */
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
