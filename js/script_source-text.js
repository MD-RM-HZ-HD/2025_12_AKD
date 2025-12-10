/**
 * ========================================================================
 * مشغل الصوت - MediaElement.js Style Player
 * نسخة نهائية مطابقة للموقع الأصلي
 * ========================================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('🎵 بدء تحميل مشغلات MediaElement.js...');
    
    // البحث عن جميع عناصر الصوت
    const audioElements = document.querySelectorAll('audio');
    
    console.log(`✅ تم العثور على ${audioElements.length} عنصر صوت`);
    
    // إنشاء مشغل لكل عنصر صوت
    audioElements.forEach((audio, index) => {
        const playerContainer = createMediaElementPlayer(audio, index);
        audio.parentNode.insertBefore(playerContainer, audio);
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
 * إنشاء مشغل MediaElement.js
 */
function createMediaElementPlayer(audio, index) {
    
    // إنشاء الحاوية الرئيسية
    const container = document.createElement('span');
    container.className = 'mejs__offscreen';
    container.textContent = 'Audio Player';
    
    const wrapper = document.createElement('div');
    wrapper.id = `mep_${index}`;
    wrapper.className = 'mejs__container mejs__container-keyboard-inactive mejs__audio';
    wrapper.setAttribute('tabindex', '0');
    wrapper.setAttribute('role', 'application');
    wrapper.setAttribute('aria-label', 'Audio Player');
    wrapper.onclick = (e) => e.stopPropagation();
    
    // بناء HTML المشغل - مطابق تماماً للأصل
    wrapper.innerHTML = `
        <div class="mejs__inner">
            <div class="mejs__mediaelement"></div>
            
            <!-- طبقة الواجهة -->
            <div class="mejs__layers">
                <div class="mejs__poster mejs__layer" style="display: none;"></div>
            </div>
            
            <!-- أزرار التحكم -->
            <div class="mejs__controls">
                
                <!-- زر Play/Pause -->
                <div class="mejs__button mejs__playpause-button mejs__play">
                    <button type="button" aria-controls="mep_${index}" title="تشغيل" aria-label="تشغيل" data-id="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="mejs__icon-play" aria-hidden="true" focusable="false">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="mejs__icon-pause" aria-hidden="true" focusable="false" style="display:none;">
                            <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                        </svg>
                    </button>
                </div>
                
                <!-- زر Skip Back -->
                <div class="mejs__button mejs__skip-back-button">
                    <button type="button" aria-controls="mep_${index}" title="Skip back 10 seconds" aria-label="Skip back 10 seconds" data-id="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="mejs__icon-skip-back" aria-hidden="true" focusable="false">
                            <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/>
                        </svg>
                    </button>
                </div>
                
                <!-- زر Loop -->
                <div class="mejs__button mejs__loop-button mejs__loop-off">
                    <button type="button" aria-controls="mep_${index}" title="Toggle Loop" aria-label="Toggle Loop" tabindex="0" data-id="${index}"></button>
                </div>
                
                <!-- الوقت الحالي -->
                <div class="mejs__time mejs__currenttime-container" role="timer" aria-live="off">
                    <span class="mejs__offscreen">Current time</span>
                    <span class="mejs__currenttime">00:00</span>
                </div>
                
                <!-- شريط التقدم -->
                <div class="mejs__time-rail">
                    <span class="mejs__time-total mejs__time-slider" role="slider" tabindex="0" aria-label="Time Slider" data-id="${index}">
                        <span class="mejs__time-buffering" style="display: none;"></span>
                        <span class="mejs__time-loaded"></span>
                        <span class="mejs__time-current"></span>
                        <span class="mejs__time-hovered no-hover"></span>
                        <span class="mejs__time-handle">
                            <span class="mejs__time-handle-content"></span>
                        </span>
                    </span>
                </div>
                
                <!-- الوقت الكلي -->
                <div class="mejs__time mejs__duration-container">
                    <span class="mejs__offscreen">Total duration</span>
                    <span class="mejs__duration">00:00</span>
                </div>
                
                <!-- زر كتم الصوت -->
                <div class="mejs__button mejs__volume-button mejs__mute">
                    <button type="button" aria-controls="mep_${index}" title="كتم الصوت" aria-label="كتم الصوت" data-id="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="mejs__icon-mute" aria-hidden="true" focusable="false">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="mejs__icon-unmute" aria-hidden="true" focusable="false" style="display:none;">
                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                        </svg>
                    </button>
                </div>
                
                <!-- زر السرعة -->
                <div class="mejs__button mejs__speed-button">
                    <button type="button" aria-controls="mep_${index}" title="Speed Rate" aria-label="Speed Rate" tabindex="0" data-id="${index}">1.00x</button>
                    <div class="mejs__speed-selector mejs__offscreen">
                        <ul class="mejs__speed-selector-list">
                            <li class="mejs__speed-selector-list-item">
                                <input class="mejs__speed-selector-input" type="radio" name="mep_${index}_speed" value="2.00" id="mep_${index}-speed-2.00">
                                <label for="mep_${index}-speed-2.00" class="mejs__speed-selector-label" data-speed="2.00">2.00x</label>
                            </li>
                            <li class="mejs__speed-selector-list-item">
                                <input class="mejs__speed-selector-input" type="radio" name="mep_${index}_speed" value="1.50" id="mep_${index}-speed-1.50">
                                <label for="mep_${index}-speed-1.50" class="mejs__speed-selector-label" data-speed="1.50">1.50x</label>
                            </li>
                            <li class="mejs__speed-selector-list-item">
                                <input class="mejs__speed-selector-input" type="radio" name="mep_${index}_speed" value="1.25" id="mep_${index}-speed-1.25">
                                <label for="mep_${index}-speed-1.25" class="mejs__speed-selector-label" data-speed="1.25">1.25x</label>
                            </li>
                            <li class="mejs__speed-selector-list-item">
                                <input class="mejs__speed-selector-input" type="radio" name="mep_${index}_speed" value="1.00" id="mep_${index}-speed-1.00" checked="checked">
                                <label for="mep_${index}-speed-1.00" class="mejs__speed-selector-label mejs__speed-selected" data-speed="1.00">1.00x</label>
                            </li>
                            <li class="mejs__speed-selector-list-item">
                                <input class="mejs__speed-selector-input" type="radio" name="mep_${index}_speed" value="0.75" id="mep_${index}-speed-0.75">
                                <label for="mep_${index}-speed-0.75" class="mejs__speed-selector-label" data-speed="0.75">0.75x</label>
                            </li>
                        </ul>
                    </div>
                </div>
                
            </div>
        </div>
    `;
    
    // ربط الأحداث
    setupMediaElementControls(wrapper, audio, index);
    
    return wrapper;
}

/**
 * ربط أحداث التحكم
 */
function setupMediaElementControls(wrapper, audio, index) {
    
    // ===== عناصر الواجهة =====
    const playpauseBtn = wrapper.querySelector('.mejs__playpause-button');
    const playIcon = wrapper.querySelector('.mejs__icon-play');
    const pauseIcon = wrapper.querySelector('.mejs__icon-pause');
    const skipBackBtn = wrapper.querySelector('.mejs__skip-back-button button');
    const loopBtn = wrapper.querySelector('.mejs__loop-button');
    const loopBtnInner = loopBtn.querySelector('button');
    const currentTimeDisplay = wrapper.querySelector('.mejs__currenttime');
    const durationDisplay = wrapper.querySelector('.mejs__duration');
    const timeRail = wrapper.querySelector('.mejs__time-slider');
    const timeCurrent = wrapper.querySelector('.mejs__time-current');
    const volumeBtn = wrapper.querySelector('.mejs__volume-button');
    const muteIcon = wrapper.querySelector('.mejs__icon-mute');
    const unmuteIcon = wrapper.querySelector('.mejs__icon-unmute');
    const speedBtn = wrapper.querySelector('.mejs__speed-button button');
    const speedSelector = wrapper.querySelector('.mejs__speed-selector');
    const speedLabels = wrapper.querySelectorAll('.mejs__speed-selector-label');
    
    // ===== Play/Pause =====
    playpauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playpauseBtn.classList.remove('mejs__play');
            playpauseBtn.classList.add('mejs__pause');
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            audio.pause();
            playpauseBtn.classList.remove('mejs__pause');
            playpauseBtn.classList.add('mejs__play');
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    });
    
    // ===== Skip Back -10 =====
    skipBackBtn.addEventListener('click', () => {
        audio.currentTime = Math.max(0, audio.currentTime - 10);
    });
    
    // ===== Loop Toggle =====
    loopBtnInner.addEventListener('click', () => {
        audio.loop = !audio.loop;
        if (audio.loop) {
            loopBtn.classList.remove('mejs__loop-off');
            loopBtn.classList.add('mejs__loop-on');
        } else {
            loopBtn.classList.remove('mejs__loop-on');
            loopBtn.classList.add('mejs__loop-off');
        }
    });
    
    // ===== تحديث التقدم =====
    audio.addEventListener('timeupdate', () => {
        if (audio.duration > 0) {
            const percent = (audio.currentTime / audio.duration) * 100;
            timeCurrent.style.width = percent + '%';
            currentTimeDisplay.textContent = formatTime(audio.currentTime);
        }
    });
    
    // ===== المدة الكلية =====
    audio.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(audio.duration);
    });
    
    // إذا لم يتم تحميل metadata، حاول بعد فترة
    if (audio.duration) {
        durationDisplay.textContent = formatTime(audio.duration);
    }
    
    // ===== عند الانتهاء =====
    audio.addEventListener('ended', () => {
        if (!audio.loop) {
            playpauseBtn.classList.remove('mejs__pause');
            playpauseBtn.classList.add('mejs__play');
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            timeCurrent.style.width = '0%';
        }
    });
    
    // ===== النقر على شريط التقدم =====
    timeRail.addEventListener('click', (e) => {
        const rect = timeRail.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        audio.currentTime = percent * audio.duration;
    });
    
    // ===== كتم الصوت =====
    volumeBtn.querySelector('button').addEventListener('click', () => {
        audio.muted = !audio.muted;
        if (audio.muted) {
            volumeBtn.classList.remove('mejs__mute');
            volumeBtn.classList.add('mejs__unmute');
            muteIcon.style.display = 'none';
            unmuteIcon.style.display = 'block';
        } else {
            volumeBtn.classList.remove('mejs__unmute');
            volumeBtn.classList.add('mejs__mute');
            muteIcon.style.display = 'block';
            unmuteIcon.style.display = 'none';
        }
    });
    
    // ===== السرعة =====
    speedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        speedSelector.classList.toggle('mejs__offscreen');
    });
    
    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            speedSelector.classList.add('mejs__offscreen');
        }
    });
    
    // اختيار السرعة
    speedLabels.forEach(label => {
        label.addEventListener('click', (e) => {
            e.preventDefault();
            const speed = parseFloat(label.dataset.speed);
            audio.playbackRate = speed;
            speedBtn.textContent = speed.toFixed(2) + 'x';
            
            // تحديث الحالة النشطة
            speedLabels.forEach(l => l.classList.remove('mejs__speed-selected'));
            label.classList.add('mejs__speed-selected');
            
            // تحديث الراديو
            const radio = label.previousElementSibling;
            if (radio) radio.checked = true;
            
            // إغلاق القائمة
            speedSelector.classList.add('mejs__offscreen');
        });
    });
}

/**
 * تنسيق الوقت MM:SS
 */
function formatTime(seconds) {
    if (isNaN(seconds) || seconds === 0 || !isFinite(seconds)) {
        return '00:00';
    }
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * ========================================================================
 * نهاية الملف
 * ========================================================================
 */
