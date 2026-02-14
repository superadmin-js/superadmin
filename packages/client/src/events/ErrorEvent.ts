/**
 *
 */
export type ErrorProps = {
    /**
     *
     */
    title?: string;
    /**
     *
     */
    message: string;
};

/**
 *
 */
export class ErrorEvent extends Event {
    public readonly title?: string;
    public readonly message: string;

    /**
     *
     */
    constructor(props: ErrorProps) {
        super('superadmin-error', {
            bubbles: true,
            cancelable: true,
        });

        this.title = props.title;
        this.message = props.message;
    }
}
