import { useLanguage } from "../i18n/LanguageContext";

export default function MobileApp() {
    const { t } = useLanguage();

    return (
        <div>
            {t("pages.mobileApp")}
        </div>
    )
}
