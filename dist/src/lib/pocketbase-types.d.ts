export type IsoDateString = string;
export type IsoAutoDateString = string & {
    readonly autodate: unique symbol;
};
export type RecordIdString = string;
export type FileNameString = string & {
    readonly filename: unique symbol;
};
export type HTMLString = string;
export declare enum Collections {
    Authorigins = "_authOrigins",
    Externalauths = "_externalAuths",
    Mfas = "_mfas",
    Otps = "_otps",
    Superusers = "_superusers",
    UserMicrosoftProfiles = "_user_microsoft_profiles",
    UserPreferences = "_user_preferences",
    Users = "users"
}
export type BaseSystemFields<T = unknown> = {
    id: RecordIdString;
    collectionId: string;
    collectionName: Collections;
} & ExpandType<T>;
type ExpandType<T> = unknown extends T ? T extends unknown ? {
    expand?: unknown;
} : {
    expand: T;
} : {
    expand: T;
};
export type ExternalauthsRecord = {
    collectionRef: string;
    created: IsoAutoDateString;
    id: string;
    provider: string;
    providerId: string;
    recordRef: string;
    updated: IsoAutoDateString;
};
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>;
export {};
