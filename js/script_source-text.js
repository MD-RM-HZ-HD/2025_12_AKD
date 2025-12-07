/**
 * ملف التحكم الرئيسي للصفحة (script_source-text.js)
 * يحتوي على:
 * 1. منطق Alpine.js (للتنظيف والاختصار في HTML)
 * 2. تشغيل القائمة العلوية (Navbar)
 * 3. منع تداخل الأصوات (Audio Control)
 */

// --- ثانياً: الوظائف التي تعمل عند اكتمال تحميل الصفحة ---
document.addEventListener('DOMContentLoaded', function() {

    // 2. التحكم في الأصوات (Audio Smart Control)
    // إيقاف أي صوت يعمل حالياً عند تشغيل صوت جديد
    const allAudios = document.querySelectorAll('audio');

    allAudios.forEach(audio => {
        audio.addEventListener('play', function() {
            allAudios.forEach(otherAudio => {
                // إذا لم يكن هو الصوت الذي ضغطنا عليه، قم بإيقافه
                if (otherAudio !== audio) {
                    otherAudio.pause();
                }
            });
        });
    });

});