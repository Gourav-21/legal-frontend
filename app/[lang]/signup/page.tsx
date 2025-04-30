import Image from "next/image";
import { Locale } from "../../../i18n-config"; // Adjust path as needed
import { getDictionary } from "../../../get-dictionary"; // Adjust path as needed
import Link from "next/link";

interface SignUpPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function SignUpPage(props: SignUpPageProps) {
  const params = await props.params;
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  const signupDict = dictionary.signup;

  return (
    <main>
      {/* SignUp section */}
      <section className="SignUp-section">
        <div className="container">
          <div
            className="SignUp-SignIn-card mt-4"
            data-aos="fade-up"
            data-aos-duration="1500"
          >
            <div className="left-banner">
              <h1 className="py-4 py-md-5 px-lg-5 px-3 mb-0" dangerouslySetInnerHTML={{ __html: signupDict.leftBannerTitle }}></h1>
              <Image
                className="login-registration-img"
                src="/img/login-registration-img.png"
                alt="Signup Banner"
                width={500} // Add appropriate width
                height={400} // Add appropriate height
              />
            </div>
            <div className="right-form">
              <h3 dangerouslySetInnerHTML={{ __html: signupDict.rightFormTitle }}></h3>
              <p className="mb-4">{signupDict.rightFormSubtitle}</p>

              <div className="form-floating mb-4">
                <input
                  type="text"
                  className="form-control"
                  id="floatingName"
                  placeholder={signupDict.namePlaceholder}
                />
                <label htmlFor="floatingName">{signupDict.nameLabel}</label>
              </div>
              <div className="form-floating mb-4">
                <input
                  type="email"
                  className="form-control"
                  id="floatingEmail"
                  placeholder={signupDict.emailPlaceholder}
                />
                <label htmlFor="floatingEmail">{signupDict.emailLabel}</label>
              </div>
              <div className="form-floating mb-4">
                <input
                  type="phone"
                  className="form-control"
                  id="floatingPhone"
                  placeholder={signupDict.phonePlaceholder}
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
                    />
                    <label htmlFor="floatingReEnter">{signupDict.reEnterPasswordLabel}</label>
                  </div>
                </div>
              </div>

              <div className={`${lang === 'he' ? '' : 'form-check'} mb-4`} dir={lang === 'he' ? 'rtl' : 'ltr'}>
                <input
                  className={`form-check-input ${lang === 'he' ? 'mx-2' : ''}`}
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault" dangerouslySetInnerHTML={{ __html: signupDict.termsCheckboxLabel }}></label>
              </div>

              <button
                type="submit"
                className="btn btn-lg btn-primary without-icon w-100 mb-4"
              >
                {signupDict.freeSignUpButton}
              </button>
              <div className="divider mb-4">
                <span>{signupDict.orDivider}</span>
              </div>

              <div className="row social-media-btn">
                <div className="col-sm-4 mb-3">
                  <button type="submit" className="btn btn-yellow w-100">
                    {signupDict.googleButton}
                    <span>
                      <Image src="/img/google.png" alt="Google" width={20} height={20} />
                    </span>
                  </button>
                </div>
                <div className="col-sm-4 mb-3">
                  <button type="submit" className="btn btn-yellow w-100">
                    {signupDict.facebookButton}
                    <span>
                      <Image src="/img/Facebook.png" alt="Facebook" width={20} height={20} />
                    </span>
                  </button>
                </div>
                <div className="col-sm-4 mb-3">
                  <button type="submit" className="btn btn-yellow w-100">
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
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}