import Image from "next/image";
import { Locale } from "../../../i18n-config"; // Adjust path as needed
import { getDictionary } from "../../../get-dictionary"; // Adjust path as needed
import Link from "next/link";

interface PricingProps {
  params: Promise<{ lang: Locale }>;
}

export default async function PricingPage(props: PricingProps) {
  const params = await props.params;
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  const signinDict = dictionary.signin;

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
              <h1 className="py-4 py-md-5 px-lg-5 px-3 mb-0" dangerouslySetInnerHTML={{ __html: signinDict.leftBannerTitle }}></h1>
              <Image
                className="login-registration-img"
                src="/img/login-registration-img.png"
                alt={signinDict.leftBannerImageAlt}
                width={500}
                height={400}
              />
            </div>
            <div className="right-form">
              <h3 dangerouslySetInnerHTML={{ __html: signinDict.title }}></h3>
              <p className="mb-4">{signinDict.subtitle}</p>

              <div className="form-floating mb-4">
              <input
                type="email"
                className="form-control"
                id="floatingEmail"
                placeholder={signinDict.emailPlaceholder}
              />
              <label htmlFor="floatingEmail">{signinDict.emailLabel}</label>
              </div>
              <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder={signinDict.passwordPlaceholder}
              />
              <label htmlFor="floatingPassword">{signinDict.passwordLabel}</label>
              </div>
              <div className="row">
              <div className="col-6">
                <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  {signinDict.rememberMe}
                </label>
                </div>
              </div>
              <div className="col-6 text-end">
                <a href="#" className="link-primary fw-600">
                {signinDict.forgotPassword}
                </a>
              </div>
              </div>

              <button
              type="submit"
              className="btn btn-lg btn-primary without-icon w-100 mb-4"
              >
              {signinDict.signInButton}
              </button>
              <div className="divider mb-4">
              <span>{signinDict.orDivider}</span>
              </div>

              <div className="row social-media-btn">
              <div className="col-sm-4 mb-3">
                <button type="submit" className="btn btn-yellow w-100">
                {signinDict.googleButton}
                <span>
                  <Image src="/img/google.png" alt={signinDict.googleImageAlt} width={20} height={20} />
                </span>
                </button>
              </div>
              <div className="col-sm-4 mb-3">
                <button type="submit" className="btn btn-yellow w-100">
                {signinDict.facebookButton}
                <span>
                  <Image src="/img/Facebook.png" alt={signinDict.facebookImageAlt} width={20} height={20} />
                </span>
                </button>
              </div>
              <div className="col-sm-4 mb-3">
                <button type="submit" className="btn btn-yellow w-100">
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
          </div>
        </div>
      </section>
    </main>
  );
  
}
