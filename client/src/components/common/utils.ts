import { Signal } from "@preact/signals-react";
import { authenticate, fetchNote as fetchNote, type NoteResponse } from "../../api/api";
import { getCookie } from "../../utils/cookie";


export function loadDetails(
    show: Signal<{ noteID: string; view: string}>,
    loadingEvents: Signal<boolean>,
    setEventDetails: React.Dispatch<React.SetStateAction<NoteResponse>>
) {
    return async () => {
        // If no event is selected, don't make a request
        if (show.value.noteID === "none") {
            return;
        }
        if (loadingEvents.value == true) {
            return;
        }
        loadingEvents.value = true;

        try {
            const details = await fetchNote(`${show.value.noteID}`);
            setEventDetails(details);
        } catch (error: any) {
            console.warn(error.message);
        }
        loadingEvents.value = false;
    };
}

export async function resumeSession(
    setServerError: React.Dispatch<React.SetStateAction<string>> | undefined,
    setErrorVisible: React.Dispatch<React.SetStateAction<boolean>> | undefined,
    user: Signal<{ username: string, loggedIn: boolean, role: string}>,
    showLogin: Signal<boolean> | undefined
): Promise<void> {
    const sessionCookie = getCookie("sessionKey");
    if (!sessionCookie) {
        return; // Don't send a request if no session key exists.
    }
    try {
        const auth = await authenticate();
        if ( auth != null ) {
            if (showLogin) {
                showLogin.value = false;
            }
            user.value = { username: auth.User, loggedIn: true, role: auth.Role};
        }
    } catch (error) {
        setServerError && setServerError(`${error}`);
        setErrorVisible && setErrorVisible(true);
    }
}

export function setTitle(text: string): string {
    const cutLimit = 10;
    const nonList = text.split("- ", 1);
    const words = nonList[0].split(" ", 2);
    const candidate1 = words[0];
    if (candidate1.length > 3) {
        return candidate1;
    }
    if (words.length > 1) {
        const candidate2 = `${words[0]} ${words[1]}`
        return candidate2;
    }
    if (text.length < cutLimit) {
        return text;
    }
    else {
        return text.slice(0, cutLimit);
    }
}
