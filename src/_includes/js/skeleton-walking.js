const legParts = [
    {
        children: [
            {
                children: [
                    {
                        children: [
                            {
                                index: 10,
                                origin: { x: 2463, y: 5394 },
                                path: "M2340.27 5376.99s78.16 4.79 210.71-129.66l12.15 158.03s38.94 83.67-.01 117.49c-38.96 33.83-109.41 16.21-109.41 16.21l-36.47-52.68-40.49 48.65-393.07-4.06s-34.93-134.33 72.92-141.84c107.86-7.5 102.65 135.8 283.67-12.14Z",
                                time: 700,
                            }
                        ],
                        index: 2,
                        origin: { x: 2453, y: 4906 },
                        path: "m2384.84 4874.53 4.05 542.98s147.08 66.9 133.74 4.06c-13.34-62.84-20.28-563.25-20.28-563.25l-117.51 16.21Z",
                        time: 700,
                    },
                ],
                index: 1,
                origin: { x: 2364, y: 2913 },
                path: "M2356.49 2791.75c-75.32 9.33-164.79 107.09-162.08 182.34l166.12 1973.38h174.24s-39.22-313.03-8.1-636.18c31.11-323.16 262.46-1573.14-170.18-1519.54Z",
                time: 700,
            }
        ],
        index: 20,
        origin: { x: 2307, y: 1874 },
        path: "M2291.64 1628.79c-44.36 4.42-175.82 2.83-166.15 174.23 9.67 171.39-70.33 280.97-52.66 429.53 17.66 148.57 31.61 631.71 109.41 741.54 77.79 109.84 307.42 121.09 352.53-20.26 45.11-141.35 100.86-767.54 129.65-863.12 28.79-95.57 167.42-515.78-372.78-461.92Z",
        time: 700,
    },
];

function renderLegParts(parts, parent) {
    for (let part of parts) {
        let gElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        gElement.style.transformOrigin = `${part.origin.x}px ${part.origin.y}px`;
        gElement.style.animationDuration = `${part.time}ms`;
        gElement.style.position = `absolute`;
        gElement.style.zIndex = `${part.index}`;
        
        let pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute('d', part.path);
        pathElement.setAttribute('fill', 'white');
        pathElement.setAttribute('stroke', 'black');

        gElement.appendChild(pathElement);
        parent.prepend(gElement);

        if (part.children?.length > 0) {
            renderLegParts(part.children, gElement);
        }
    }
}

renderLegParts(legParts, document.getElementById('leftSkeletonWalkingContainer'));
renderLegParts(legParts, document.getElementById('rightSkeletonWalkingContainer'));

function swipe() {
    const container = document.getElementById('zoomContainer');
    const leftTargetElement = document.getElementById('leftSkeletonWalkingContainer');
    const rightTargetElement = document.getElementById('rightSkeletonWalkingContainer');

    container.addEventListener('touchstart', (event) => {
        container.classList.toggle('zoom-container');
        leftTargetElement.classList.toggle('walking-left');
        rightTargetElement.classList.toggle('walking-right');
    });
}

swipe();
