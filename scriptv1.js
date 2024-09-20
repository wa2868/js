// Function to shorten links using the DropLink API
async function shortenLink(url) {
    const apiKey = 'd84cf1c232f6aa62029cfa8d08acbac1f965b488'; // Your DropLink API key
    const apiUrl = `https://droplink.co/api?api=${apiKey}&url=${encodeURIComponent(url)}&format=text`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.text();
    } catch (error) {
        console.error('Error:', error);
        return url; // Return original URL in case of error
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
    const linksToShorten = [];

    for (const contentContainer of contentContainers) {
        let content = contentContainer.innerHTML;

        // Process each shortcode
        for (const key in shortcodes) {
            if (shortcodes.hasOwnProperty(key)) {
                const shortcode = shortcodes[key];
                content = content.replace(shortcode.regex, (match, id) => {
                    const fullUrl = `${shortcode.url}${id}`;
                    linksToShorten.push({ fullUrl, name: shortcode.name, contentContainer });
                    return `<a class='shorten-link' data-url='${fullUrl}' data-name='${shortcode.name}' target='_blank'>
                               <button class='download-button'>${shortcode.name}</button>
                            </a>`;
                });
            }
        }
        contentContainer.innerHTML = content;
    }

    // Now shorten the links using the DropLink API
    await shortenLinksInBatch(linksToShorten);
}

// Function to shorten links in parallel using Promise.all
async function shortenLinksInBatch(linksToShorten) {
    const shortenPromises = linksToShorten.map(linkObj =>
        shortenLink(linkObj.fullUrl).then(shortenedUrl => {
            linkObj.shortenedUrl = shortenedUrl;
            return linkObj;
        })
    );

    // Wait for all links to be shortened
    const shortenedLinks = await Promise.all(shortenPromises);

    // Update DOM once all links are shortened
    shortenedLinks.forEach(linkObj => {
        const link = document.querySelector(`.shorten-link[data-url='${linkObj.fullUrl}']`);
        if (link) {
            link.href = linkObj.shortenedUrl;
            link.innerHTML = `<button class='download-button'>${linkObj.name}</button>`;
        }
    });
}

// Run script after DOM content is loaded
document.addEventListener('DOMContentLoaded', replaceShortcodes);
