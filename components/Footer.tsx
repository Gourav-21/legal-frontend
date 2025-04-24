import { Locale } from "../i18n-config"; // Adjust path as needed

interface FooterProps {
  lang: Locale;
  dictionary: any; // Replace 'any' with a more specific type if you have one
}

const Footer: React.FC<FooterProps> = ({ lang, dictionary }) => {
  return (
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
  );
};

export default Footer;