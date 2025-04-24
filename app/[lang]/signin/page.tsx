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

  const pricingDict = dictionary.pricing;

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
              <h1 className="py-4 py-md-5 px-lg-5 px-3 mb-0">
                Smarter Payroll<span className="text-yellow">,</span>
                <br />
                Legal Precision<span className="text-yellow">.</span>
              </h1>
              <Image
                className="login-registration-img"
                src="/img/login-registration-img.png"
                alt=""
                width={500}
                height={500}
              />
            </div>
            <div className="right-form">
              <h3>
              Log in to <br />
              <span className="text-primary">Paynalyze</span> first.
              </h3>
              <p className="mb-4">Access your payroll insights instantly.</p>

              <div className="form-floating mb-4">
              <input
                type="email"
                className="form-control"
                id="floatingEmail"
                placeholder="Enter your email"
              />
              <label htmlFor="floatingEmail">Email</label>
              </div>
              <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Enter your password"
              />
              <label htmlFor="floatingPassword">Password</label>
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
                  Remember Me
                </label>
                </div>
              </div>
              <div className="col-6 text-end">
                <a href="#" className="link-primary fw-600">
                Forgot Password?
                </a>
              </div>
              </div>

              <button
              type="submit"
              className="btn btn-lg btn-primary without-icon w-100 mb-4"
              >
              Sign In
              </button>
              <div className="divider mb-4">
              <span>OR</span>
              </div>

              <div className="row social-media-btn">
              <div className="col-sm-4 mb-3">
                <button type="submit" className="btn btn-yellow w-100">
                Google
                <span>
                  <Image src="/img/google.png" alt="" width={20} height={20} />
                </span>
                </button>
              </div>
              <div className="col-sm-4 mb-3">
                <button type="submit" className="btn btn-yellow w-100">
                Facebook
                <span>
                  <Image src="/img/Facebook.png" alt="" width={20} height={20} />
                </span>
                </button>
              </div>
              <div className="col-sm-4 mb-3">
                <button type="submit" className="btn btn-yellow w-100">
                Apple
                <span>
                  <Image src="/img/Apple.png" alt="" width={20} height={20} />
                </span>
                </button>
              </div>
              </div>
              <p className="mb-0 text-center">
              Don't have a Paynalyze account?{" "}
              <Link href={`/${lang}/signup`} className="link-primary fw-600">
                Sign Up
              </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
  
}
