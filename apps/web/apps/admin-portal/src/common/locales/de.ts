import { type TranslationType } from './en.ts';

export default {
  EXAMPLES: {
    TITLE: 'Beispiele',
    PARENT_TRIGGER_BUTTON: 'Beispiele anzeigen',
    DESCRIPTION: 'Beispielcode für die Anwendung',
    CLOSE: 'Schließen',
    COLOR_TEST: 'Hintergrund und Textfarbe',
  },
  DIALOG: {
    ACCOUNT_DELETE: {
      TITLE: 'Sicher?',
      PARENT_TRIGGER_BUTTON: 'Konto loeschen',
      CANCEL_ACTION: 'Abbrechen',
      DELETE_ACTION: 'Konto loeschen',
      TOAST: {
        SUCCESS: 'Konto geloescht!',
      },
      DESCRIPTION:
        'Dieser Vorgang kann nicht rückgängig gemacht werden. Dies wird Ihr Konto und alle Ihre Daten auf unserer Servern unwiderruflich loeschen.',
    },
    LOGOUT: {
      TITLE: 'Wollen Sie sich ausloggen?',
      PARENT_TRIGGER_BUTTON: 'Ausloggen',
      CANCEL_ACTION: 'Abbrechen',
      LOGOUT_ACTION: 'Ausloggen',
      TOAST: {
        SUCCESS: 'Ausgeloggt!',
      },
      DESCRIPTION: 'Dies wird Ihre aktuelle Sitzung beenden. Sind Sie sicher?',
    },
  },
  COMMON: {
    LOADING: {
      PLEASE_WAIT: 'Bitte warten...',
    },
    TOAST: {
      SUBMIT_SUCCESS: 'Erfolgreich gesendet!',
      ERROR_PREFIX: 'Fehler',
    },
  },
  LANDING: {
    WELCOME: 'Willkommen zu',
    PORTAL: 'Portal',
    GET_STARTED: 'Starten',
    PORTAL_NOT_FOUND: 'Portal nicht gefunden',
  },
  SET_PASSWORD: {
    TOAST: {
      SUCCESS: 'Passwort erfolgreich geändert!',
    },
    TITLE: 'Passwort setzen',
    NEW_PASSWORD: 'Neues Passwort',
    CONFIRM_PASSWORD: 'Passwort bestätigen',
    SUBMIT: 'Senden',
    PASSWORD: 'Passwort',
    BACK_TO_LOGIN: 'Zurück zum Anmelden',
  },
  SIGNUP: {
    TOAST: {
      SUCCESS: 'Registriert und eingeloggt!',
    },
    TITLE: 'Registrieren',
    NAME: 'Name',
    EMAIL: 'E-Mail',
    PASSWORD: 'Passwort',
    CONFIRM_PASSWORD: 'Passwort bestätigen',
    SUBMIT: 'Senden',
    SIGN_IN: 'Anmelden',
    ALREADY_HAVE_AN_ACCOUNT: 'Sind Sie bereits registriert?',
  },
  LOGIN: {
    TOAST: {
      SUCCESS: 'Eingeloggt!',
    },
    TITLE: 'Anmelden',
    EMAIL: 'E-Mail',
    PASSWORD: 'Passwort',
    SUBMIT: 'Senden',
    SIGN_UP: 'Registrieren',
    FORGOT_PASSWORD: 'Passwort vergessen',
    NO_ACCOUNT: 'Sind Sie noch kein Konto?',
  },
  FORGOT_PASSWORD: {
    TITLE: 'Passwort vergessen',
    DESCRIPTION:
      'Geben Sie Ihre registrierte E-Mail-Adresse ein, um einen Link zum Zurücksetzen des Passworts zu erhalten',
    EMAIL: 'E-Mail-Adresse',
    SUBMIT: 'Senden',
    BACK: 'Zurück',
  },
  NAVBAR: {
    DASHBOARD: 'Dashboard',
    USERS: 'Benutzer',
    SETTINGS: 'Einstellungen',
  },
  SETTINGS: {
    TITLE: 'Einstellungen',
    PROFILE: 'Profil',
    LOGOUT: 'Ausloggen',
    DELETE_ACCOUNT: 'Konto loeschen',
  },
  USERS: {
    TITLE: 'Benutzer',
    FETCH_NEXT_PAGE: 'Klicken oder Scrollen Sie nach unten, um mehr zu laden',
    NO_MORE: 'Keine mehr',
  },
  DASHBOARD: {
    TITLE: 'Dashboard',
  },
} satisfies TranslationType;
