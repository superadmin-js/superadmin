/** DOM event dispatched to trigger data refetching in parent components. */
export class RefetchEvent extends Event {
    /** Creates a new refetch event. */
    constructor() {
        super('refetch');
    }
}
