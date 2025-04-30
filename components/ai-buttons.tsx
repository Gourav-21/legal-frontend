'use client'
import { Locale } from "@/i18n-config";
import { useState, useRef } from 'react';

export default function AiButtons({ lang, dictionary }: { lang: Locale, dictionary: any }) {
    const [isVisible, setIsVisible] = useState(false);
    const [typedContent, setTypedContent] = useState('');
    const analysisRef = useRef<HTMLDivElement>(null);
    const animationStartedRef = useRef(false);

    const scrollToAnalysis = () => {
        const analysisSection = document.getElementById('analysis-section');
        if (analysisSection) {
            const y = analysisSection.getBoundingClientRect().top + window.pageYOffset - 30;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const typeContent = (html: string) => {
        setTypedContent(''); // Reset typed content
        let i = 0;

        const typing = setInterval(() => {
            if (i < html.length) {
                setTypedContent(prev => prev + html.charAt(i));
                i++;
            } else {
                clearInterval(typing);
            }
        }, 5);
    };
    
    const handleShowAnalysis = () => {
        // if (!animationStartedRef.current) {
        //     animationStartedRef.current = true;
            
            // First show the section
            setIsVisible(true);

            // After section is visible, scroll to it
            setTimeout(() => {
                scrollToAnalysis();
                
                // After scrolling, start typing
                setTimeout(() => {
                    const content = document.getElementById('analysis-content')?.innerHTML || '';
                    typeContent(content);
                }, 100);
            }, 100);
        // } else {
        //     // If already visible, just scroll
        //     scrollToAnalysis();
        // }
    };

    return (
        <div>
            <div className="row">
                {dictionary.hero.actionButtons.map((buttonText: string, index: number) => (
                    <div key={index} className="col-6 col-md-3 mt-4" data-aos="fade-up" data-aos-duration="1500">
                        <button
                            type="button"
                            className="btn btn-outline-dark thumbnail-btn show-btn"
                            onClick={handleShowAnalysis}
                        >
                            <div dangerouslySetInnerHTML={{ __html: buttonText.replace(' ', '<br>') }} />
                            <span><i className="bi bi-arrow-right-short"></i></span>
                        </button>
                    </div>
                ))}
            </div>

            <div className="result-card mt-4" id="analysis-section" style={{ display: isVisible ? 'block' : 'none' }} ref={analysisRef}>
                <div id="analysis-content" style={{ display: 'none' }}>
                    <br />
                    <h3>Economic Feasibility Analysis Results</h3>
                    <p>Great! I will proceed with the analysis as requested. <br />Let's begin by reviewing the relevant labor laws:</p>

                    <h5 className="mt-4">Labor Laws Provided</h5>
                    <ol className="text-sm">
                        <li>Add a new labor law one</li>
                        <li>Add a new labor law two</li>
                    </ol>

                    <h5 className="mt-4">Example Law:</h5>
                    <p className="text-sm mb-2">Every employee is entitled to receive no less than the legal minimum wage for all hours worked—including during trial periods, training, or apprenticeships—even if the employee agreed to a lower rate.</p>
                    <p className="text-sm mb-0">Failure to meet this requirement or to pay wages on time is considered a <span className="text-dark fw-700">criminal offense</span>.</p>

                    <h5 className="mt-4">Updated Rate <span className="text-muted fw-400">Effective from April 1, 2025</span></h5>
                    <ul className="text-sm">
                        <li><span className="text-dark fw-700">Monthly Minimum Wage</span>: 6,247.67 NIS</li>
                        <li><span className="text-dark fw-700">Hourly Minimum Wage</span>: 34.32 NIS <br /><span className="text-muted">Previously: 5,880.02 NIS / 32.30 NIS per hour</span></li>
                    </ul>
                    
                    <div className="d-sm-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center mt-4">
                            <p className="mb-0 text-muted">Send Reports via:</p>
                            <button type="submit" className="btn btn-dark btn-icon btn-sm ms-2">
                                <i className="bi bi-whatsapp"></i>
                            </button>
                            <button type="submit" className="btn btn-dark btn-icon btn-sm ms-2">
                                <i className="bi bi-envelope"></i>
                            </button>
                        </div>

                    </div>
                </div>
                <div id="typing-output" dangerouslySetInnerHTML={{ __html: typedContent }} style={{ whiteSpace: 'pre-wrap' }} />
            </div>
                        <button type="submit" className="btn btn-primary mt-4" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Find Your Lawyer
                            <span><i className="bi bi-arrow-right-short"></i></span>
                        </button>

            {/* Modal */}
            <div className="modal fade position-absolute" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
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
        </div>
    );
}
