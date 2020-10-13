// initialize map
mapboxgl.accessToken = 'pk.eyJ1Ijoibm9yYXVuaWtvZWxuIiwiYSI6ImNrNXBjOGx5bzA3N2wzbm8zYzZ1dTkwNHUifQ.d6V4sJ4GnBQRKctyzgypSg';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/noraunikoeln/ckecsm1aw001619s1phsbsj7v', // stylesheet location
    center: [10.348,51.358], // starting position [lng, lat]
    zoom: 4.88, // starting zoom   
});

/* open sidebar */
function toggleSidebar(id) {
    var elem = document.getElementById(id);
    var classes = elem.className.split(' ');
    var collapsed = classes.indexOf('collapsed') !== -1;

    var padding = {};

    if (collapsed) {
        // Remove the 'collapsed' class from the class list of the element, this sets it back to the expanded state.
        classes.splice(classes.indexOf('collapsed'), 1);

        padding[id] = 300; // In px, matches the width of the sidebars set in .sidebar CSS class
        map.easeTo({
        padding: padding,
        duration: 1000 // In ms, CSS transition duration property for the sidebar matches this value
        });
    } else {
        padding[id] = 0;
        // Add the 'collapsed' class to the class list of the element
        classes.push('collapsed');

        map.easeTo({
        padding: padding,
        duration: 1000
        });              }

    // Update the class list on the element
    elem.className = classes.join(' ');
} 

/*function filterBy(launch) {
    var filters = ['==', 'launch', launch];
    map.setFilter('digitale-angebote', filters);
}*/

map.on('load', function() {
    
    map.addSource("museen-deutschland", {
        "type": "geojson",
        "data": "https://norabrummel.github.io/norabrummel.github.io/museen.geojson",
        "buffer": 0,
        "maxzoom": 14,
        "generateId": true
    });
    map.addLayer({
        'id': 'museen-gesamt',
        'source': 'museen-deutschland',
        'type': 'circle',
        'layout': {
            'visibility': 'visible'
        },
        'paint': {
            'circle-radius': 1.6,
            'circle-color': 'rgb(87,116,104,0.7)'
        }
    });
    map.addSource('digitale-angebote', {
        "type": "geojson",
        "data": "https://norabrummel.github.io/norabrummel.github.io/angebote.geojson",
        "buffer": 0,
        "maxzoom": 14,
        "generateId": true
    });
    map.addLayer({
        'id': 'digitale-angebote',
        'source': 'digitale-angebote',
        'type': 'circle',
        'paint': {
            'circle-radius': 3.2,
            'circle-color': [
              'match',
                ['get', 'category'],
                'Virtuelle Ausstellungen, Erkundungen & Rundgänge',
                '#e55d5d',
                'Videos & Filme',
                '#2deba2',
                'Onlinekurs ',
                '#fbb03b',
                'Online-Portal',
                '#efe22e',
                'Podcasts, Audioguides & Hörspiele',
                '#da30f8',
                'Digitale Publikation ',
                '#0d0d0d',
                'Online-Events',
                '#8944e9',
                'Digitale Sammlungen & Archive',
                '#3d64e6',
                'Online-Projekt',
                '#f78efb',
                'Apps & Spiele',
                '#b10b0b',
                '#ccc'    
            ]
        }
    });
    toggleSidebar('left');
    /*map.addControl(new mapboxgl.Navigation());*/
    
    /* document
        .getElementById('timeslider')
        .addEventListener('input', function(e) {
            var launch = parseInt(e.target.value, 10);
            filterBy(launch);
    });*/
});
/*smooth scrolling*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();                    document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
/*hide layer museen-gesamt*/
function hideLayer() {
    var visibility = map.getLayoutProperty('museen-gesamt', 'visibility');
    if (visibility === 'visible') {
        map.setLayoutProperty('museen-gesamt', 'visibility', 'none');
    }else {
        map.setLayoutProperty('museen-gesamt', 'visibility', 'visible');
    }           
}