import { useLocale } from './context/LocaleContext'

const dict = {
  es: {
    nav_dashboard: 'Dashboard',
    nav_events: 'Eventos',
    settings_language: 'Idioma',
    events_title: 'Gestión de eventos',
    events_new: 'Nuevo Evento',
    form_name: 'Nombre',
    form_date: 'Fecha del evento',
    form_location: 'Ubicación',
    form_capacity: 'Capacidad',
    form_status: 'Estado',
    form_description: 'Descripción',
    form_save: 'Guardar',
    list_loading: 'Cargando eventos...',
    list_name: 'Nombre',
    list_date: 'Fecha',
    list_status: 'Estado',
    list_actions: 'Acciones',
    action_edit: 'Editar',
    action_delete: 'Eliminar',
    login_email: 'Email',
    login_password: 'Contraseña',
    login_action: 'Acceder',
    dashboard_intro: 'KPIs y gráficos irán aquí.'
  },
  en: {
    nav_dashboard: 'Dashboard',
    nav_events: 'Events',
    settings_language: 'Language',
    events_title: 'Events Management',
    events_new: 'New Event',
    form_name: 'Name',
    form_date: 'Event date',
    form_location: 'Location',
    form_capacity: 'Capacity',
    form_status: 'Status',
    form_description: 'Description',
    form_save: 'Save',
    list_loading: 'Loading events...',
    list_name: 'Name',
    list_date: 'Date',
    list_status: 'Status',
    list_actions: 'Actions',
    action_edit: 'Edit',
    action_delete: 'Delete',
    login_email: 'Email',
    login_password: 'Password',
    login_action: 'Login',
    dashboard_intro: 'KPIs and charts go here.'
  },
}

export function useT() {
  const { locale } = useLocale()
  const l = locale === 'es' ? 'es' : 'en'
  return (key: keyof typeof dict['es']) => dict[l][key]
}
