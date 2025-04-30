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

            <button type="submit" className="btn btn-primary mt-4" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Find Your Lawyer
                <span><i className="bi bi-arrow-right-short"></i></span>
            </button>
                    </div>
                </div>
                <div id="typing-output" dangerouslySetInnerHTML={{ __html: typedContent }} style={{ whiteSpace: 'pre-wrap' }} />
            </div>
        </div>
    );
}
