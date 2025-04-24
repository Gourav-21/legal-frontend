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
      {/* Pricing section */}
      <section className="Pricing-section">
        <div className="container">
          <h1 className="text-center mt-4" data-aos="fade-up" data-aos-duration="1500">{pricingDict.title}</h1>
          <p className="text-lg text-center mb-4" data-aos="fade-up" data-aos-duration="1500">
            {pricingDict.subtitle}
          </p>

          <div className="pricing-switch-head" data-aos="fade-up" data-aos-duration="1500">
            <div className="form-check form-switch">
              <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{pricingDict.monthly}</label>
              <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
              <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{pricingDict.annually}</label>
            </div>
            <p className="off-arrow"><Image className="bounce-2" src="/img/arrow2.svg" alt="" width={20} height={20} /> {pricingDict.discountOffer}</p>
          </div>

          <div className="row">
            {/* Free Plan */}
            <div className="col-lg-4 col-md-6 mt-4 mt-lg-5" data-aos="zoom-in-up" data-aos-duration="1000">
              <div className="plan-card">
                <div className="plan-card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">{pricingDict.freePlan.title}</h4>
                    <Image className="plan-icon" src="/img/activated-icon.svg" alt="" width={30} height={30} />
                  </div>
                  <h2 className="mt-3">{pricingDict.freePlan.price}<small>/{pricingDict.freePlan.period}</small></h2>
                  <p className="text-dark" dangerouslySetInnerHTML={{ __html: `<span class="fw-700">${pricingDict.freePlan.description}</span>` }} />
                  <button type="submit" className="btn without-icon btn-yellow w-100">{pricingDict.freePlan.buttonText}</button>
                </div>
                <ul className="plan-features">
                  {pricingDict.freePlan.features.map((feature: string, index: number) => (
                    <li key={index}>
                      <i className={`bi ${index < 2 ? 'bi-check2' : 'bi-x'}`}></i> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Basic Plan */}
            <div className="col-lg-4 col-md-6 mt-4 mt-lg-5" data-aos="zoom-in-up" data-aos-duration="1000">
              <div className="plan-card">
                <div className="plan-card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">{pricingDict.basicPlan.title}</h4>
                    <span className="badge mb-3">{pricingDict.basicPlan.badge}</span>
                  </div>
                  <h2 className="mt-3">{pricingDict.basicPlan.price}<small>/{pricingDict.basicPlan.period}</small></h2>
                  <p className="text-dark mb-md-5"><span className="fw-700">{pricingDict.basicPlan.description}</span></p>
                  <button type="submit" className="btn without-icon btn-primary w-100">{pricingDict.basicPlan.buttonText}</button>
                </div>
                <ul className="plan-features">
                  {pricingDict.basicPlan.features.map((feature: string, index: number) => (
                     <li key={index}>
                      <i className={`bi ${index < 2 ? 'bi-check2' : 'bi-x'}`}></i> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="col-lg-4 col-md-6 mt-4 mt-lg-5" data-aos="zoom-in-up" data-aos-duration="1000">
              <div className="plan-card">
                <div className="plan-card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">{pricingDict.proPlan.title}</h4>
                    <Image className="plan-icon" src="/img/pro-icon.svg" alt="" width={30} height={30} />
                  </div>
                  <h2 className="mt-3">{pricingDict.proPlan.price}<small>/{pricingDict.proPlan.period}</small></h2>
                  <p className="text-dark mb-md-5"><span className="fw-700">{pricingDict.proPlan.description}</span></p>
                  <button type="submit" className="btn without-icon btn-yellow w-100">{pricingDict.proPlan.buttonText}</button>
                </div>
                <ul className="plan-features">
                   {pricingDict.proPlan.features.map((feature: string, index: number) => (
                     <li key={index}>
                      <i className="bi bi-check2"></i> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
