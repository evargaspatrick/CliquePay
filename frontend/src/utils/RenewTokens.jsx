import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export const renewTokens = async () => {
    try {
        const accessToken = Cookies.get('accessToken');
        const idToken = Cookies.get('idToken');
        const refreshToken = Cookies.get('refreshToken');

        if (!accessToken || !idToken || !refreshToken) {
            console.log('Missing tokens, redirecting to login');
            return false;
        }

        let needsRenewal = false;
        try {
            const accessTokenDecoded = jwtDecode(accessToken);
            const idTokenDecoded = jwtDecode(idToken);
            const currentTime = Math.floor(Date.now() / 1000);
            
            needsRenewal = accessTokenDecoded.exp <= currentTime + 300 || 
                           idTokenDecoded.exp <= currentTime + 300;
        } catch (e) {
            console.error('Token decode error:', e);
            return false;
        }

        if (needsRenewal) {
            const response = await fetch('http://127.0.0.1:8000/api/renew/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    refresh_token: refreshToken,
                    id_token: idToken
                })
            });

            const data = await response.json();
            if (data.status !== 'SUCCESS') {
                console.error('Token renewal failed:', data.message);
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error('Token renewal error:', error);
        return false;
    }
};