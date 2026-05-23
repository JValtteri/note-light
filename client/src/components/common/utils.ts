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
    const cutLimit = 17;

    text = removeSpecialCharacters(text);
    text = text.split(`\n`, 1)[0];          // Use only first line for title
    const words = text.split(" ", 3);

    const candidate1 = words[0];
    if (text.length < cutLimit) {
        return text;
    }
    else if (words.length > 2 && (words[0].length + words[1].length + words[2].length) <= cutLimit ) {
        const candidate2 = `${words[0]} ${words[1]} ${words[2]}`
        return candidate2;
    }
    else if (words.length > 1 && (words[0].length + words[1].length) <= cutLimit ) {
        const candidate3 = `${words[0]} ${words[1]}`
        return candidate3;
    }
    else if (candidate1.length < cutLimit) {
        return candidate1;
    }
    else {
        return text.slice(0, cutLimit);
    }
}

function removeSpecialCharacters(text: string) {
    text = text.replaceAll("- ", "");
    text = text.replaceAll("# ", "");
    text = text.replaceAll("#", "");
    text = text.replaceAll("_", "");
    text = text.replaceAll("*", "");
    text = text.replaceAll("[", "");
    text = text.replaceAll("]", "");
    return text;
}
