// إصلاح عناصر الصوت عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    
    // التأكد من تفعيل controls على جميع عناصر audio
    const allAudios = document.querySelectorAll('audio');
    
    allAudios.forEach(audio => {
        // تفعيل controls
        audio.setAttribute('controls', 'controls');
        audio.controls = true;
        
        // التأكد من الظهور
        audio.style.display = 'block';
        audio.style.width = '100%';
        audio.style.visibility = 'visible';
        audio.style.opacity = '1';
        
        console.log('Audio element fixed:', audio); // للتأكد من التنفيذ
    });
});


