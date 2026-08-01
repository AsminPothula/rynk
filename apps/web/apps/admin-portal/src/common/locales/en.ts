import { FlattenKeys } from 'shared';

const en = {
  EXAMPLES: {
    TITLE: 'Examples',
    PARENT_TRIGGER_BUTTON: 'Show Examples',
    DESCRIPTION: 'Showcase custom examples',
    CLOSE: 'Close',
    COLOR_TEST: 'Custom Background and Text Colors',
  },
  DIALOG: {
    ACCOUNT_DELETE: {
      TITLE: 'Are you absolutely sure?',
      PARENT_TRIGGER_BUTTON: 'Delete account',
      CANCEL_ACTION: 'Cancel',
      DELETE_ACTION: 'Delete account',
      TOAST: {
        SUCCESS: 'Account Deleted!',
      },
      DESCRIPTION:
        'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
    },

    LOGOUT: {
      TITLE: 'Would you like to logout?',
      PARENT_TRIGGER_BUTTON: 'Logout',
      CANCEL_ACTION: 'Cancel',
      LOGOUT_ACTION: 'Logout',
      TOAST: {
        SUCCESS: 'Logged out!',
      },
      DESCRIPTION: 'This will terminate your current session. Are you sure?',
    },
  },
  COMMON: {
    LOADING: {
      PLEASE_WAIT: 'Please wait...',
    },
    TOAST: {
      SUBMIT_SUCCESS: 'Submitted successfully!',
      ERROR_PREFIX: 'Error',
    },
  },
  LANDING: {
    WELCOME: 'Welcome to',
    PORTAL: 'Admin Portal',
    GET_STARTED: 'Get Started',
    PORTAL_NOT_FOUND: 'Portal Not Found',
  },
  SET_PASSWORD: {
    TOAST: {
      SUCCESS: 'Password reset successfully!',
    },
    TITLE: 'Set Password',
    NEW_PASSWORD: 'New Password',
    CONFIRM_PASSWORD: 'Confirm Password',
    SUBMIT: 'Submit',
    PASSWORD: 'Password',
    BACK_TO_LOGIN: 'Back to Login',
  },
  SIGNUP: {
    TOAST: {
      SUCCESS: 'Signed up and Logged in!',
    },
    TITLE: 'Sign Up',
    NAME: 'Name',
    EMAIL: 'Email',
    PASSWORD: 'Password',
    CONFIRM_PASSWORD: 'Confirm Password',
    SUBMIT: 'Submit',
    SIGN_IN: 'Login',
    ALREADY_HAVE_AN_ACCOUNT: 'Already have an account?',
  },
  LOGIN: {
    TOAST: {
      SUCCESS: 'Logged in!',
    },
    TITLE: 'Login',
    EMAIL: 'Email',
    PASSWORD: 'Password',
    SUBMIT: 'Submit',
    SIGN_UP: 'Sign Up',
    FORGOT_PASSWORD: 'Forgot Password',
    NO_ACCOUNT: 'Don’t have an account?',
  },
  FORGOT_PASSWORD: {
    TITLE: 'Forgot Password',
    DESCRIPTION:
      'Enter your registered email to receive a link to reset password',
    EMAIL: 'Email',
    SUBMIT: 'Submit',
    BACK: 'Back',
  },
  NAVBAR: {
    DASHBOARD: 'Dashboard',
    USERS: 'Users',
    SETTINGS: 'Settings',
  },
  SETTINGS: {
    TITLE: 'Settings',
    PROFILE: 'Profile',
    LOGOUT: 'Logout',
    DELETE_ACCOUNT: 'Delete Account',
  },
  USERS: {
    TITLE: 'Users',
    FETCH_NEXT_PAGE: 'CLICK OR SCROLL DOWN to Load More',
    NO_MORE: 'No More',
  },
  DASHBOARD: {
    TITLE: 'Dashboard',
  },
};

export type TranslationType = typeof en;
export type TranslationTypeKeys = FlattenKeys<TranslationType>;
export default en;
