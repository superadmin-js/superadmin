/** Properties for creating an error event. */
export type ErrorProps = {
    /** Optional error title for display. */
    title?: string;
    /** Error message describing what went wrong. */
    message: string;
};

/** DOM event that bubbles up to signal an application error. */
export class ErrorEvent extends Event {
    public readonly title?: string;
    public readonly message: string;

    /** Creates a bubbling, cancelable error event with the given title and message. */
    constructor(props: ErrorProps) {
        super('superadmin-error', {
            bubbles: true,
            cancelable: true,
        });

        this.title = props.title;
        this.message = props.message;
    }
}
