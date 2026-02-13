export function makeItRain() {
    // Clear out everything
    const rainContainer = document.querySelectorAll('.rain');
    rainContainer.forEach(container => {
        container.innerHTML = ''; // Clear existing drops
    });

    let increment = 0;
    let drops = '';
    let backDrops = '';

    while (increment < 100) {
        // Random numbers for various randomizations
        var randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
        var randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);

        // Increment
        increment += randoFiver;

        // Add new raindrop with random CSS properties
        drops += `
            <div class="drop" style="left: ${increment}%; bottom: ${randoFiver + randoFiver - 1 + 100}%; 
                animation-delay: 0.${randoHundo}s; 
                animation-duration: 0.5${randoHundo}s;">
                <div class="stem" style="animation-delay: 0.${randoHundo}s; 
                    animation-duration: 0.5${randoHundo}s;"></div>
                <div class="splat" style="animation-delay: 0.${randoHundo}s; 
                    animation-duration: 0.5${randoHundo}s;"></div>
            </div>`;

        backDrops += `
            <div class="drop" style="right: ${increment}%; bottom: ${randoFiver + randoFiver - 1 + 100}%; 
                animation-delay: 0.${randoHundo}s; 
                animation-duration: 0.5${randoHundo}s;">
                <div class="stem" style="animation-delay: 0.${randoHundo}s; 
                    animation-duration: 0.5${randoHundo}s;"></div>
                <div class="splat" style="animation-delay: 0.${randoHundo}s; 
                    animation-duration: 0.5${randoHundo}s;"></div>
            </div>`;
    }

    document.querySelector('.rain.front-row').innerHTML += drops;
    document.querySelector('.rain.back-row').innerHTML += backDrops;
};

export function startRain() {
 

    // Initial call to make it rain
    makeItRain();
}