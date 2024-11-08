import type { ValidationErrors } from '@superadmin/validation';

export type ActionError =
    | {
          type?: undefined;
          message: string;
          stack?: string;
          data?: unknown;
      }
    | {
          type: 'validation';
          errors: ValidationErrors;
          stack?: string;
      };
