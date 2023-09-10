mapboxgl.accessToken = MAPBOXACCESSTOKEN;
const map = new mapboxgl.Map({
    container: 'map-detailed', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campData.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
const popup = new mapboxgl.Popup({ offset: 50 }).setHTML(
    `<h3>${campData.title}</h3>`
);
const marker = new mapboxgl.Marker()
    .setLngLat(campData.geometry.coordinates)
    .setPopup(popup)
    .addTo(map);
map.addControl(new mapboxgl.NavigationControl());