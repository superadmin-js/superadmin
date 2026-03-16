/** Base error class for application-level errors in superadmin. */
export class ApplicationError extends Error {
    /** @param message - Human-readable error description. */
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}
