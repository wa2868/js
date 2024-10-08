// Function to shorten links using the DropLink API
function shortenLink(url) {
    const apiKey = 'd84cf1c232f6aa62029cfa8d08acbac1f965b488'; // Your DropLink API key
    const apiUrl = `https://droplink.co/api?api=${apiKey}&url=${encodeURIComponent(url)}&format=text`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(shortenedUrl => {
            if (shortenedUrl) {
                updateLink(url, shortenedUrl); // Update the link in the DOM
            } else {
                console.error('Shortening failed: No URL returned');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to replace shortcodes with their URLs
function replaceShortcodes() {
    const shortcodes = {
        egf: { name: 'GDFLIX', regex: /\[egf id='(.*?)'\]/g, url: 'https://www.txrlinks.icu/egf' },
        egt: { name: 'GDTOT', regex: /\[egt id='(.*?)'\]/g, url: 'https://www.txrlinks.icu/egt' },
        egb: { name: 'GDBOT', regex: /\[egb id='(.*?)'\]/g, url: 'https://www.txrlinks.icu/egb' },
        zgf: { name: 'GDFLIX', regex: /\[zgf id='(.*?)'\]/g, url: 'https://new3.gdflix.cfd/file/' },
        zgt: { name: 'GDTOT', regex: /\[zgt id='(.*?)'\]/g, url: 'https://new5.gdtot.dad/file/' },
        zap: { name: 'No-Deside', regex: /\[zap id='(.*?)'\]/g, url: 'https://gdbot.txrlinks.icu/' },
        zgb: { name: 'GDBOT', regex: /\[zgb id='(.*?)'\]/g, url: 'https://gdmirrorbot.nl/file/' },
        mgf: { name: 'GDFLIX', regex: /\[mgf id='(.*?)'\]/g, url: 'https://new3.gdflix.cfd/file/' },
        mgt: { name: 'GDTOT', regex: /\[mgt id='(.*?)'\]/g, url: 'https://new5.gdtot.dad/file/' },
        mgb: { name: 'GDBOT', regex: /\[mgb id='(.*?)'\]/g, url: 'https://gdmirrorbot.nl/file/' },
    };

    const contentContainers = document.querySelectorAll('.post-body');

    for (const contentContainer of contentContainers) {
        let content = contentContainer.innerHTML;

        // Process each shortcode
        for (const key in shortcodes) {
            if (shortcodes.hasOwnProperty(key)) {
                const shortcode = shortcodes[key];
                content = content.replace(shortcode.regex, (match, id) => {
                    const fullUrl = `${shortcode.url}${id}`;
                    shortenLink(fullUrl); // Trigger the link shortening but don't wait for it
                    return `<a class='shorten-link' data-url='${fullUrl}' data-name='${shortcode.name}' target='_blank'>
                               <button class='download-button'>${shortcode.name}</button>
                            </a>`;
                });
            }
        }

        contentContainer.innerHTML = content;
    }
}

// Function to update the link in the DOM
function updateLink(originalUrl, shortenedUrl) {
    const link = document.querySelector(`.shorten-link[data-url='${originalUrl}']`);
    if (link) {
        const name = link.getAttribute('data-name');
        link.href = shortenedUrl;
        link.innerHTML = `<button class='download-button'>${name}</button>`;
    }
}

// Run script after DOM content is loaded
document.addEventListener('DOMContentLoaded', replaceShortcodes);
