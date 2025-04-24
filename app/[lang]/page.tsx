import Image from "next/image";
// import styles from "../page.module.css";
import { Locale } from "../../i18n-config"; // Import Locale type
import { getDictionary } from "../../get-dictionary"; // Import dictionary loader

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
      <header>
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <a className="navbar-brand" href={`/${lang}`}> {/* Updated href */}
              <Image src="/img/logo.png" alt="Logo" width={150} height={40} />
            </a>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href={`/${lang}`}>{dictionary.navigation.home}</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href={`/${lang}/pricing`}>{dictionary.navigation.pricing}</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href={`/${lang}/reports`}>{dictionary.navigation.reports}</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href={`/${lang}/about`}>{dictionary.navigation.about}</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href={`/${lang}/contact`}>{dictionary.navigation.contact}</a>
                </li>
              </ul>
              <div className="d-flex justify-content-center">
                <div className="dropdown language">
                  <a href="#" className="dropdown-toggle" data-bs-toggle="dropdown">
                    {/* Display current language based on lang param */} 
                    {lang === 'he' ? 
                      <><Image src="/img/Israel.jpg" alt="Israel" width={20} height={15} /> {dictionary.languageSwitcher.hebrew}</> : 
                      <><Image src="/img/us.jpg" alt="US" width={20} height={15} /> {dictionary.languageSwitcher.english}</>
                    }
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <a href="/en" className="dropdown-item">
                      <Image src="/img/us.jpg" alt="US" width={20} height={15} /> {dictionary.languageSwitcher.english}
                    </a>
                    <a href="/he" className="dropdown-item">
                      <Image src="/img/Israel.jpg" alt="Israel" width={20} height={15} /> {dictionary.languageSwitcher.hebrew}
                    </a>
                  </div>
                </div>
                <button className="btn btn-dark mx-2">
                  {dictionary.navigation.upgrade}
                  <span>
                    <Image src="/img/pro.svg" alt="" width={20} height={20} />
                  </span>
                </button>
              </div>
            </div>
            <button className="btn ms-auto btn-outline-dark without-icon ms-2">{dictionary.navigation.login}</button>
            <button 
              className="navbar-toggler ms-2" 
              type="button" 
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent" 
              aria-controls="navbarSupportedContent" 
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
        </nav>
      </header>

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
              
              {/* File Upload Section */}
              <div className="row">
                {/* Payslip Upload */}
                <div className="col-lg-6" data-aos="fade-up" data-aos-duration="1500">
                  <div className="upload-file">
                    <div className="file-list" id="fileListPayslip"></div>
                    <div className="upload-container" id="uploadBoxPayslip">
                      <i className="bi bi-cloud-upload-fill"></i>
                      <h4 className="mb-1">{dictionary.hero.payslipUploadTitle}</h4>
                      <p className="mb-3">{dictionary.hero.payslipUploadText}</p>
                      <input type="file" id="fileInputPayslip" multiple hidden />
                      <button className="btn btn-sm without-icon btn-fileupload">{dictionary.hero.uploadButton}</button>
                    </div>
                  </div>
                </div>

                {/* Contract Upload */}
                <div className="col-lg-6 mt-4 mt-lg-0" data-aos="fade-up" data-aos-duration="1500">
                  <div className="upload-file">
                    <div className="file-list" id="fileListContract"></div>
                    <div className="upload-container" id="uploadBoxContract">
                      <i className="bi bi-cloud-upload-fill"></i>
                      <h4 className="mb-1">{dictionary.hero.contractUploadTitle}</h4>
                      <p className="mb-3">{dictionary.hero.contractUploadText}</p>
                      <input type="file" id="fileInputContract" multiple hidden />
                      <button className="btn btn-sm without-icon btn-fileupload">{dictionary.hero.uploadButton}</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="row">
                {dictionary.hero.actionButtons.map((buttonText, index) => (
                  <div key={index} className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
                    <button 
                      type="button"
                      className="btn btn-outline-dark thumbnail-btn" 
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      <div dangerouslySetInnerHTML={{ __html: buttonText.replace(' ', '<br>') }} />
                      <span><i className="bi bi-arrow-right-short"></i></span>
                    </button>
                  </div>
                ))}
              </div>
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
      </main>

      {/* Footer */}
      <footer>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 text-center text-md-start">
              <p className="py-2" dangerouslySetInnerHTML={{ __html: dictionary.footer.copyright.replace('/en', `/${lang}`) }} />
            </div>
            <div className="col-md-6 text-center text-md-end">
              <p className="py-2" dangerouslySetInnerHTML={{ __html: dictionary.footer.links.replace('/en/', `/${lang}/`) }} />
            </div>
          </div>
        </div>
      </footer>

      {/* Submit Modal */}
      <div 
        className="modal fade submit-modal" 
        id="exampleModal" 
        tabIndex={-1} 
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <i className="bi bi-x"></i>
              </button>
              <div className="successful-img">
                <Image className="bounce-1" src="/img/Successfully-icon.svg" alt="" width={100} height={100} />
              </div>
            </div>
            <div className="modal-body">
              <h2>Submitted Successfully!</h2>
              <p className="mb-0">
                Our legal experts and AI system are analyzing your data.<br /> 
                You'll receive a detailed report soon.
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-sm btn-yellow mb-2">
                Go to My Reports
                <span><i className="bi bi-arrow-right-short"></i></span>
              </button>
              <div className="btn-arrow">
                <Image className="bounce-2" src="/img/arrow1.svg" alt="" width={30} height={30} />
              </div>
              <p className="mb-0">You can check the status in your Reports section.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
