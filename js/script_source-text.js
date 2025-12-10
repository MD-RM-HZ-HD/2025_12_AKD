/**
 * مشغل صوت بسيط - صف واحد أفقي
 * Simple Audio Player - One Horizontal Row
 */

(function() {
    'use strict';
    
    console.log('🎵 Audio Player Script Loaded');
    
    function initPlayers() {
        console.log('🔍 Searching for audio elements...');
        
        const audioElements = document.querySelectorAll('audio');
        console.log(`✅ Found ${audioElements.length} audio elements`);
        
        if (audioElements.length === 0) {
            console.warn('⚠️ No audio elements found!');
            return;
        }
        
        audioElements.forEach((audio, index) => {
            console.log(`🎵 Creating player ${index + 1}...`);
            try {
                const player = createSimplePlayer(audio, index);
                audio.parentNode.insertBefore(player, audio);
                audio.style.display = 'none';
                console.log(`✅ Player ${index + 1} created successfully`);
            } catch (error) {
                console.error(`❌ Error creating player ${index + 1}:`, error);
            }
        });
        
        // Stop other audios when one plays
        audioElements.forEach(audio => {
            audio.addEventListener('play', function() {
                audioElements.forEach(other => {
                    if (other !== audio && !other.paused) {
                        other.pause();
                    }
                });
            });
        });
        
        console.log('✅ All players initialized');
    }
    
    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlayers);
    } else {
        initPlayers();
    }
    
    function createSimplePlayer(audio, index) {
        
        const wrapper = document.createElement('div');
        wrapper.className = 'simple-audio-player';
        wrapper.onclick = e => e.stopPropagation();
        
        wrapper.innerHTML = `
            <div class="player-row">
                <button class="btn-play" data-id="${index}">▶</button>
                <button class="btn-skip" data-id="${index}">-10</button>
                <button class="btn-loop" data-id="${index}">↻</button>
                <span class="time-current">00:00</span>
                <div class="progress-bar" data-id="${index}">
                    <div class="progress-fill"></div>
                </div>
                <span class="time-total">00:00</span>
                <button class="btn-mute" data-id="${index}">🔊</button>
                <button class="btn-speed" data-id="${index}">1.00x</button>
                <div class="speed-menu">
                    <button data-speed="2.00">2.00x</button>
                    <button data-speed="1.50">1.50x</button>
                    <button data-speed="1.25">1.25x</button>
                    <button data-speed="1.00" class="active">1.00x</button>
                    <button data-speed="0.75">0.75x</button>
                </div>
            </div>
        `;
        
        setupPlayer(wrapper, audio);
        return wrapper;
    }
    
    function setupPlayer(wrapper, audio) {
        
        const playBtn = wrapper.querySelector('.btn-play');
        const skipBtn = wrapper.querySelector('.btn-skip');
        const loopBtn = wrapper.querySelector('.btn-loop');
        const timeCurrent = wrapper.querySelector('.time-current');
        const timeTotal = wrapper.querySelector('.time-total');
        const progressBar = wrapper.querySelector('.progress-bar');
        const progressFill = wrapper.querySelector('.progress-fill');
        const muteBtn = wrapper.querySelector('.btn-mute');
        const speedBtn = wrapper.querySelector('.btn-speed');
        const speedMenu = wrapper.querySelector('.speed-menu');
        const speedOptions = wrapper.querySelectorAll('.speed-menu button');
        
        // Play/Pause
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playBtn.textContent = '⏸';
                playBtn.classList.add('playing');
            } else {
                audio.pause();
                playBtn.textContent = '▶';
                playBtn.classList.remove('playing');
            }
        });
        
        // Skip -10
        skipBtn.addEventListener('click', () => {
            audio.currentTime = Math.max(0, audio.currentTime - 10);
        });
        
        // Loop
        loopBtn.addEventListener('click', () => {
            audio.loop = !audio.loop;
            loopBtn.classList.toggle('active');
        });
        
        // Update progress
        audio.addEventListener('timeupdate', () => {
            if (audio.duration > 0) {
                const percent = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = percent + '%';
                timeCurrent.textContent = formatTime(audio.currentTime);
            }
        });
        
        // Load duration
        audio.addEventListener('loadedmetadata', () => {
            timeTotal.textContent = formatTime(audio.duration);
        });
        
        // Try to set duration immediately
        if (audio.duration && isFinite(audio.duration)) {
            timeTotal.textContent = formatTime(audio.duration);
        }
        
        // Ended
        audio.addEventListener('ended', () => {
            if (!audio.loop) {
                playBtn.textContent = '▶';
                playBtn.classList.remove('playing');
                progressFill.style.width = '0%';
            }
        });
        
        // Seek
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = x / rect.width;
            audio.currentTime = percent * audio.duration;
        });
        
        // Mute
        muteBtn.addEventListener('click', () => {
            audio.muted = !audio.muted;
            muteBtn.textContent = audio.muted ? '🔇' : '🔊';
        });
        
        // Speed
        speedBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            speedMenu.classList.toggle('show');
        });
        
        document.addEventListener('click', () => {
            speedMenu.classList.remove('show');
        });
        
        speedOptions.forEach(btn => {
            btn.addEventListener('click', () => {
                const speed = parseFloat(btn.dataset.speed);
                audio.playbackRate = speed;
                speedBtn.textContent = speed.toFixed(2) + 'x';
                speedOptions.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                speedMenu.classList.remove('show');
            });
        });
    }
    
    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    
})();
