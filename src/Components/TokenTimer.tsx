import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
    exp: number;
}

const TokenTimer = () => {
    const router = useRouter();
    const [expirationDate, setExpirationDate] = useState<string>('');
    const [isTokenValid, setIsTokenValid] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const decodedToken = jwt.decode(token) as DecodedToken | null;

            const currentTime = Date.now() / 1000;

            if (!decodedToken || decodedToken.exp < currentTime) {
                localStorage.removeItem('auth_token');
                router.push('/');
                setIsTokenValid(false);
                return;
            }

            const expiration = new Date(decodedToken.exp * 1000);
            setExpirationDate(expiration.toLocaleString());
            setIsTokenValid(true);

            console.log('Decoded Token:', decodedToken);
        } catch (error) {
            console.error("Failed to decode token:", error);
            localStorage.removeItem('auth_token');
            router.push('/');
            setIsTokenValid(false);
        }
    }, [router]);

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6">Admin Panel</h1>
            <p className="text-lg mb-4">
                {isTokenValid
                    ? `Expiration Date: ${expirationDate}`
                    : 'Token is invalid or expired. Please log in again.'}
            </p>
        </div>
    );
};

export default TokenTimer;
