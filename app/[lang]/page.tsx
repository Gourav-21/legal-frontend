import Image from "next/image";
import { Locale } from "../../i18n-config"; // Import Locale type
import { getDictionary } from "../../get-dictionary"; // Import dictionary loader
import FileAnalysis from "@/components/FileAnalysis";
import LawyerModal from "@/components/LawyerModal";
import AiSummaryModal from "@/components/AiSummary";

// Define props type to include lang
interface HomeProps {
  params: Promise<{ lang: Locale }>;
}

export default async function Home(props: HomeProps) {
  const params = await props.params;

  const {
    lang
  } = params;

  // Make component async
  const dictionary = await getDictionary(lang); // Fetch dictionary
  return (
    <div>

      <main>
        <section className="hero-section">
          <div className="container">
            <h1 className="text-center mt-4" data-aos="fade-up" data-aos-duration="1500" dangerouslySetInnerHTML={{ __html: dictionary.hero.title }} />
            <p className="text-lg text-center mb-xl-5 mb-4" data-aos="fade-up" data-aos-duration="1500">
              {dictionary.hero.subtitle}
            </p>
            <div className="Upload-document" data-aos="fade-up" data-aos-duration="1500">
              <Image 
                className="vector1" 
                src="/img/vector1.svg" 
                alt="vector" 
                width={200} 
                height={200}
                data-aos="fade-right" 
                data-aos-offset="300"
                data-aos-easing="ease-in-sine"
              />
              <Image className="coin1 bounce-1" src="/img/coin.svg" alt="coin" width={50} height={50} />
              <Image className="coin2 bounce-1" src="/img/coin.svg" alt="coin" width={50} height={50} />
              <h3 className="mb-1">{dictionary.hero.uploadTitle}</h3>
              <p className="mb-3">{dictionary.hero.uploadSubtitle}</p>
              
              {/* Combined File Upload and Analysis Component */}
              <FileAnalysis lang={lang} dictionary={dictionary} />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="HowItWorks-section text-white text-center" data-aos="fade-up" data-aos-duration="1500">
          <div className="container">
            <h2 className="text-white" data-aos="fade-up" data-aos-duration="1500" dangerouslySetInnerHTML={{ __html: dictionary.howItWorks.title }} />
            <p data-aos="fade-up" data-aos-duration="1500">{dictionary.howItWorks.subtitle}</p>
            <Image 
              className="HowITWorks-curve-line"
              src="/img/curve-line.svg"
              alt=""
              width={800}
              height={100}
            />
            <div className="row">
              {[
                { icon: "Payslip", count: "01", ...dictionary.howItWorks.steps[0] },
                { icon: "Analysis", count: "02", ...dictionary.howItWorks.steps[1] },
                { icon: "Report", count: "03", ...dictionary.howItWorks.steps[2] },
              ].map((step, index) => (
                <div key={index} className="col-md-4" data-aos="fade-up" data-aos-duration="1500">
                  <div className={`HowITWorks-card ${index === 0 ? 'HowITWorks-card-left' : index === 2 ? 'HowITWorks-card-right' : ''} mt-4 ${index === 1 ? 'mt-md-5' : ''}`}>
                    <div className="HowITWorks-icon bounce-1">
                      <Image src={`/img/${step.icon}.svg`} alt="" width={50} height={50} />
                    </div>
                    <div className="HowITWorks-card-body">
                      <h2 className="counting">{step.count}</h2>
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="WhyUs-section" data-aos="fade-up" data-aos-duration="1500">
          <div className="container position-relative">
            <div className="row">
              <div className="col-lg-7">
                <div className="row my-lg-3 ps-4">
                  <div className="col-lg-8" data-aos="fade-up" data-aos-duration="1500">
                    <h2 dangerouslySetInnerHTML={{ __html: dictionary.whyUs.title }} />
                    <p>
                      {dictionary.whyUs.description}
                    </p>
                  </div>
                </div>
                <div className="WhyUs-card" data-aos="fade-up" data-aos-duration="1500">
                  <div className="row">
                    <div className="col-md-6" data-aos="fade-left" data-aos-offset="300" data-aos-easing="ease-in-sine">
                      <h4>{dictionary.whyUs.withoutTitle}</h4>
                      <ul className="Without">
                        {dictionary.whyUs.withoutItems.map((item, index) => (
                          <li key={index}>
                            <i className="bi bi-x"></i>
                            <h5>{item.title}</h5>
                            <p>{item.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-md-6 mt-4 mt-md-0" data-aos="fade-right" data-aos-offset="300" data-aos-easing="ease-in-sine">
                      <h4>{dictionary.whyUs.withTitle}</h4>
                      <ul className="with">
                        {dictionary.whyUs.withItems.map((item, index) => (
                          <li key={index}>
                            <i className="bi bi-check2"></i>
                            <h5>{item.title}</h5>
                            <p>{item.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Image className="WhyUs-img" src="/img/WhyUs.jpg" alt="" width={800} height={500} data-aos="fade-up" data-aos-duration="1500" />
          </div>
        </section>

        {/* Pricing CTA Section */}
        <section className="PricingCTA-section" data-aos="fade-up" data-aos-duration="1500">
          <div className="container position-relative">
            <Image className="coin1 bounce-1" src="/img/coin.svg" alt="coin" width={50} height={50} />
            <Image className="coin2 bounce-1" src="/img/coin.svg" alt="coin" width={50} height={50} />
            <div className="PricingCTA">
              <div className="row">
                <div className="col-md-6 justify-content-center align-items-end d-flex order-2 order-md-1" data-aos="fade-right" data-aos-offset="300" data-aos-easing="ease-in-sine">
                  <Image className="vector2" src="/img/vector2.svg" alt="" width={300} height={300} />
                </div>
                <div className="col-md-6 order-1 order-md-2" data-aos="fade-left" data-aos-offset="300" data-aos-easing="ease-in-sine">
                  <h2>{dictionary.pricingCta.title}</h2>
                  <p className="text-lg">{dictionary.pricingCta.subtitle}</p>
                  <button type="button" className="btn btn-primary mt-4 mb-5">
                    {dictionary.pricingCta.button}
                    <span>
                      <Image src="/img/pro-g.svg" alt="" width={20} height={20} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <AiSummaryModal lang={lang} dictionary={dictionary} />

        {/* Lawyer Modal */}
        <LawyerModal lang={lang} dictionary={dictionary} />
      </main>
    </div>
  );
}
