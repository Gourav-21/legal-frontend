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
      {/* contact us section */}
      <section
        className="about-hero-section"
        data-aos="fade-up"
        data-aos-duration="1500"
      >
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-md-10">
              <h1>
                Empowering Pay <br />
                Transparency for Everyone
              </h1>
              <p className="text-lg mb-4">
                We believe knowledge is power—and your paycheck shouldn&apos;t be a
                mystery. Paynalyze is built to help employees uncover the truth
                about their wages using cutting-edge AI and labor law
                intelligence.
              </p>
            </div>
          </div>
        </div>
        <video
          className="about-hero-video"
          width="100%"
          loop
          autoPlay
          muted
          playsInline
        >
          <source src="/img/about-hero.mp4" type="video/mp4" />
        </video>
        <div className="container text-center">
          <div className="row">
            <div className="col-sm-6 col-md-3 mt-4">
              <h2 className="fw-300 mb-0">25,000+</h2>
              <p>Payslips Analyzed</p>
            </div>
            <div className="col-sm-6 col-md-3 mt-4">
              <h2 className="fw-300 mb-0">1,200+</h2>
              <p>Labor Law Violations Detected</p>
            </div>
            <div className="col-sm-6 col-md-3 mt-4">
              <h2 className="fw-300 mb-0">100%</h2>
              <p>Confidential & Secure</p>
            </div>
            <div className="col-sm-6 col-md-3 mt-4">
              <h2 className="fw-300 mb-0">24×5</h2>
              <p>Dedicated Legal & Tech Support</p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="what-why-section"
        data-aos="fade-up"
        data-aos-duration="1500"
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 vector-card-main">
              <Image
                className="coin2 bounce-1"
                src="/img/coin.svg"
                alt="coin"
                width={50}
                height={50}
              />
              <div className="vector-card">
                <Image
                  src="/img/what-why-img1.svg"
                  alt=""
                  width={300}
                  height={300}
                />
              </div>
              <Image
                className="what-why-img2 bounce-1"
                src="/img/what-why-img2.svg"
                alt=""
                width={300}
                height={300}
              />
            </div>
            <div className="col-md-6">
              <h2 className="mt-4">
                What We Do <br />
                & Why We Do It.
              </h2>
              <p>
                At Paynalyze, we help employees uncover whether they’re being
                fairly compensated—by scanning payslips and employment
                contracts, analyzing the data, and delivering easy-to-understand
                legal reports.
              </p>
              <p>
                Our journey began with a simple idea: too many workers are
                unaware of their rights. What started as a passion project has
                grown into a mission to bring clarity, transparency, and
                fairness to workplaces everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="what-why-section"
        data-aos="fade-up"
        data-aos-duration="1500"
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="mt-0 mt-lg-4">Our Mission</h2>
              <p>
                To give every worker the tools to understand, question, and take
                control of their pay—because justice begins with transparency.
              </p>

              <h4>Our Core Values</h4>
              <ul className="icon-list">
                <li>
                  <Image
                    src="/img/Transparency.svg"
                    alt=""
                    width={24}
                    height={24}
                  />{" "}
                  <p>
                    <span>Transparency</span> We believe truth builds trust.
                  </p>
                </li>
                <li>
                  <Image
                    src="/img/Empowerment.svg"
                    alt=""
                    width={24}
                    height={24}
                  />{" "}
                  <p>
                    <span>Empowerment</span> Knowledge should be accessible to
                    everyone.
                  </p>
                </li>
                <li>
                  <Image
                    src="/img/Fairness.svg"
                    alt=""
                    width={24}
                    height={24}
                  />{" "}
                  <p>
                    <span>Fairness</span> Every paycheck deserves a second look.
                  </p>
                </li>
                <li>
                  <Image
                    src="/img/Innovation.svg"
                    alt=""
                    width={24}
                    height={24}
                  />{" "}
                  <p>
                    <span>Innovation</span> We harness AI to simplify complex
                    legal insights.
                  </p>
                </li>
              </ul>
            </div>
            <div className="col-md-6 vector-card-main">
              <Image
                className="coin2 bounce-1"
                src="/img/coin.svg"
                alt="coin"
                width={50}
                height={50}
              />
              <div className="vector-card">
                <Image
                  src="/img/our-mission-img1.svg"
                  alt=""
                  width={300}
                  height={300}
                />
              </div>
              <Image
                className="our-mission-img2 bounce-1"
                src="/img/our-mission-img2.svg"
                alt=""
                width={300}
                height={300}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="PricingCTA-section"
        data-aos="fade-up"
        data-aos-duration="1500"
      >
        <div className="container position-relative">
          <Image
            className="coin1 bounce-1"
            src="/img/coin.svg"
            alt="coin"
            width={50}
            height={50}
          />
          <Image
            className="coin2 bounce-1"
            src="/img/coin.svg"
            alt="coin"
            width={50}
            height={50}
          />
          <div className="PricingCTA">
            <div className="row">
              <div
                className="col-md-6 justify-content-center align-items-end d-flex order-2 order-md-1"
                data-aos="fade-right"
                data-aos-offset="300"
                data-aos-easing="ease-in-sine"
              >
                <Image
                  className="vector2"
                  src="/img/vector2.svg"
                  alt=""
                  width={300}
                  height={300}
                />
              </div>
              <div
                className="col-md-6 order-1 order-md-2"
                data-aos="fade-left"
                data-aos-offset="300"
                data-aos-easing="ease-in-sine"
              >
                <h2>Choose Your Plan Unlock Full Payroll Protection</h2>
                <p className="text-lg">
                  Get detailed reports, legal insights, and full compliance
                  verification.
                </p>
                <button type="submit" className="btn btn-primary mt-4 mb-5">
                  Upgrade to Pro
                  <span>
                    <Image src="/img/pro-g.svg" alt="" width={24} height={24} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
