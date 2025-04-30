'use client'
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Locale } from "../i18n-config"; // Adjust path as needed

interface NavbarProps {
  lang: Locale;
  dictionary: any; // Replace 'any' with a more specific type if you have one
}

const Navbar: React.FC<NavbarProps> = ({ lang, dictionary }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const collapseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let bsCollapse: any = null;

    // @ts-ignore
    if (typeof window !== 'undefined' && collapseRef.current && window.bootstrap) {
      // @ts-ignore
      bsCollapse = new window.bootstrap.Collapse(collapseRef.current, {
        toggle: false
      });

      if (isMenuOpen) {
        bsCollapse.show();
      } else {
        bsCollapse.hide();
      }
    }

    return () => {
      if (bsCollapse) {
        bsCollapse.dispose();
      }
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <nav className={`navbar navbar-expand-lg ${lang === 'he' ? 'rtl' : ''}`}>
        <div className={`container-fluid ${lang === 'he' ? 'rtl' : ''}`}>
          <Link className="navbar-brand" href={`/${lang}`}>
            <Image src="/img/logo.png" alt="Logo" width={150} height={40} />
          </Link>

          <div ref={collapseRef} className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className={`navbar-nav ${lang === 'he' ? 'me-auto' : 'ms-auto'} mb-2 mb-lg-0`}>
              <li className="nav-item">
                <Link className={`nav-link ${pathname === `/${lang}` ? 'active' : ''}`} href={`/${lang}`} onClick={closeMenu}>{dictionary.navigation.home}</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${pathname === `/${lang}/pricing` ? 'active' : ''}`} href={`/${lang}/pricing`} onClick={closeMenu}>{dictionary.navigation.pricing}</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${pathname === `/${lang}/reports` ? 'active' : ''}`} href={`/${lang}/reports`} onClick={closeMenu}>{dictionary.navigation.reports}</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${pathname === `/${lang}/about` ? 'active' : ''}`} href={`/${lang}/about`} onClick={closeMenu}>{dictionary.navigation.about}</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${pathname === `/${lang}/contact` ? 'active' : ''}`} href={`/${lang}/contact`} onClick={closeMenu}>{dictionary.navigation.contact}</Link>
              </li>
            </ul>
            <div className={`d-flex justify-content-center ${lang === 'he' ? 'me-2' : 'ms-2'}`}>
              <div className="dropdown language">
                <a href="#" className="dropdown-toggle" data-bs-toggle="dropdown">
                  {/* Display current language based on lang param */}
                  {lang === 'he' ?
                    <><Image src="/img/Israel.jpg" alt="Israel" width={20} height={15} /> {dictionary.languageSwitcher.hebrew}</> :
                    <><Image src="/img/us.jpg" alt="US" width={20} height={15} /> {dictionary.languageSwitcher.english}</>
                  }
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  <Link href={`/en${pathname.substring(3)}`} className="dropdown-item">
                    <Image src="/img/us.jpg" alt="US" width={20} height={15} /> {dictionary.languageSwitcher.english}
                  </Link>
                  <Link href={`/he${pathname.substring(3)}`} className="dropdown-item">
                    <Image src="/img/Israel.jpg" alt="Israel" width={20} height={15} /> {dictionary.languageSwitcher.hebrew}
                  </Link>
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
          <Link
            href={`/${lang}/signin`}
            className={`btn ${lang === 'he' ? 'me-auto' : 'ms-auto'} btn-outline-dark without-icon ${lang === 'he' ? 'ms-2' : 'ms-2'}`}
          >
            {dictionary.navigation.login}
          </Link>
          <button
            className="navbar-toggler ms-2"
            type="button"
            onClick={toggleMenu}
            aria-controls="navbarSupportedContent"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list"></i>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;