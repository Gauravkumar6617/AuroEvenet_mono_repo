import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../services/api";

export default function OAuthCallback() {
    const navigate = useNavigate();
    const { setAuth, setLoading, setError } = useAuth();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const handleOAuthCallback = async () => {
            try {
                const error = searchParams.get('error');
                const provider = searchParams.get('provider');
                console.info('[OAuth] Callback page loaded', {
                    href: window.location.href,
                    provider,
                    error,
                    params: Object.fromEntries(searchParams.entries()),
                });

                if (error) {
                    console.error('OAuth error:', error);
                    setError(error);
                    navigate('/login?error=oauth_failed');
                    return;
                }

                setStatus('processing');

                // Since OAuth uses HttpOnly cookies, we need to verify authentication by calling /me endpoint
                try {
                    console.info('[OAuth] Fetching authenticated user via /me');
                    const response = await apiClient.getMe();
                    
                    if (response) {
                        console.info('[OAuth] /me returned user', {
                            id: response.id,
                            email: response.email,
                            username: response.username,
                            oauth_provider: response.oauth_provider,
                        });
                        // Store the user data from OAuth response
                        const user = {
                            id: response.id || 0,
                            email: response.email || '',
                            username: response.username || response.email?.split('@')[0] || '',
                            is_active: response.is_active || true,
                            is_verified: response.is_verified || true,
                            created_at: response.created_at || new Date().toISOString(),
                            updated_at: response.updated_at || new Date().toISOString(),
                            oauth_provider: response.oauth_provider || provider || 'unknown',
                            oauth_id: response.oauth_id || '',
                        };

                        localStorage.setItem('user', JSON.stringify(user));
                        setAuth(user);
                        setStatus('success');
                        
                        // Redirect to dashboard or home
                        setTimeout(() => {
                            console.info('[OAuth] Redirecting authenticated user to dashboard');
                            navigate('/dashboard');
                        }, 1000);
                    } else {
                        throw new Error('Failed to get user information');
                    }
                } catch (apiError) {
                    console.error('Failed to get user info:', apiError);
                    throw new Error('Authentication failed - could not retrieve user information');
                }

            } catch (error) {
                console.error('OAuth callback error:', error);
                setError(error.message || 'OAuth authentication failed');
                setStatus('error');
                
                setTimeout(() => {
                    navigate('/login?error=oauth_callback_failed');
                }, 2000);
            }
        };

        handleOAuthCallback();
    }, [searchParams, navigate, setAuth, setLoading, setError]);

    const getStatusMessage = () => {
        switch (status) {
            case 'loading':
                return 'Initializing OAuth flow...';
            case 'processing':
                return 'Processing authentication...';
            case 'success':
                return 'Authentication successful! Redirecting...';
            case 'error':
                return 'Authentication failed. Redirecting to login...';
            default:
                return 'Completing authentication...';
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'success':
                return 'border-green-600';
            case 'error':
                return 'border-red-600';
            default:
                return 'border-indigo-600';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center max-w-md mx-auto px-4">
                <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${getStatusColor()} mx-auto mb-4`}></div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {status === 'success' ? '✅ Success!' : '🔐 Authenticating'}
                </h2>
                <p className="text-gray-600 text-sm">{getStatusMessage()}</p>
                
                {status === 'error' && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-xs">
                            There was an issue with the authentication. You will be redirected to the login page.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
