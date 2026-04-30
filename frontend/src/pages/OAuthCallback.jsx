import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function OAuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    useEffect(() => {
        const handleOAuthCallback = async () => {
            const token = searchParams.get('token');
            const refreshToken = searchParams.get('refresh_token');
            const email = searchParams.get('email');
            const username = searchParams.get('username');
            const error = searchParams.get('error');

            console.log('OAuth Callback Params:', {
                hasToken: !!token,
                hasRefreshToken: !!refreshToken,
                email,
                username,
                error
            });

            if (error) {
                console.error('OAuth error:', error);
                navigate('/login?error=oauth_failed');
                return;
            }

            if (token) {
                try {
                    // Store the token and user info
                    localStorage.setItem('token', token);

                    // Create a minimal user object - you might want to fetch full user details
                    const user = {
                        id: 0,
                        email: searchParams.get('email') || 'user@example.com',
                        username: searchParams.get('username') || 'User',
                        is_active: true,
                        is_verified: true,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    };

                    localStorage.setItem('user', JSON.stringify(user));

                    // Navigate to home page
                    navigate('/');
                } catch (error) {
                    console.error('OAuth callback error:', error);
                    navigate('/login?error=callback_failed');
                }
            } else {
                // No token received, redirect to login
                navigate('/login?error=no_token');
            }
        };

        handleOAuthCallback();
    }, [searchParams, navigate, login]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Completing authentication...</p>
            </div>
        </div>
    );
}
