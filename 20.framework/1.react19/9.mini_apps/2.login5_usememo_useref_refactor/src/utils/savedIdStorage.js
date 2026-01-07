const SAVED_ID_KEY = 'saved_login_id';

export function getSavedId() {
    return localStorage.getItem(SAVED_ID_KEY) || '';
}

export function setSavedId(id) {
    localStorage.setItem(SAVED_ID_KEY, id);
}

export function clearSavedId() {
    localStorage.removeItem(SAVED_ID_KEY);
}
