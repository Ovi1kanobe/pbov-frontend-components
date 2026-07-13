interface PocketBaseErrorData {
    url: string;
    status: number;
    response: {
        code: number;
        message: string;
        data: any;
        mfaId?: string;
    };
    isAbort: boolean;
    originalError: any;
}
declare class PocketBaseError extends Error implements PocketBaseErrorData {
    url: string;
    status: number;
    response: {
        code: number;
        message: string;
        data: any;
        mfaId?: string;
    };
    isAbort: boolean;
    originalError: any;
    constructor(url: string, status: number, response: {
        code: number;
        message: string;
        data: any;
    }, isAbort: boolean, originalError: any);
}
export { PocketBaseError };
