/**
 *
 */
export class ApplicationError extends Error {
    /**
     *
     */
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}
