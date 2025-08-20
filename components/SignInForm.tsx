'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '../i18n-config'; // Adjust path if needed based on actual location
import useAuthStore from '../store/authStore'; // Import the auth store

interface SignInFormProps {
    lang: Locale;
    dictionary: any
}

export default function SignInForm({ lang, dictionary }: SignInFormProps) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const signinDict = dictionary.signin;
    const { login } = useAuthStore(); // Use the auth store

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        try {
            // Adjust the URL '/api/login' if your backend API is hosted elsewhere
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || signinDict.loginError);
            }

            const userData = await response.json(); // Get user data from response
            login(userData.email); // Update auth store with user email

            // Login successful, redirect or update UI
            // The API sets an HttpOnly cookie, so no token handling needed here directly
            // Redirect to a dashboard or home page after successful login
            router.push(`/${lang}/`); // Example redirect
            // Or perhaps refresh the page to reflect logged-in state
            // router.refresh();

        } catch (err: any) {
            setError(err.message || signinDict.loginError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="right-form">
            <h3 dangerouslySetInnerHTML={{ __html: signinDict.title }}></h3>
            <p className="mb-4">{signinDict.subtitle}</p>

            {error && <div className="alert alert-danger mb-3">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-floating mb-4">
                    <input
                        type="email"
                        className="form-control"
                        id="floatingEmail"
                        placeholder={signinDict.emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <label htmlFor="floatingEmail">{signinDict.emailLabel}</label>
                </div>
                <div className="form-floating mb-4">
                    <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder={signinDict.passwordPlaceholder}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                    <label htmlFor="floatingPassword">{signinDict.passwordLabel}</label>
                </div>

                <button
                    type="submit"
                    className="btn btn-lg btn-primary without-icon w-100 mb-4"
                    disabled={loading}
                >
                    {loading ? 'Signing In...' : signinDict.signInButton}
                </button>

                <div className="row mb-4">
                    <div className="col-6">
                        {/* <div className={`${lang === 'he' ? '' : 'form-check'} mb-4`} dir={lang === 'he' ? 'rtl' : 'ltr'}>
                            <input
                                className={`form-check-input ${lang === 'he' ? 'mx-2' : ''}`}
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                disabled={loading}
                            />
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                {signinDict.rememberMe}
                            </label>
                        </div> */}
                    </div>
                    <div className={`col-6 ${lang === 'he' ? 'text-start' : 'text-end'}`}>
                        <Link href="#" className="link-primary fw-600">
                            {signinDict.forgotPassword}
                        </Link>
                    </div>
                </div>


            </form>

            {/* Social login and sign up link remain outside the main form */}
            <div className="divider mb-4">
                <span>{signinDict.orDivider}</span>
            </div>

            <div className="row social-media-btn">
                <div className="col-sm-4 mb-3">
                    <button type="button" className="btn btn-yellow w-100" disabled={loading}>
                        {signinDict.googleButton}
                        <span>
                            <Image src="/img/Google.png" alt={signinDict.googleImageAlt} width={20} height={20} />
                        </span>
                    </button>
                </div>
                <div className="col-sm-4 mb-3">
                    <button type="button" className="btn btn-yellow w-100" disabled={loading}>
                        {signinDict.facebookButton}
                        <span>
                            <Image src="/img/Facebook.png" alt={signinDict.facebookImageAlt} width={20} height={20} />
                        </span>
                    </button>
                </div>
                <div className="col-sm-4 mb-3">
                    <button type="button" className="btn btn-yellow w-100" disabled={loading}>
                        {signinDict.appleButton}
                        <span>
                            <Image src="/img/Apple.png" alt={signinDict.appleImageAlt} width={20} height={20} />
                        </span>
                    </button>
                </div>
            </div>
            <p className="mb-0 text-center">
                {signinDict.noAccount}{" "}
                <Link href={`/${lang}/signup`} className="link-primary fw-600">
                    {signinDict.signUpLink}
                </Link>
            </p>
        </div>
    );
}
