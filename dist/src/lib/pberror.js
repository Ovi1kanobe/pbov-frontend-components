class PocketBaseError extends Error {
    url;
    status;
    response;
    isAbort;
    originalError;
    constructor(url, status, response, isAbort, originalError) {
        super(response.message); // Set the error message
        this.name = "PocketBaseError"; // Set the error name
        this.url = url;
        this.status = status;
        this.response = response;
        this.isAbort = isAbort;
        this.originalError = originalError;
    }
}
export default PocketBaseError;
