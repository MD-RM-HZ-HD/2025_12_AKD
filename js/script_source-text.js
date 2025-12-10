/**
 * مشغل الصوت المدمج الصغير - Compact Audio Player
 */

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('🎵 تحميل المشغل المدمج...');
    
    const audioElements = document.querySelectorAll('audio');
    
    console.log(`✅ تم العثور على ${audioElements.length} عنصر صوت`);
    
    audioElements.forEach((audio, index) => {
        const player = createCompactPlayer(audio, index);
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
 * إنشاء مشغل مدمج صغير
 */
function createCompactPlayer(audio, index) {
    
    const wrapper = document.createElement('div');
    wrapper.className = 'compact-audio-player';
    wrapper.onclick = (e) => e.stopPropagation();
    
    wrapper.innerHTML = `
        <div class="audio-single-row">
            <!-- زر Play/Pause -->
            <button class="compact-play-btn" data-id="${index}">
                <svg class="play-icon" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                <svg class="pause-icon" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            </button>
            
            <!-- زر التأخير -10 -->
            <button class="compact-skip-btn backward" data-id="${index}">
                <svg viewBox="0 0 24 24">
                    <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/>
                </svg>
            </button>
            
            <!-- الوقت الحالي -->
            <span class="compact-time">00:00</span>
            
            <!-- شريط التقدم -->
            <div class="compact-progress" data-id="${index}">
                <div class="compact-progress-fill"></div>
            </div>
            
            <!-- الوقت الكلي -->
            <span class="compact-total-time">00:00</span>
            
            <!-- زر التقديم +10 -->
            <button class="compact-skip-btn forward" data-id="${index}">
                <svg viewBox="0 0 24 24">
                    <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
                </svg>
            </button>
            
            <!-- قائمة السرعة -->
            <div class="compact-speed-dropdown">
                <button class="compact-speed-btn" data-id="${index}">
                    <span class="speed-text">1.00x</span>
                    <svg viewBox="0 0 24 24">
                        <path d="M7 10l5 5 5-5z"/>
                    </svg>
                </button>
                <div class="speed-dropdown-menu">
                    <button class="speed-option" data-speed="0.75" data-id="${index}">0.75x</button>
                    <button class="speed-option active" data-speed="1.00" data-id="${index}">1.00x</button>
                    <button class="speed-option" data-speed="1.25" data-id="${index}">1.25x</button>
                    <button class="speed-option" data-speed="1.50" data-id="${index}">1.50x</button>
                    <button class="speed-option" data-speed="2.00" data-id="${index}">2.00x</button>
                </div>
            </div>
        </div>
    `;
    
    setupCompactPlayer(wrapper, audio, index);
    
    return wrapper;
}

/**
 * ربط أحداث المشغل
 */
function setupCompactPlayer(wrapper, audio, index) {
    
    const playBtn = wrapper.querySelector('.compact-play-btn');
    const backwardBtn = wrapper.querySelector('.backward');
    const forwardBtn = wrapper.querySelector('.forward');
    const currentTime = wrapper.querySelector('.compact-time');
    const totalTime = wrapper.querySelector('.compact-total-time');
    const progressBar = wrapper.querySelector('.compact-progress');
    const progressFill = wrapper.querySelector('.compact-progress-fill');
    const speedBtn = wrapper.querySelector('.compact-speed-btn');
    const speedMenu = wrapper.querySelector('.speed-dropdown-menu');
    const speedOptions = wrapper.querySelectorAll('.speed-option');
    const speedText = wrapper.querySelector('.speed-text');
    
    // Play/Pause
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playBtn.classList.add('playing');
        } else {
            audio.pause();
            playBtn.classList.remove('playing');
        }
    });
    
    // تحديث التقدم
    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + '%';
        currentTime.textContent = formatTime(audio.currentTime);
    });
    
    // المدة الكلية
    audio.addEventListener('loadedmetadata', () => {
        totalTime.textContent = formatTime(audio.duration);
    });
    
    // عند الانتهاء
    audio.addEventListener('ended', () => {
        playBtn.classList.remove('playing');
        progressFill.style.width = '0%';
    });
    
    // النقر على شريط التقدم
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        audio.currentTime = percent * audio.duration;
    });
    
    // التأخير -10
    backwardBtn.addEventListener('click', () => {
        audio.currentTime = Math.max(0, audio.currentTime - 10);
    });
    
    // التقديم +10
    forwardBtn.addEventListener('click', () => {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
    });
    
    // فتح/إغلاق قائمة السرعة
    speedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        speedMenu.classList.toggle('show');
    });
    
    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            speedMenu.classList.remove('show');
        }
    });
    
    // تغيير السرعة
    speedOptions.forEach(option => {
        option.addEventListener('click', () => {
            const speed = parseFloat(option.dataset.speed);
            audio.playbackRate = speed;
            speedText.textContent = speed.toFixed(2) + 'x';
            
            speedOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            speedMenu.classList.remove('show');
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
