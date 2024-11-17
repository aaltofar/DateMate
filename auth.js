// auth.js
import { signIn, setSession, signOut } from './repository.js';

export function saveSessionToStorage(session) {
    localStorage.setItem('sbSession', JSON.stringify(session));
}

export function getSessionFromStorage() {
    const session = localStorage.getItem('sbSession');
    return session ? JSON.parse(session) : null;
}

export function clearSession() {
    localStorage.removeItem('sbSession');
}

export async function login(email, password) {
    const { data, error } = await signIn(email, password);
    if (data.user) {
        saveSessionToStorage(data.session);
    }
    return { user: data.user, error };
}

export async function restoreSession() {
    const session = getSessionFromStorage();
    if (session) {
        const { data, error } = await setSession(session);
        return { user: data.user, error };
    }
    return { user: null, error: "No session found" };
}
