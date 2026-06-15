import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
export const textToSpeech = async (text, voiceId = '21m00Tcm4lSxeVT6K37p') => {
    try {
        const response = await axios.post(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.5,
            },
        }, {
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json',
            },
            responseType: 'arraybuffer',
        });
        return response.data;
    }
    catch (error) {
        console.error('ElevenLabs Error:', error);
        throw error;
    }
};
//# sourceMappingURL=voiceService.js.map