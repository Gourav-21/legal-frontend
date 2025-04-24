import Image from "next/image";
import { Locale } from "../../../i18n-config"; // Adjust path as needed
import { getDictionary } from "../../../get-dictionary"; // Adjust path as needed

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
              <img
                className="login-registration-img"
                src="img/login-registration-img.png"
                alt=""
              />
            </div>
            <div className="right-form">
              <h3>
                Create your <span className="text-primary">Paynalyze</span>{" "}
                account. <br />
                Get started for free.
              </h3>
              <p className="mb-4">Get started with smarter payroll analysis.</p>

              <div className="form-floating mb-4">
                <input
                  type="text"
                  className="form-control"
                  id="floatingName"
                  placeholder="Enter your name"
                />
                <label htmlFor="floatingName">Name</label>
              </div>
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
                  type="phone"
                  className="form-control"
                  id="floatingPhone"
                  placeholder="Enter your phone"
                />
                <label htmlFor="floatingPhone">Phone</label>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-floating mb-4">
                    <input
                      type="password"
                      className="form-control"
                      id="floatingPassword"
                      placeholder="Set a password"
                    />
                    <label htmlFor="floatingPassword">Password</label>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-floating mb-4">
                    <input
                      type="password"
                      className="form-control"
                      id="floatingReEnter"
                      placeholder="Re-enter password"
                    />
                    <label htmlFor="floatingReEnter">Re-enter</label>
                  </div>
                </div>
              </div>

              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  I agree to the <a href="#">Terms of Service</a> and 
                  <a href="#">Privacy Policy</a>.
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-lg btn-primary without-icon w-100 mb-4"
              >
                Free Sign Up
              </button>
              <div className="divider mb-4">
                <span>OR</span>
              </div>

              <div className="row social-media-btn">
                <div className="col-sm-4 mb-3">
                  <button type="submit" className="btn btn-yellow w-100">
                    Google
                    <span>
                      <img src="img/google.png" alt="" />
                    </span>
                  </button>
                </div>
                <div className="col-sm-4 mb-3">
                  <button type="submit" className="btn btn-yellow w-100">
                    Facebook
                    <span>
                      <img src="img/Facebook.png" alt="" />
                    </span>
                  </button>
                </div>
                <div className="col-sm-4 mb-3">
                  <button type="submit" className="btn btn-yellow w-100">
                    Apple
                    <span>
                      <img src="img/Apple.png" alt="" />
                    </span>
                  </button>
                </div>
              </div>
              <p className="mb-0 text-center">
                Already have an Paynalyze account? 
                <a href="#" className="link-primary fw-600">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}