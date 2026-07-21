import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../state/useAuthStore';

export function AuthTokensInterceptor({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const authTokensParam = searchParams.get('auth_tokens');
    if (!authTokensParam) return;

    try {
      const decoded = JSON.parse(atob(authTokensParam)) as {
        id: string;
        accessToken: string;
        refreshToken: string;
      };

      useAuthStore.getState().setLoginInfo({
        userId: decoded.id,
        accessToken: decoded.accessToken,
        refreshToken: decoded.refreshToken,
      });
    } catch {
      // Invalid token data — ignore
    }

    // Clean the URL
    searchParams.delete('auth_tokens');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  return <>{children}</>;
}
