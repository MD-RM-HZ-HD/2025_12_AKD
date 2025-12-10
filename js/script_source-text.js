/**
 * مشغل الصوت الاحترافي - Professional Audio Player
 * مثل shiavoice.com
 */

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('🎵 تحميل مشغل الصوت الاحترافي...');
    
    // البحث عن جميع عناصر audio
    const audioElements = document.querySelectorAll('audio');
    
    console.log(`✅ تم العثور على ${audioElements.length} عنصر صوت`);
    
    // إنشاء مشغل لكل عنصر صوت
    audioElements.forEach((audio, index) => {
        const player = createAudioPlayer(audio, index);
        audio.parentNode.insertBefore(player, audio);
        audio.style.display = 'none';
    });
    
    // إيقاف الأصوات الأخرى عند تشغيل صوت جديد
    audioElements.forEach(audio => {
        audio.addEventListener('play', function() {
            audioElements.forEach(otherAudio => {
                if (otherAudio !== audio && !otherAudio.paused) {
                    otherAudio.pause();
                }
            });
        });
    });
    
    console.log('✅ تم تحميل جميع المشغلات بنجاح');
});

/**
 * إنشاء مشغل صوت احترافي
 */
function createAudioPlayer(audio, index) {
    
    // إنشاء الحاوية
    const wrapper = document.createElement('div');
    wrapper.className = 'audio-player-wrapper';
    wrapper.onclick = (e) => e.stopPropagation();
    
    // HTML المشغل
    wrapper.innerHTML = `
        <div class="audio-main-controls">
            <!-- زر Play/Pause -->
            <button class="audio-play-btn" data-id="${index}">
                <svg class="play-icon" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                <svg class="pause-icon" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            </button>
            
            <!-- منطقة التقدم -->
            <div class="audio-progress-area">
                <div class="audio-time-display">
                    <span class="current-time">00:00</span>
                    <span class="total-time">00:00</span>
                </div>
                <div class="audio-progress-bar-container" data-id="${index}">
                    <div class="audio-progress-bar"></div>
                </div>
            </div>
        </div>
        
        <!-- أزرار التحكم الإضافية -->
        <div class="audio-extra-controls">
            <!-- أزرار التقديم والتأخير -->
            <div class="audio-control-group">
                <button class="audio-control-btn backward" data-id="${index}">-10</button>
                <button class="audio-control-btn forward" data-id="${index}">+10</button>
            </div>
            
            <!-- أزرار السرعة -->
            <div class="audio-speed-group">
                <button class="audio-speed-btn active" data-speed="1" data-id="${index}">1×</button>
                <button class="audio-speed-btn" data-speed="1.5" data-id="${index}">1.5×</button>
                <button class="audio-speed-btn" data-speed="2" data-id="${index}">2×</button>
            </div>
        </div>
    `;
    
    // ربط الأحداث
    setupPlayerEvents(wrapper, audio, index);
    
    return wrapper;
}

/**
 * ربط أحداث المشغل
 */
function setupPlayerEvents(wrapper, audio, index) {
    
    // عناصر الواجهة
    const playBtn = wrapper.querySelector('.audio-play-btn');
    const progressContainer = wrapper.querySelector('.audio-progress-bar-container');
    const progressBar = wrapper.querySelector('.audio-progress-bar');
    const currentTime = wrapper.querySelector('.current-time');
    const totalTime = wrapper.querySelector('.total-time');
    const backwardBtn = wrapper.querySelector('.backward');
    const forwardBtn = wrapper.querySelector('.forward');
    const speedBtns = wrapper.querySelectorAll('.audio-speed-btn');
    
    // ===== زر Play/Pause =====
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playBtn.classList.add('playing');
        } else {
            audio.pause();
            playBtn.classList.remove('playing');
        }
    });
    
    // ===== تحديث التقدم والوقت =====
    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + '%';
        currentTime.textContent = formatTime(audio.currentTime);
    });
    
    // ===== عرض المدة الكلية =====
    audio.addEventListener('loadedmetadata', () => {
        totalTime.textContent = formatTime(audio.duration);
    });
    
    // ===== عند انتهاء الصوت =====
    audio.addEventListener('ended', () => {
        playBtn.classList.remove('playing');
        progressBar.style.width = '0%';
    });
    
    // ===== النقر على شريط التقدم =====
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        audio.currentTime = percent * audio.duration;
    });
    
    // ===== زر التأخير -10 ثواني =====
    backwardBtn.addEventListener('click', () => {
        audio.currentTime = Math.max(0, audio.currentTime - 10);
    });
    
    // ===== زر التقديم +10 ثواني =====
    forwardBtn.addEventListener('click', () => {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
    });
    
    // ===== أزرار السرعة =====
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
 * تنسيق الوقت
 */
function formatTime(seconds) {
    if (isNaN(seconds) || seconds === 0) return '00:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
