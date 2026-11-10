
/* Smooth page navigation without reloading the music */

document.addEventListener("DOMContentLoaded", () => {

    const content = document.getElementById("content");
    const charCount = document.getElementById("charCount");
    const bannerTitle = document.querySelector("#bannerShadow h1");

    let navigationRequest = 0;

    async function loadArticle(pageName, updateHistory = true) {

        // Only allow our three article pages
        const allowedPages = [
            "page_one",
            "page_two",
            "page_three"
        ];

        if (!allowedPages.includes(pageName)) return;

        const requestId = ++navigationRequest;

        try {
            const response = await fetch(
                "./pages/" + pageName + ".md"
            );

            if (!response.ok) {
                throw new Error("Could not load article");
            }

            const markdown = await response.text();

            // Ignore older requests if the visitor switches quickly
            if (requestId !== navigationRequest) return;

            const html = marked.parse(markdown);

            // Prepare the new article
            const temporary = document.createElement("div");
            temporary.innerHTML = html;

            const heading = temporary.querySelector("h1");

            if (heading) {
                bannerTitle.textContent = heading.textContent;
                document.title = heading.textContent;
                heading.remove();
            }

            // Replace the article without refreshing the site
            content.innerHTML = temporary.innerHTML;

            document.body.id = pageName;

            // Update character count
            const characters = content.textContent
                .replace(/\s+/g, " ")
                .trim()
                .length;

            charCount.textContent = characters + " characters";

            // Update the browser address
            if (updateHistory) {
                const url = new URL(window.location.href);
                url.searchParams.set("page", pageName);

                history.pushState({ page: pageName }, "", url);
            }

            // Return to top of the article
            window.scrollTo(0, 0);

        } catch (error) {
            console.error("Page navigation failed:", error);
        }
    }

    // Handle navigation links and carousel article links
    document.addEventListener("click", (event) => {

        const link = event.target.closest("a[href]");

        if (!link) return;

        const url = new URL(link.href, window.location.href);

        // Leave external links alone
        if (url.origin !== window.location.origin) return;
        if (url.pathname !== window.location.pathname) return;

        const pageName = url.searchParams.get("page");

        // Only intercept links to our articles
        if (!["page_one", "page_two", "page_three"].includes(pageName)) {
            return;
        }

        // Preserve browser shortcuts such as Ctrl+click
        if (
            event.button !== 0 ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey ||
            link.target === "_blank"
        ) return;

        event.preventDefault();

        loadArticle(pageName);
    });

    // Support the browser Back and Forward buttons
    window.addEventListener("popstate", () => {

        const pageName = new URLSearchParams(
            window.location.search
        ).get("page") || "page_one";

        loadArticle(pageName, false);
    });

});
