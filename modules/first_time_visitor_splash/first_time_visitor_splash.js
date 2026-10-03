// Easter egg for returning visitors.
// First-time visitors see the site straight away. Returning visitors (2nd visit onwards) get a short
// message on top of the page, at most once every 2 hours. Nothing here ever hides the page itself,
// so if this script fails the site is still fully visible.

document.head.insertAdjacentHTML(
    "beforeend",
    `<link rel="stylesheet" hx-preserve="true" href="/modules/first_time_visitor_splash/first_time_visitor_splash.css">`
);

function return_visit_message(visit_number) {
    if (visit_number <= 4) {
        return {
            title: "Edwin says: Welcome back!",
            text: `Thanks for coming back!<br> <br>
                Most people don't come back for a second time to a personal website <br>
                ...or did you just come back for the "breathing bubbles" in the background?`,
        };
    } else if (visit_number <= 6) {
        return {
            title: '"You\'re back again... how odd" Edwin thinks to himself.',
            text: `So, I'm pretty sure that this site only has a few pages... <br>
                ...did I accidentally make something really interesting?`,
        };
    }
    return {
        title: "Back again, eh? Stat-bot... activate!",
        text: `Hello I'm stat-bot <br> <br>
            I see this is your ${visit_number}th visit to this site. <br>
            End of program, press button below to continue...`,
    };
}

function show_return_visit_splash(visit_number) {
    const message = return_visit_message(visit_number);
    const splash = document.createElement("div");
    splash.id = "splash_overlay";
    splash.setAttribute("role", "dialog");
    splash.setAttribute("aria-label", "Welcome back");
    splash.innerHTML = `
        <div id="splash_title">${message.title}</div>
        <p id="splash_text">${message.text}</p>
        <button id="splash_button" type="button">Continue</button>
    `;
    document.body.appendChild(splash);

    const button = splash.querySelector("#splash_button");
    button.addEventListener("click", () => {
        splash.classList.add("splash_leaving");
        setTimeout(() => splash.remove(), 700);
    });
    button.focus();
}

try {
    const now = new Date();
    const visit_count = parseInt(localStorage.getItem("zecr_visit_count") || 0);
    const last_visit = new Date(localStorage.getItem("zecr_last_visit_time") || 0);

    // Only count a new visit if over 2 hours have passed since the last one
    // (60 * 60 * 1000 = 3600000 = 1 hour)
    if (now - last_visit > 3600000 * 2) {
        const visit_number = visit_count + 1;
        localStorage.setItem("zecr_visit_count", visit_number);
        if (visit_number >= 2) {
            show_return_visit_splash(visit_number);
        }
    }
    localStorage.setItem("zecr_last_visit_time", now);
} catch (e) {
    // localStorage unavailable (private mode, blocked cookies): just show the site
}

document.currentScript.remove();
