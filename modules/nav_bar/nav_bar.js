// <script src="nav_bar/nav_bar.js" data-id="Home"></script>

// Get the query string
let current_tab = Object.fromEntries(new URLSearchParams(window.location.search))["tab"];
if (current_tab == undefined) {
    current_tab = "Home";
}

// Add CSS dependency to the page
document.head.insertAdjacentHTML(
    "beforeend",
    `<link hx-preserve="true" rel="stylesheet" href="modules/nav_bar/nav_bar.css">`
);

// Pages to be added to the nav bar
var pages = {
    Home: "/pages/home_page/home.html",
    Projects: "/pages/projects_page/projects.html",
    Skills: "/pages/skills_page/skills.html",
    Contact: "/pages/contact_page/contact.html",
};

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

    // Header shade after scroll
    $(window).scroll(() => {
        if ($(window).scrollTop() > 0) {
            $("header").addClass("header_shade");
        } else {
            $("header").removeClass("header_shade");
        }
    });
});

// Remove the script tag
document.currentScript.remove();
