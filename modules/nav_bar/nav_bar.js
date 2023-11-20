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
            <img src="/modules/nav_bar/nav_load_error.svg" alt="Error loading page">
            <div>
                <h1> Error loading page </h1>
                <p> An unexpected error occurred while loading this tab. Please try a different tab. </p>
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
});

// Remove the script tag
document.currentScript.remove();
