import { useLanguage } from "../i18n/LanguageContext";

export default function Friends() {
    const { t } = useLanguage();

    return (
        <div>
            {t("pages.friends")}
        </div>
    )
}
