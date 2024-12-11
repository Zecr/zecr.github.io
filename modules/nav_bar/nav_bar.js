// <script src="nav_bar/nav_bar.js" data-id="Home"></script>

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Add CSS dependency to the page
document.head.insertAdjacentHTML(
    "beforeend",
    `<link hx-preserve="true" rel="stylesheet" href="/modules/nav_bar/nav_bar.css">`
);

// Pages to be added to the nav bar
var pages = {
    Home: "/pages/home_page/home.html",
    Projects: "/pages/projects_page/projects.html",
    Skills: "/pages/skills_page/skills.html",
    Experience: "/pages/resume_page/resume.html",
    Contact: "/pages/contact_page/contact.html",
};

// Get the query string
let current_tab = Object.fromEntries(new URLSearchParams(window.location.search))["tab"];
if (current_tab == undefined || !(current_tab in pages)) {
    current_tab = "Home";
}

// Add nav items to the nav bar
for (var key in pages) {
    if (current_tab == key) {
        document.write(
            `<a class="nav_item active" hx-get="${pages[key]}" hx-target="main" hx-replace-url="?tab=${key}"> ${key} </a>`
        );
    } else {
        document.write(
            `<a class="nav_item" hx-get="${pages[key]}" hx-target="main" hx-replace-url="?tab=${key}"> ${key} </a>`
        );
    }
}

// Add listener to nav items, when clicked, update the nav bar
let nav_bar = document.currentScript.parentElement;

// When element with class nav_item and parent of nav_bar is clicked, remove all "active" classes, then add to the clicked element
$(nav_bar).on("click", ".nav_item", (e) => {
    $(".nav_item").removeClass("active");
    $(e.target).addClass("active");
});

// Show error message and graphic on HTMX failure
$(nav_bar).on("htmx:responseError", (e) => {
    $("main").html(`
        <div id="nav_load_error_message" class="info_section">
            <svg viewBox="0 0 76 76">
                <path
                    id="page_load_error_svg"
                    fill="#ffffff"
                    fill-opacity="1"
                    stroke-width="0.2"
                    stroke-linejoin="round"
                    d="M 19,22L 57,22L 57,31L 19,31L 19,22 Z M 55,24L 53,24L 53,29L 55,29L 55,24 Z M 51,24L 49,24L 49,29L 51,29L 51,24 Z M 47,24L 45,24L 45,29L 47,29L 47,24 Z M 21,27L 21,29L 23,29L 23,27L 21,27 Z M 19,33L 57,33L 57,42L 19,42L 19,33 Z M 55,35L 53,35L 53,40L 55,40L 55,35 Z M 51,35L 49,35L 49,40L 51,40L 51,35 Z M 47,35L 45,35L 45,40L 47,40L 47,35 Z M 21,38L 21,40L 23,40L 23,38L 21,38 Z M 46.75,53L 57,53L 57,57L 46.75,57L 44.75,55L 46.75,53 Z M 29.25,53L 31.25,55L 29.25,57L 19,57L 19,53L 29.25,53 Z M 29.5147,59.9926L 34.5073,55L 29.5147,50.0074L 33.0074,46.5147L 38,51.5074L 42.9926,46.5147L 46.4853,50.0074L 41.7426,55L 46.4853,59.9926L 42.9926,63.4853L 38,58.7426L 33.0074,63.4853L 29.5147,59.9926 Z M 36,46.25L 36,44L 40,44L 40,46.25L 38,48.25L 36,46.25 Z "
                />
            </svg>
            <div>
                <h1>Error loading page</h1>
                <p>An unexpected error occurred while loading this tab. Please try a different tab.</p>
            </div>
        </div>
    `);
    $("main").animate({ opacity: 1 }, 500);
});

$(document).ready(() => {
    // Load the current tab
    $("main").load(pages[current_tab], function () {
        // Notifies dependent modules that the page has finished loading
        this.dispatchEvent(new Event("loading_complete"));
    });

    // Swap animation
    $("main").on("htmx:beforeSwap", (e) => {
        $("main").css("opacity", "0");
    });

    $("main").on("htmx:afterSwap", (e) => {
        $("main").animate({ opacity: 1 }, 500);
    });

    // Nav collapse function
    collapsed_flag = false;
    collapsed_nav_is_expanded = false;
    last_height = null;
    async function nav_click() {
        if (collapsed_nav_is_expanded) {
            $("nav").css("opacity", "");
            $("header").css("height", last_height);
            await delay(700);
            $("header").css("height", "");
            $("nav").css("display", "");
        } else {
            last_height = $("header").height();
            $("header").css("height", last_height);
            await delay(100);
            $("nav").css("display", "flex");
            $("header").css("height", "100vh");
            await delay(100);
            $("nav").css("opacity", "1");
        }
        collapsed_nav_is_expanded = !collapsed_nav_is_expanded;
    }
    function handleMediaQueryChange(event) {
        if (event.matches && !collapsed_flag) {
            collapsed_flag = true;
            // Collapse nav when the viewport is 1200px or less and not collapsed already
            $("nav").before(
                `
                <div id="compact_nav">
                    <svg viewBox="0 0 512 512">
                        <rect width="352" height="32" x="80" y="96"/>
                        <rect width="352" height="32" x="80" y="240"/>
                        <rect width="352" height="32" x="80" y="384"/>
                    </svg>
                </div>
                
                `
            );

            $("#compact_nav").click(nav_click);
        } else if (collapsed_flag) {
            collapsed_flag = false;
            if (collapsed_nav_is_expanded) {
                nav_click();
            }
            // Expand nav when the viewport is greater than 1200px and not already expanded
            $("#compact_nav").remove();
        }
    }
    const mediaQuery = window.matchMedia("(max-width: 1200px)");
    // Initial check
    handleMediaQueryChange(mediaQuery);
    // Listen for changes
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    $(".nav_item").click((e) => {
        if (collapsed_nav_is_expanded) {
            nav_click();
        }
    });

    // Header shade after scroll
    $(window).scroll(() => {
        if ($(window).scrollTop() > 0) {
            $("header").addClass("header_shade");
        } else {
            $("header").removeClass("header_shade");
        }
    });

    // Z animation
    let timeoutID;
    let text = ["Zhou, Edwin", "Zecr Samanadro"];
    let iteration = 1;
    let alternator = 0;
    let resetTimeoutID; // To hold the timeout for delaying the reset on mouseleave
    let isAnimating = false; // Flag to track if animation is in progress

    function page_icon_animation() {
        // Check window width > 650px
        if (iteration < text[alternator].length && $(window).width() > 650) {
            const currentText = text[alternator].charAt(iteration);
            const span = document.createElement("span");
            span.textContent = currentText === " " ? "\u00A0" : currentText; // Handle spaces
            span.style.opacity = 0; // Initially hidden

            document.getElementById("page_title").appendChild(span);

            // Fade in the character
            $(span).animate({ opacity: 1 }, 200); // Fade in over 200ms

            iteration++;
            timeoutID = setTimeout(page_icon_animation, 50);
        }
    }

    $("#page_title").mouseenter(() => {
        if (isAnimating) return; // If animation is already running, don't start another animation

        isAnimating = true; // Mark animation as in progress
        page_icon_animation();
    });

    $("#page_title").mouseleave(() => {
        // Delay reset by 3 seconds
        if (resetTimeoutID) clearTimeout(resetTimeoutID); // Clear any previous reset timeout

        // Set the timeout to reset the content after 3 seconds
        resetTimeoutID = setTimeout(() => {
            // Fade out the existing characters before resetting the text (2 seconds duration)
            $("#page_title span").animate({ opacity: 0 }, 2000, function () {
                // After fade-out completes, reset the content to just "Z"
                $("#page_title").html("Z"); // Reset to "Z" with a span wrapper
                isAnimating = false; // Mark animation as completed
            });

            // Reset iteration and alternator after the fade-out
            iteration = 1;
            alternator = 1 - alternator;
            clearTimeout(timeoutID);
        }, 3000); // 3-second delay before initiating fade-out and reset
    });
});

// Remove the script tag from the loaded page (as a chuni way of making some less experienced programmers wonder how I got the nav to work)
document.currentScript.remove();
