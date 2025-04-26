import Image from "next/image";
import { Locale } from "../../../i18n-config"; // Adjust path as needed
import { getDictionary } from "../../../get-dictionary"; // Adjust path as needed

interface AboutPageProps { // Renamed interface for clarity
  params: Promise<{ lang: Locale }>;
}

export default async function AboutPage(props: AboutPageProps) { // Renamed component for clarity
  const params = await props.params;
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  const aboutContent = dictionary.about; // Access the about section

  return (
    <main>
      {/* about hero section */}
      <section
        className="about-hero-section"
        data-aos="fade-up"
        data-aos-duration="1500"
      >
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-md-10">
              {/* Use dictionary content for title */}
              <h1 dangerouslySetInnerHTML={{ __html: aboutContent.title.replace('\n', '<br />') }}></h1>
              {/* Use dictionary content for description */}
              <p className="text-lg mb-4">
                {aboutContent.description}
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
            {/* Map over stats from dictionary */}
            {aboutContent.stats.map((stat, index) => (
              <div key={index} className="col-sm-6 col-md-3 mt-4">
                <h2 className="fw-300 mb-0">{stat.value}</h2>
                <p>{stat.text}</p>
              </div>
            ))}
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
              {/* Use dictionary content for What We Do title */}
              <h2 className="mt-4" dangerouslySetInnerHTML={{ __html: aboutContent.whatWeDo.title.replace('\n', '<br />') }}></h2>
              {/* Map over What We Do description from dictionary */}
              {aboutContent.whatWeDo.description.map((desc, index) => (
                <p key={index}>{desc}</p>
              ))}
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
              {/* Use dictionary content for Mission title */}
              <h2 className="mt-0 mt-lg-4">{aboutContent.mission.title}</h2>
              {/* Use dictionary content for Mission description */}
              <p>
                {aboutContent.mission.description}
              </p>

              <h4>Our Core Values</h4>
              <ul className="icon-list">
                {/* Map over Core Values from dictionary */}
                {aboutContent.mission.coreValues.map((value, index) => (
                  <li key={index}>
                    <Image
                      src={`/img/${value.icon}`}
                      alt=""
                      width={24}
                      height={24}
                    />{" "}
                    <p>
                      <span>{value.title}</span> {value.description}
                    </p>
                  </li>
                ))}
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
