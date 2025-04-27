import Image from "next/image";
import { getDictionary } from "../../../get-dictionary"; // Adjust path as needed
import { Locale } from "../../../i18n-config"; // Adjust path as needed

interface SubscribePageProps { // Renamed interface
  params: Promise<{ lang: Locale }>;
}

export default async function SubscribePage(props: SubscribePageProps) { // Renamed component
  const params = await props.params;
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  const subscribeDict = dictionary.subscribe; // Use subscribe dictionary

  return (
    <main>
      <section className="SignUp-section">
        <div className="container">
          <div className="SignUp-SignIn-card mt-4" data-aos="fade-up" data-aos-duration="1500">
            <div className="left-banner">
              <div className="subscription-plan py-4 py-md-5 px-lg-5 px-3 w-100">
                <h4 className="mb-2" dangerouslySetInnerHTML={{ __html: subscribeDict.title }}></h4>
                <h1 className="mb-4 fw-200">
                  {subscribeDict.price} <small>{subscribeDict.period}</small>
                </h1>
                <ul className="subscription-plan-list">
                  <li>
                    <span>
                      {subscribeDict.planDetails.title} <small>{subscribeDict.planDetails.billing}</small>
                    </span>
                    <span>{subscribeDict.planDetails.price}</span>
                  </li>
                  <li>
                    <span>
                      {subscribeDict.subtotal.title} <small>{subscribeDict.subtotal.taxInfo} <i className="bi bi-info-circle ms-1"></i></small>
                    </span>
                    <span>
                      {subscribeDict.subtotal.price} <small>{subscribeDict.subtotal.taxAmount}</small>
                    </span>
                  </li>
                  <li>
                    <span>{subscribeDict.totalDue.title}</span> <span>{subscribeDict.totalDue.price}</span>
                  </li>
                </ul>
              </div>

              <Image 
                className="login-registration-img"
                src="/img/login-registration-img.png"
                alt="Registration"
                width={500}
                height={400} // Adjusted height to match signup page
              />
            </div>
            
            <div className="right-form">
              <h3 className="mb-4" dangerouslySetInnerHTML={{ __html: subscribeDict.paymentMethodTitle }}></h3>

              <div className="form-group mb-4">
                <label className="form-label">{subscribeDict.cardInfoLabel}</label>
                <div className="form-group-card">
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder={subscribeDict.cardPlaceholder} />
                    <button className="btn btn-outline-secondary" type="button">
                      <i className="fa-brands fa-cc-visa"></i>
                    </button>
                    <button className="btn btn-outline-secondary" type="button">
                      <i className="fa-brands fa-cc-mastercard"></i>
                    </button>
                    <button className="btn btn-outline-secondary" type="button">
                      <i className="fa-brands fa-cc-amex"></i>
                    </button>
                    <button className="btn btn-outline-secondary" type="button">
                      <i className="fa-brands fa-cc-jcb"></i>
                    </button>
                  </div>
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder={subscribeDict.expiryPlaceholder} />
                    <input type="text" className="form-control" placeholder={subscribeDict.cvvPlaceholder} />
                    <Image src="/img/cvv.png" alt="CVV Icon" width={30} height={20} className="cvv" />
                  </div>
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="form-label">{subscribeDict.cardholderNameLabel}</label>
                <input type="text" className="form-control" placeholder={subscribeDict.cardholderNamePlaceholder} />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">{subscribeDict.countryLabel}</label>
                <div className="input-group-vertical">
                  <div className="dropdown language">
                    <button className="dropdown-toggle" type="button" data-bs-toggle="dropdown">
                      <Image src={lang === 'he' ? "/img/Israel.jpg" : "/img/us.jpg"} alt={lang === 'he' ? subscribeDict.countryOptionIsrael : subscribeDict.countryOptionUSA} width={20} height={15} /> {lang === 'he' ? subscribeDict.countryOptionIsrael : subscribeDict.countryOptionUSA}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        {/* TODO: Add logic to switch language via link/button */}
                        <button className="dropdown-item">
                          <Image src="/img/us.jpg" alt={subscribeDict.countryOptionUSA} width={20} height={15} /> {subscribeDict.countryOptionUSA}
                        </button>
                      </li>
                      <li>
                        {/* TODO: Add logic to switch language via link/button */}
                        <button className="dropdown-item">
                          <Image src="/img/Israel.jpg" alt={subscribeDict.countryOptionIsrael} width={20} height={15} /> {subscribeDict.countryOptionIsrael}
                        </button>
                      </li>
                    </ul>
                  </div>
                  <input type="text" className="form-control" placeholder={subscribeDict.addressPlaceholder} />
                </div>
              </div>

              <div className="form-check mb-4">
                <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  {subscribeDict.saveInfoCheckboxLabel} <br />
                  <small className="text-muted">
                    {subscribeDict.saveInfoCheckboxSubtext}
                  </small>
                </label>
              </div>

              <button type="submit" className="btn btn-lg btn-primary without-icon w-100 mb-4">
                {subscribeDict.subscribeButton}
              </button>
              
              <p className="mb-0 text-center text-sm text-muted px-sm-5">
                {subscribeDict.termsText}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
