// Check browser local storage to see if the user has visited the site before.
// If not, show the splash screen, otherwise do nothing.

// Add CSS dependency to the page
document.head.insertAdjacentHTML(
    "beforeend",
    `<link rel="stylesheet" hx-preserve="true" href="modules/first_time_visitor_splash/first_time_visitor_splash.css">`
);

if (localStorage.getItem("zecr_last_visit_time")) {
    // Check if over 6 hours have passed since last visit
    let last_visit_time = new Date(localStorage.getItem("zecr_last_visit_time"));
    let current_time = new Date();

    // Milliseconds
    let time_diff = current_time - last_visit_time;

    window.onload = function () {
        let visit_count = parseInt(localStorage.getItem("zecr_visit_count"));
        if (visit_count <= 3 && visit_count > 0) {
            $("#main_title").text("Welcome back!");
            $("#main_paragraph").html(
                `Hey, welcome back! Didn't get enough last time? But this is a small site... <br>
                ...or did you just come back for the "breathing bubbles" in the background?`
            );
        } else if (visit_count <= 5) {
            $("#main_title").text("You're back again...");
            $("#main_paragraph").html(
                `So, I'm pretty sure that this site only has a few pages... <br>
                ...is there something really interesting about it or something?`
            );
        } else {
            $("#main_title").text("...");
            $("#main_paragraph").html(
                `I'm starting to get a bit concerned ... are you okay? <br>
                This is your ${visit_count}th visit to this site. <br>
                There really isn't that much here...`
            );
        }

        // Update visit count only if over 2 hours have passed since last visit
        // (60 * 60 * 1000 = 3600000 = 1 hour)
        if (time_diff > (3600000) * 2) {
            localStorage.setItem("zecr_visit_count", visit_count + 1);
        }

        // Update time
        localStorage.setItem("zecr_last_visit_time", new Date());
    };
} else {
    $("body").css("visibility", "hidden");

    window.onload = function () {
        $("#main_paragraph").html(
            `It seems that you've somehow stumbled upon my personal website. An accident? Perhaps... perhaps not. <br> 
            Anyways, I'm glad you're here. Click the button below to learn a bit more about me!`
        );

        $("#main_title").css("visibility", "visible");
        $("#main_paragraph").css("visibility", "visible");
        $("#background").css("visibility", "visible");

        // Insert button after paragraph
        let button = document.createElement("button");
        button.id = "splash_button";
        button.innerHTML = "Enter Site";
        $("#main_paragraph").after(button);

        $("#splash_button").after(
            `<div id='splash_joke'>By clicking the button above, you consent to the use of cookies and malware on your device. Just kidding.</div>`
        );

        // Add event listener to button
        $("#splash_button").click(function () {
            $("#main_title").text("Welcome!");
            $("#main_paragraph").html(`Have a look around!`);

            $("body").css({
                visibility: "unset",
                opacity: "0",
            });

            // Fade in body
            $("body").animate(
                {
                    opacity: "1",
                },
                1000
            );

            $("body").css("opacity", "unset");

            localStorage.setItem("zecr_last_visit_time", new Date());
            localStorage.setItem("zecr_visit_count", 1);
            $(this).remove();
            $("#splash_joke").remove();
        });
    };
}

document.currentScript.remove();
