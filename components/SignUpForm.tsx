'use client'

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import useAuthStore from '../store/authStore'; // Import the auth store

interface SignUpFormProps {
  signupDict: any; // Replace 'any' with a more specific type if available
  lang: string;
}

export default function SignUpForm({ signupDict, lang }: SignUpFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore(); // Use the auth store

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Reset error before new submission

    if (password !== reEnterPassword) {
      setError(signupDict.passwordMismatchError || 'Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setError(signupDict.termsRequiredError || 'You must agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      // Assuming your backend API is running on the same origin or proxied
      // Adjust the URL if your backend is hosted elsewhere
      const response = await fetch('/api/auth/register', { // Adjust this path if needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password , name, phone_no:phone }), // Only sending email and password as per API spec
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific errors from the backend
        throw new Error(data.detail || signupDict.defaultError || 'An error occurred during sign up');
      }

      login(data.email); // Update auth store with user email

      // Signup successful, potentially redirect or show success message
      console.log('Signup successful:', data);
      // Redirect to home page after successful registration
      router.push(`/${lang}/`);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 dangerouslySetInnerHTML={{ __html: signupDict.rightFormTitle }}></h3>
      <p className="mb-4">{signupDict.rightFormSubtitle}</p>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <div className="form-floating mb-4">
        <input
          type="text"
          className="form-control"
          id="floatingName"
          placeholder={signupDict.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required // Add basic required validation
        />
        <label htmlFor="floatingName">{signupDict.nameLabel}</label>
      </div>
      <div className="form-floating mb-4">
        <input
          type="email"
          className="form-control"
          id="floatingEmail"
          placeholder={signupDict.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="floatingEmail">{signupDict.emailLabel}</label>
      </div>
      <div className="form-floating mb-4">
        <input
          type="tel" // Use type="tel" for phone numbers
          className="form-control"
          id="floatingPhone"
          placeholder={signupDict.phonePlaceholder}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          // Add validation if needed
        />
        <label htmlFor="floatingPhone">{signupDict.phoneLabel}</label>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder={signupDict.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="floatingPassword">{signupDict.passwordLabel}</label>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="floatingReEnter"
              placeholder={signupDict.reEnterPasswordPlaceholder}
              value={reEnterPassword}
              onChange={(e) => setReEnterPassword(e.target.value)}
              required
            />
            <label htmlFor="floatingReEnter">{signupDict.reEnterPasswordLabel}</label>
          </div>
        </div>
      </div>

      <div className={`${lang === 'he' ? '' : 'form-check'} mb-4`} dir={lang === 'he' ? 'rtl' : 'ltr'}>
        <input
          className={`form-check-input ${lang === 'he' ? 'mx-2' : ''}`}
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          id="flexCheckDefault"
        />
        <label className="form-check-label" htmlFor="flexCheckDefault" dangerouslySetInnerHTML={{ __html: signupDict.termsCheckboxLabel }}></label>
      </div>

      <button
        type="submit"
        className="btn btn-lg btn-primary without-icon w-100 mb-4"
        disabled={isLoading}
      >
        {isLoading ? (signupDict.loadingButton || 'Signing Up...') : signupDict.freeSignUpButton}
      </button>
      <div className="divider mb-4">
        <span>{signupDict.orDivider}</span>
      </div>

      {/* Social media buttons (functionality not implemented here) */}
      <div className="row social-media-btn">
         <div className="col-sm-4 mb-3">
           <button type="button" className="btn btn-yellow w-100"> {/* Changed to type="button" */}
             {signupDict.googleButton}
             <span>
               <Image src="/img/Google.png" alt="Google" width={20} height={20} />
             </span>
           </button>
         </div>
         <div className="col-sm-4 mb-3">
           <button type="button" className="btn btn-yellow w-100"> {/* Changed to type="button" */}
             {signupDict.facebookButton}
             <span>
               <Image src="/img/Facebook.png" alt="Facebook" width={20} height={20} />
             </span>
           </button>
         </div>
         <div className="col-sm-4 mb-3">
           <button type="button" className="btn btn-yellow w-100"> {/* Changed to type="button" */}
             {signupDict.appleButton}
             <span>
               <Image src="/img/Apple.png" alt="Apple" width={20} height={20} />
             </span>
           </button>
         </div>
       </div>
      <p className="mb-0 text-center">
        {signupDict.signInPrompt}{" "}
        <Link href={`/${lang}/signin`} className="link-primary fw-600">
          {signupDict.signInLink}
        </Link>
      </p>
    </form>
  );
}
