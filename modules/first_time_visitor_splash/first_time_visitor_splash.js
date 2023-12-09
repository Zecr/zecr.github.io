// Check browser local storage to see if the user has visited the site before.
// If not, show the splash screen, otherwise do nothing.

// Add CSS dependency to the page
document.head.insertAdjacentHTML(
    "beforeend",
    `<link rel="stylesheet" hx-preserve="true" href="/modules/first_time_visitor_splash/first_time_visitor_splash.css">`
);

$("main").on("loading_complete", function () {
    var visit_count = parseInt(localStorage.getItem("zecr_visit_count") || 0);
    var time_diff = new Date() - new Date(localStorage.getItem("zecr_last_visit_time") || 0);

    // Only activate splash screen if over 2 hours have passed since last visit
    // (60 * 60 * 1000 = 3600000 = 1 hour)
    if (time_diff > 3600000 * 2) {
        // Hide body and show splash screen
        $("body").css("visibility", "hidden");

        // Save previous text
        let main_title = $("#main_title").text();
        let sub_title = $("#sub_title").html();

        // Change text based on visit count
        if (visit_count == 0) {
            $("#main_title").text("Why, hello there.");
            $("#sub_title").html(
                `It seems that you've somehow stumbled upon my personal website. An accident perhaps... or perhaps not? <br> <br>
            Anyways, I'm glad you're here. Click the button below to learn a bit more about me!`
            );
        } else if (visit_count <= 3) {
            $("#main_title").text("Edwin says: Welcome back!");
            $("#sub_title").html(
                `Thanks for coming back!<br> <br>
                Most people don't come back for a second time to a portfolio website <br>
                ...or did you just come back for the "breathing bubbles" in the background?`
            );
        } else if (visit_count <= 5) {
            $("#main_title").text('"You\'re back again... how odd" Edwin thinks to himself.');
            $("#sub_title").html(
                `So, I'm pretty sure that this site only has a few pages... <br>
                ...did I accidentally make something really interesting?`
            );
        } else {
            $("#main_title").text("Back again, eh? Stat-bot... activate!");
            $("#sub_title").html(
                `Hello I'm stat-bot <br> <br>
                I see this is your ${visit_count}th visit to this site. <br>
                End of program, press button below to continue...`
            );
        }

        // Make sure splash screen is visible
        $(".info_section").css("display", "none");
        $("#main_title").css("visibility", "visible");
        $("#sub_title").css("visibility", "visible");
        $("#background").css("visibility", "visible");

        // Insert button after paragraph
        let button = document.createElement("button");
        button.id = "splash_button";
        button.innerHTML = "Enter Site";
        $("#sub_title").after(button);

        // Insert joke after button
        $("#splash_button").after(
            `<div id='splash_joke'>By clicking the button above, you consent to the use of cookies and malware on your device. Just kidding about the malware.</div>`
        );

        // Button on click = Animate splash screen away and change home text
        $("#splash_button").click(function () {
            // Restore previous text and styling
            $("#main_title").text(main_title);
            $("#sub_title").html(sub_title);
            $("body").css({ visibility: "unset", opacity: "0" });

            // Fade in body
            $("body").animate({ opacity: "1" }, 1000);
            $("body").css("opacity", "unset");
            $(".info_section").css("display", "flex");

            localStorage.setItem("zecr_visit_count", visit_count + 1);

            // Remove splash screen
            $(this).remove();
            $("#splash_joke").remove();
        });
    }

    // Update visit time
    localStorage.setItem("zecr_last_visit_time", new Date());
});

document.currentScript.remove();
