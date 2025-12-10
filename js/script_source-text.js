/**
 * مشغل الصوت - نسخة طبق الأصل من shiavoice.com
 */

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('🎵 تحميل مشغل shiavoice...');
    
    const audioElements = document.querySelectorAll('audio');
    
    console.log(`✅ تم العثور على ${audioElements.length} عنصر صوت`);
    
    audioElements.forEach((audio, index) => {
        const player = createShiaVoicePlayer(audio, index);
        audio.parentNode.insertBefore(player, audio);
        audio.style.display = 'none';
    });
    
    // إيقاف الأصوات الأخرى
    audioElements.forEach(audio => {
        audio.addEventListener('play', function() {
            audioElements.forEach(otherAudio => {
                if (otherAudio !== audio && !otherAudio.paused) {
                    otherAudio.pause();
                }
            });
        });
    });
    
    console.log('✅ تم تحميل جميع المشغلات');
});

/**
 * إنشاء مشغل shiavoice
 */
function createShiaVoicePlayer(audio, index) {
    
    const wrapper = document.createElement('div');
    wrapper.className = 'sv-audio-player';
    wrapper.onclick = (e) => e.stopPropagation();
    
    wrapper.innerHTML = `
        <!-- الصف العلوي -->
        <div class="sv-top-row">
            <!-- زر Play -->
            <button class="sv-play-btn" data-id="${index}">
                <svg class="play-icon" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                <svg class="pause-icon" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                </svg>
            </button>
            
            <!-- زر -10 -->
            <button class="sv-skip-btn backward" data-id="${index}">-10</button>
            
            <!-- الوقت الحالي -->
            <span class="sv-current-time">00:00</span>
            
            <!-- شريط التقدم -->
            <div class="sv-progress-container" data-id="${index}">
                <div class="sv-progress-fill"></div>
            </div>
            
            <!-- الوقت الكلي -->
            <span class="sv-total-time">00:00</span>
            
            <!-- زر +10 -->
            <button class="sv-skip-btn forward" data-id="${index}">+10</button>
        </div>
        
        <!-- الصف السفلي -->
        <div class="sv-bottom-row">
            <div class="sv-speed-wrapper">
                <button class="sv-speed-trigger" data-id="${index}">
                    <span class="speed-value">1.00x</span>
                    <svg viewBox="0 0 24 24">
                        <path d="M7 10l5 5 5-5z"/>
                    </svg>
                </button>
                <div class="sv-speed-menu">
                    <button class="sv-speed-option" data-speed="0.75">0.75x</button>
                    <button class="sv-speed-option active" data-speed="1.00">1.00x</button>
                    <button class="sv-speed-option" data-speed="1.25">1.25x</button>
                    <button class="sv-speed-option" data-speed="1.50">1.50x</button>
                    <button class="sv-speed-option" data-speed="2.00">2.00x</button>
                </div>
            </div>
        </div>
    `;
    
    setupShiaVoicePlayer(wrapper, audio, index);
    
    return wrapper;
}

/**
 * ربط الأحداث
 */
function setupShiaVoicePlayer(wrapper, audio, index) {
    
    // عناصر الواجهة
    const playBtn = wrapper.querySelector('.sv-play-btn');
    const backwardBtn = wrapper.querySelector('.backward');
    const forwardBtn = wrapper.querySelector('.forward');
    const currentTime = wrapper.querySelector('.sv-current-time');
    const totalTime = wrapper.querySelector('.sv-total-time');
    const progressContainer = wrapper.querySelector('.sv-progress-container');
    const progressFill = wrapper.querySelector('.sv-progress-fill');
    const speedTrigger = wrapper.querySelector('.sv-speed-trigger');
    const speedMenu = wrapper.querySelector('.sv-speed-menu');
    const speedOptions = wrapper.querySelectorAll('.sv-speed-option');
    const speedValue = wrapper.querySelector('.speed-value');
    
    // ===== Play/Pause =====
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playBtn.classList.add('playing');
        } else {
            audio.pause();
            playBtn.classList.remove('playing');
        }
    });
    
    // ===== تحديث التقدم =====
    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + '%';
        currentTime.textContent = formatTime(audio.currentTime);
    });
    
    // ===== المدة الكلية =====
    audio.addEventListener('loadedmetadata', () => {
        totalTime.textContent = formatTime(audio.duration);
    });
    
    // ===== عند الانتهاء =====
    audio.addEventListener('ended', () => {
        playBtn.classList.remove('playing');
        progressFill.style.width = '0%';
    });
    
    // ===== النقر على شريط التقدم =====
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        audio.currentTime = percent * audio.duration;
    });
    
    // ===== التأخير -10 =====
    backwardBtn.addEventListener('click', () => {
        audio.currentTime = Math.max(0, audio.currentTime - 10);
    });
    
    // ===== التقديم +10 =====
    forwardBtn.addEventListener('click', () => {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
    });
    
    // ===== فتح/إغلاق قائمة السرعة =====
    speedTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        speedMenu.classList.toggle('show');
        speedTrigger.classList.toggle('open');
    });
    
    // ===== إغلاق القائمة عند النقر خارجها =====
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            speedMenu.classList.remove('show');
            speedTrigger.classList.remove('open');
        }
    });
    
    // ===== تغيير السرعة =====
    speedOptions.forEach(option => {
        option.addEventListener('click', () => {
            const speed = parseFloat(option.dataset.speed);
            audio.playbackRate = speed;
            speedValue.textContent = speed.toFixed(2) + 'x';
            
            speedOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            speedMenu.classList.remove('show');
            speedTrigger.classList.remove('open');
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
