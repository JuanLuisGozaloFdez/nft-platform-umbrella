import { useLocale } from '../context/LocaleContext'
import { useT } from '../i18n'

export default function SettingsMenu() {
  const { locale, setLocale } = useLocale()
  const t = useT()

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm">{t('settings_language')}</label>
      <select
        className="border p-2"
        value={locale}
        onChange={(e) => setLocale(e.target.value as 'es' | 'en')}
      >
        <option value="es">Español</option>
        <option value="en">English</option>
      </select>
    </div>
  )
}
