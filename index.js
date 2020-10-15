// initialize map
mapboxgl.accessToken = 'pk.eyJ1Ijoibm9yYXVuaWtvZWxuIiwiYSI6ImNrNXBjOGx5bzA3N2wzbm8zYzZ1dTkwNHUifQ.d6V4sJ4GnBQRKctyzgypSg';
const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/noraunikoeln/ckecsm1aw001619s1phsbsj7v', // stylesheet location
    center: [10.348, 51.358], // starting position [lng, lat]
    zoom: 4.88, // starting zoom
});

/* open sidebar */
function toggleSidebar(id) {
    const elem = document.getElementById(id);
    const classes = elem.className.split(' ');
    const collapsed = classes.indexOf('collapsed') !== -1;

    const padding = {};

    if (collapsed) {
        // Remove the 'collapsed' class from the class list of the element, this sets it back to the expanded state.
        classes.splice(classes.indexOf('collapsed'), 1);

        padding[id] = 300; // In px, matches the width of the sidebars set in .sidebar CSS class
        map.easeTo({
            padding,
            duration: 1000, // In ms, CSS transition duration property for the sidebar matches this value
        });
    } else {
        padding[id] = 0;
        // Add the 'collapsed' class to the class list of the element
        classes.push('collapsed');

        map.easeTo({
            padding,
            duration: 1000,
        });
    }

    // Update the class list on the element
    elem.className = classes.join(' ');
}

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    this.classList.toggle("active");

    /* Toggle between hiding and showing the active panel */
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
};

// The Problem: I want to implement an accordion for the different categories in the sidebar that toggles a list of all the features in the respective category. 

function renderListings(index, features) {
    const listingEl = document.getElementsByClassName('panel')[index];
    listingEl.innerHTML = '';
    if (features.length) {
        features.forEach(function (feature) {
            var prop = feature.properties;
            var item = document.createElement('span');
                item.innerHTML ='<strong><a href="' + prop.link + '" target="_blank" class="link-listing">' + prop.project_title + '</a></strong> (' + prop.museum + ', ' + prop.launch + ')</br>';
                listingEl.appendChild(item);
        });
    };
    var featureCount = features.length;
    const categoryTitle = document.getElementsByClassName('categoryTitle')[index];
    /*var countDiv = document.createElement('div');
    countDiv.innerHTML = ' (' + featureCount + ')';
    categoryTitle.append(countDiv);*/
    categoryTitle.innerHTML += ' (' + featureCount + ')';
    
}

function filterBy(index, category) {
   map.setFilter('digitale-angebote-2', ['==', ['string', ['get', 'category']], category]); 
   map.flyTo({
      center: [10.348, 51.358], // starting position [lng, lat]
      zoom: 4.88, // starting zoom  
   });
   var slider = document.getElementById('timeslider');
   slider.value = 2020;
   document.getElementById('min').innerHTML = slider.value;  
   const popup = document.getElementsByClassName('mapboxgl-popup');
    if ( popup.length ) {
        popup[0].remove();
    }
    
    var features = map.queryRenderedFeatures({ layers: ['digitale-angebote-2'] });
    if (features) {
        // Populate features for the listing overlay.
        renderListings(index, features);
    }
} 

map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {
    map.addSource('museen-deutschland', {
        type: 'geojson',
        data: 'https://norabrummel.github.io/norabrummel.github.io/museen.geojson',
        buffer: 0,
        maxzoom: 14,
        generateId: true,
    });
    map.addLayer({
        id: 'museen-gesamt',
        source: 'museen-deutschland',
        type: 'circle',
        layout: {
            visibility: 'visible',
        },
        paint: {
            'circle-radius': 1.6,
            'circle-color': '#BBBCBB',
        },
    });
    map.addSource('digitale-angebote-2', {
        type: 'geojson',
        data: 'https://norabrummel.github.io/norabrummel.github.io/angebote.geojson',
        buffer: 0,
        maxzoom: 14,
        generateId: true,
    });
    map.addLayer({
        id: 'digitale-angebote-2',
        source: 'digitale-angebote-2',
        type: 'circle',
        paint: {
            'circle-radius': 4.2,
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
                '#ccc',
            ],
        },
        filter: ['==', ['number', ['get', 'launch']], 1998]
    });
    toggleSidebar('left');
    
    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });
    var popupClose = new mapboxgl.Popup()
        popupClose.on('close', function(e) {
            map.flyTo({
              center: [10.348, 51.358], // starting position [lng, lat]
              zoom: 4.88, // starting zoom  
            });
        });
    
    map.on('mouseenter', 'digitale-angebote-2', function (e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        var launch = e.features[0].properties.launch;
        var title = e.features[0].properties.project_title;
        var info = e.features[0].properties.info;
        var museum = e.features[0].properties.museum;
        var link = e.features[0].properties.link;
        /*title.style.color = document.getElementById('digitale-angebote-2').getPaintProperty('circle-color');*/

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML('<strong>' + title + '</strong></br>' + info + '</br>(' + museum + ')</br><a href="' + link + '" target="_blank" style="word-wrap: break-word;" class="angebote-link">' + link + '</a></br><span style="font-size: 10px;">'+ launch + '</span>').addTo(map);
    });

    map.on('mouseleave', 'digitale-angebote-2', function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
    map.on('click', 'digitale-angebote-2', function (e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
        map.flyTo({ center: e.features[0].geometry.coordinates, zoom: 7 });

        var coordinates = e.features[0].geometry.coordinates.slice();
        var launch = e.features[0].properties.launch;
        var title = e.features[0].properties.project_title;
        var info = e.features[0].properties.info;
        var museum = e.features[0].properties.museum;
        var link = e.features[0].properties.link;
        /*title.style.color = document.getElementById('digitale-angebote-2').getPaintProperty('circle-color');*/

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popupClose.setLngLat(coordinates).setHTML('<strong>' + title + '</strong></br>' + info + '</br>(' + museum + ')</br><a href="' + link + '" target="_blank" style="word-wrap: break-word;" class="angebote-link">' + link + '</a></br><span style="font-size: 10px;">'+ launch + '</span>').addTo(map);
    });
    timeslide();
});
/* smooth scrolling */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth',
        });
    });
});
/* funtionality of timeslider */
function timeslide() {
   document.getElementById('timeslider').addEventListener('input', function(e) {
            var launch = parseInt(e.target.value);
            map.setFilter('digitale-angebote-2', ['==', ['number', ['get', 'launch']], launch]);
            document.getElementById('min').innerHTML = launch;   
    });  
};

/* hide layer museen-gesamt */
function hideLayer() {
    const visibility = map.getLayoutProperty('museen-gesamt', 'visibility');
    if (visibility === 'visible') {
        map.setLayoutProperty('museen-gesamt', 'visibility', 'none');
    } else {
        map.setLayoutProperty('museen-gesamt', 'visibility', 'visible');
    }
};
/* show all offers, no matter if launch has value or not */
function hideFilter() {
    var isChecked = document.getElementById('switchAngebote').checked;  
        if(isChecked) {    
           map.setFilter('digitale-angebote-2', null); 
           var slider = document.getElementById('timeslider');
           slider.value = 2020;
           document.getElementById('min').innerHTML = slider.value;      
        }else {
           timeslide(); 
        }
};
