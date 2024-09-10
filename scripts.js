// Function to shorten links using the DropLink API
async function shortenLink(url) {
    const apiKey = 'd84cf1c232f6aa62029cfa8d08acbac1f965b488'; // Your DropLink API key
    const apiUrl = `https://droplink.co/api?api=${apiKey}&url=${encodeURIComponent(url)}&format=text`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const shortenedUrl = await response.text();
        if (shortenedUrl) {
            return shortenedUrl;
        } else {
            console.error('Shortening failed: No URL returned');
            return url;
        }
    } catch (error) {
        console.error('Error:', error);
        return url;
    }
}
// Function to replace shortcodes with their URLs
async function replaceShortcodes() {
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
                // Replace shortcodes with full URLs
                content = content.replace(shortcode.regex, (match, id) => {
                    return `<a class='shorten-link' data-url='${shortcode.url}${id}' data-name='${shortcode.name}' target='_blank'>
                               <button class='download-button'>${shortcode.name}</button>
                            </a>`;
                });
            }
        }
        contentContainer.innerHTML = content;
    }
    // Now shorten the links using DropLink API
    await shortenLinksInContent();
}
// Function to shorten links in the content after initial replacement
async function shortenLinksInContent() {
    const links = document.querySelectorAll('.shorten-link');
    for (const link of links) {
        const fullUrl = link.getAttribute('data-url');
        const name = link.getAttribute('data-name');
        const shortenedUrl = await shortenLink(fullUrl);
        link.href = shortenedUrl;
        link.innerHTML = `<button class='download-button'>${name}</button>`;
    }
}
// Run script after DOM content is loaded
document.addEventListener('DOMContentLoaded', replaceShortcodes);
