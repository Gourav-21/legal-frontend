import Image from "next/image";
import { Locale } from "../../i18n-config"; // Import Locale type
import { getDictionary } from "../../get-dictionary"; // Import dictionary loader
import AiButtons from "@/components/ai-buttons";

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
              <AiButtons lang={lang} dictionary={dictionary} />
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

          {/* Modal */}
          <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Choose Your Expert Labor Lawyer</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"><i className="bi bi-x"></i></button>
                        </div>
                        <div className="modal-body p-3 p-sm-4">
                            <div className="lawyer-card mb-3">
                                <img src="img/lawyer-pic1.jpg" className="lawyer-profile me-3" alt="David Levi" />
                                <div className="lawyer-info">
                                    <h4 className="mt-2">David Levi</h4>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <ul className="text-sm lawyer-info-list">
                                                <li><i className="bi bi-geo-alt"></i> Tel Aviv, Israel</li>
                                                <li><i className="bi bi-bullseye"></i> 17 years <small className="text-muted">of experience in labor law</small></li>
                                                <li><i className="bi bi-star"></i> 4.9 <small className="text-muted"> | 120+ client reviews</small></li>
                                            </ul>
                                        </div>
                                        <div className="col-lg-6">
                                            <h6>Specialties</h6>
                                            <ul className="text-sm">
                                                <li>Wage disputes</li>
                                                <li>Wrongful termination</li>
                                                <li>Severance pay claims</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-sm btn-outline-primary without-icon">Contact Now</button>
                                </div>
                            </div>
                            <div className="lawyer-card mb-3">
                                <img src="img/lawyer-pic2.jpg" className="lawyer-profile me-3" alt="Amir Shalev" />
                                <div className="lawyer-info">
                                    <h4 className="mt-2">Amir Shalev</h4>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <ul className="text-sm lawyer-info-list">
                                                <li><i className="bi bi-geo-alt"></i> Jerusalem, Israel</li>
                                                <li><i className="bi bi-bullseye"></i> 12 years <small className="text-muted">of experience in labor law</small></li>
                                                <li><i className="bi bi-star"></i> 4.8 <small className="text-muted"> | 100+ client reviews</small></li>
                                            </ul>
                                        </div>
                                        <div className="col-lg-6">
                                            <h6>Specialties</h6>
                                            <ul className="text-sm">
                                                <li>Employment contracts</li>
                                                <li>Unpaid overtime disputes</li>
                                                <li>Labor court representation</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-sm btn-outline-primary without-icon">Contact Now</button>
                                </div>
                            </div>
                            <div className="lawyer-card mb-3">
                                <img src="img/lawyer-pic4.jpg" className="lawyer-profile me-3" alt="Michal Barak" />
                                <div className="lawyer-info">
                                    <h4 className="mt-2">Michal Barak</h4>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <ul className="text-sm lawyer-info-list">
                                                <li><i className="bi bi-geo-alt"></i> Ramat Gan, Israel</li>
                                                <li><i className="bi bi-bullseye"></i> 11 years <small className="text-muted">of experience in labor law</small></li>
                                                <li><i className="bi bi-star"></i> 4.8 <small className="text-muted"> | 90+ client reviews</small></li>
                                            </ul>
                                        </div>
                                        <div className="col-lg-6">
                                            <h6>Specialties</h6>
                                            <ul className="text-sm">
                                                <li>Minimum wage violations</li>
                                                <li>Employee benefits disputes</li>
                                                <li>Unfair dismissal cases</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-sm btn-outline-primary without-icon">Contact Now</button>
                                </div>
                            </div>
                            <div className="lawyer-card">
                                <img src="img/lawyer-pic3.jpg" className="lawyer-profile me-3" alt="Eitan Moyal" />
                                <div className="lawyer-info">
                                    <h4 className="mt-2">Eitan Moyal</h4>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <ul className="text-sm lawyer-info-list">
                                                <li><i className="bi bi-geo-alt"></i> Be'er Sheva, Israel</li>
                                                <li><i className="bi bi-bullseye"></i> 20 years <small className="text-muted">of experience in labor law</small></li>
                                                <li><i className="bi bi-star"></i> 4.7 <small className="text-muted"> | 95+ client reviews</small></li>
                                            </ul>
                                        </div>
                                        <div className="col-lg-6">
                                            <h6>Specialties</h6>
                                            <ul className="text-sm">
                                                <li>Union disputes</li>
                                                <li>Workplace harassment cases</li>
                                                <li>Retaliation claims</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-sm btn-outline-primary without-icon">Contact Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      </main>
    </div>
  );
}
