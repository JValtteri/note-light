// Function is timezone aware

export function dateAndTimeToPosix(dateValue: string, startTimeValue: string): number {
    const dateTimeString = `${dateValue}T${startTimeValue}`;
    const dateObject = new Date(dateTimeString);
    if (isNaN(dateObject.getTime())) {
        throw new Error(`Invalid date or time input: '${dateTimeString}'`);
    }
    const posixTimestamp = Math.floor(dateObject.getTime() / 1000);
    return posixTimestamp;
}

// Produces a printable european style date and 24 hour time
export function posixToDateAndTime(posix: number): string {
    try {
        const obj = new Date(posix * 1000);
        const str = new Intl.DateTimeFormat("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(obj);
        const time = str.split(", ")[1];
        const date = str.split(", ")[0];
        return `${time} ${date}`;
    } catch(error) {
        return `$Error: ${error}`;
    }
}

// Produces a printable european style 24 hour time
export function posixToTime(posix: number): string {
    try {
        const obj = new Date(posix * 1000);
        const str = new Intl.DateTimeFormat("de-DE", {
        timeStyle: "short",
        }).format(obj);
        return str;
    } catch (error) {
        return `$Error: ${error}`;
    }
}

// Produces a date compatible with date input field value
export function posixToDate(posix: number): string {
    try {
        const d = new Date(posix * 1000);         // POSIX to JS Date (ms)
        return d.toISOString().split('T')[0];     // e.g. "2026-01-09"
    } catch (error) {
        return `$Error: ${error}`;
    }
}

// Returns current POSIX timestamp
export function posixNow(): number {
    let d = new Date();
    return d.getTime()/1000;
}

// Returs true, if given POSIX is in the past
export function isPast(time: number): boolean {
    let now = posixNow();
    return time < now;
}

/* Converts str to Base64, via uint8
 */
export function base64(str: string) {
    const encoder = new TextEncoder();
    const utf8Bytes = encoder.encode(str);
    return btoa(String.fromCharCode(...utf8Bytes));
}

/* Converts Base64 to str, via uint8
 */
export function decode64(str: string) {
    return atob(str);
}
