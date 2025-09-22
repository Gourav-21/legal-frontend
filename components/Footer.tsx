import { Locale } from "../i18n-config"; // Adjust path as needed

interface FooterProps {
  lang: Locale;
  dictionary: Record<string, any>;
}

const Footer: React.FC<FooterProps> = ({ lang, dictionary }) => {
  return (
    <footer dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <div className="container-fluid">
        <div className="row">
          <div className={`col-md-6 text-center ${lang === 'he' ? 'text-md-end' : 'text-md-start'}`}>
            <p className="py-2" dangerouslySetInnerHTML={{ __html: dictionary.footer.copyright.replace('/en', `/${lang}`) }} />
          </div>
          <div className={`col-md-6 text-center ${lang === 'he' ? 'text-md-start' : 'text-md-end'}`}>
            <p className="py-2" dangerouslySetInnerHTML={{ __html: dictionary.footer.links.replace('/en/', `/${lang}/`) }} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;