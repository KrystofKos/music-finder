import { useLanguage } from "../i18n/LanguageContext";

export default function FaQs() {
    const { t } = useLanguage();

    return (
        <div>{t("pages.faqs")}</div>
    )
}
