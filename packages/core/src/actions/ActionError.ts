import type { ValidationErrors } from '@superadmin/validation';

/** Discriminated union representing an error returned from an action handler. */
export type ActionError =
    | {
          type: 'validation';
          errors: ValidationErrors;
          stack?: string;
      }
    | {
          type?: undefined;
          message: string;
          stack?: string;
          data?: unknown;
      };
