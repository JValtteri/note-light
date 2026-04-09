/*
 * API module for communicating with the backend server
 */

import { setCookie, ttl } from "../utils/cookie";
import { generalRequest } from "./request";


interface NoteCreationResponse {
    NoteID:   number;
    Error:    string;
}

export interface NoteResponse {
    ID:                 number;
    Title:              string;
    Note:               string;
    DtCreated:          number;
    DtModified:         number;
}

export type NoteListResponse = Array<NoteResponse>;

export interface ClientResponse {
    Id:             string;
    CreatedDt:      number;
    ExpiresDt:      number;
    IsTemporary:    boolean;
    Email:          string;
    Role:           string;
}

export type ClientListResponse = Array<ClientResponse>;

interface AuthResponse {
    User:           string;
    Authenticated:  boolean;
    Role:           string;
    SessionKey:     string;
    Error:          string;
}

interface RegistrationResponse {
    SessionKey: string;
    Error:      string;
}

interface SuccessResponse {
    Success:    boolean;
    SessionKey: string;
    Error:      string;
}

//* Fetch Data  *//

export async function fetchNotes(): Promise<NoteListResponse> {
    const response = await generalRequest("api/user/notes", "POST");
    const respBody = await response.json() as NoteListResponse;
    return respBody;
}

export async function fetchNote(eventID: string): Promise<NoteResponse> {
    const body = {"NoteID": eventID};
    const response = await generalRequest("api/user/note", "POST", body);
    const respBody = await response.json() as NoteResponse;
    return respBody;
}

//* Session Management *//

export async function authenticate(): Promise<AuthResponse | null> {
    const response = await generalRequest("/api/session/auth", "POST");
    const respBody = await response.json() as AuthResponse;
    if (respBody.Authenticated) {
        return respBody;
    }
    return null;
}

export async function login(username: string, password: string): Promise<AuthResponse | null> {
    const body = {
        user: username,
        password: password
    };
    const response = await generalRequest("api/user/login", "POST", body)
    const authJson = await response.json() as AuthResponse;
    if (authJson.Authenticated) {
        setCookie("sessionKey", authJson.SessionKey, ttl);
        return authJson;
    }
    return null;
}

export async function logout(): Promise<AuthResponse> {
    const response = await generalRequest("/api/user/logout", "POST");
    const respBody = await response.json() as AuthResponse;
    return respBody;
}

//* User Management *//

export async function registerUser(email: string, password: string): Promise<RegistrationResponse> {
    const body = {
        "User": email,
        "Password": password
    };
    const response = await generalRequest("/api/user/register", "POST", body);
    const respBody = await response.json() as RegistrationResponse;
    setCookie("sessionKey", respBody.SessionKey, ttl);
    return respBody;
}

export async function editPassword(
    username: string,
    password: string,
    newPassword: string
): Promise<SuccessResponse> {
    const body = {
        User:        username,
        Password:    password,
        NewPassword: newPassword
    };
    const response = await generalRequest("/api/user/change", "POST", body);
    const respBody = await response.json() as SuccessResponse;
    // Session key is renewed when password is changed.
    // This is because all existing sessions are invalidated
    // after password change. This is a security feature.
    if (respBody.Success) {
        setCookie("sessionKey", respBody.SessionKey, ttl);
    }
    return respBody;
}

export async function deleteUser(
    username: string,
    password: string,
): Promise<SuccessResponse> {
    const body = {
        User:        username,
        Password:    password
    };
    const response = await generalRequest("/api/user/delete", "POST", body);
    const respBody = await response.json() as SuccessResponse;
    return respBody;
}

//* Note Management *//

export async function makeNote(
    title: string,
    text: string,
    created: number,
    modified: number,
): Promise<NoteCreationResponse> {
    const body = (
        {
            "Note": {
                "Title":            title,
                "Text":             text,
                "DtCreated":        created,
                "DtModified":       modified,
            }
        });
    const response = await generalRequest("/api/admin/create", "POST", body)
    const respBody = await response.json() as NoteCreationResponse;
    return respBody;
}

export async function editNote(
    id: string,
    title: string,
    text: string,
    created: number,
    modified: number,
): Promise<NoteCreationResponse> {
    const body = (
        {
            "Note": {
                "ID":               id,
                "Title":            title,
                "Text":             text,
                "DtCreated":        created,
                "DtModified":       modified,
            }
        });
    const response = await generalRequest("/api/admin/edit", "PUT", body)
    const respBody = await response.json() as NoteCreationResponse;
    return respBody;
}

export async function deleteNote(id: string): Promise<NoteCreationResponse> {
    const body = (
        {
            "Event": {
                "ID": id,
            }
        });
    const response = await generalRequest("/api/admin/remove", "POST", body)
    const respBody = await response.json() as NoteCreationResponse;
    return respBody;
}

//* Admin API Calls *//

//* Admin Data *//

export async function listAllClients(): Promise<ClientListResponse> {
    const response = await generalRequest("/api/admin/users", "POST");
    const respBody = await response.json() as ClientListResponse;
    return respBody;
}

//* Admin User Management *//

export async function adminDeleteUser(
    targetUsername: string,
    adminPassword:  string,
): Promise<SuccessResponse> {
    const body = {
        User:        targetUsername,
        Password:    adminPassword
    };
    const response = await generalRequest("/api/admin/user/delete", "POST", body);
    const respBody = await response.json() as SuccessResponse;
    return respBody;
}

export async function changeUserRole(
    targetUsername: string,
    role:           string,
    password:       string,
): Promise<SuccessResponse> {
    const body = {
        User:        targetUsername,
        Role:        role,
        Password:    password
    };
    const response = await generalRequest("/api/admin/user/role", "POST", body);
    const respBody = await response.json() as SuccessResponse;
    return respBody;
}
