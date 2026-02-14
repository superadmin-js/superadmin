import type { ValidationErrors } from '@superadmin/validation';

/**
 *
 */
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
