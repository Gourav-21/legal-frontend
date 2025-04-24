'use client'
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Locale } from "../i18n-config"; // Adjust path as needed

interface NavbarProps {
  lang: Locale;
  dictionary: any; // Replace 'any' with a more specific type if you have one
}

const Navbar: React.FC<NavbarProps> = ({ lang, dictionary }) => {
  const pathname = usePathname();
  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand" href={`/${lang}`}>
            <Image src="/img/logo.png" alt="Logo" width={150} height={40} />
          </Link>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${pathname === `/${lang}` ? 'active' : ''}`} href={`/${lang}`}>{dictionary.navigation.home}</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${pathname === `/${lang}/pricing` ? 'active' : ''}`} href={`/${lang}/pricing`}>{dictionary.navigation.pricing}</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${pathname === `/${lang}/reports` ? 'active' : ''}`} href={`/${lang}/reports`}>{dictionary.navigation.reports}</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${pathname === `/${lang}/about` ? 'active' : ''}`} href={`/${lang}/about`}>{dictionary.navigation.about}</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${pathname === `/${lang}/contact` ? 'active' : ''}`} href={`/${lang}/contact`}>{dictionary.navigation.contact}</Link>
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
            className="btn ms-auto btn-outline-dark without-icon ms-2" 
            >
            {dictionary.navigation.login}
            </Link>
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
  );
};

export default Navbar;