// const Request = require("../../../models/requestSchema");
// const User = require("../../../models/userModel");


function geoFindMe() {
    let map, infoWindow;

    let latitude, longitude;

    let status, mapLink;
    let dashLatitude, dashLongitude;
    if (this.id == 'medicalSOS') {
        status = document.querySelector('#medicalStatus');
        mapLink = document.querySelector('#medicalMapLink');
        dashLatitude = document.querySelector('#medicalLatitude');
        dashLongitude = document.querySelector('#medicalLongitude');
    } else {
        status = document.querySelector('#crimeStatus');
        mapLink = document.querySelector('#crimeMapLink');
        dashLatitude = document.querySelector('#crimeLatitude');
        dashLongitude = document.querySelector('#crimeLongitude');
    }


    mapLink.href = '';
    mapLink.textContent = '';
    let latlng;

    function success(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        dashLatitude.value = latitude;
        dashLongitude.value = longitude;

        status.textContent = '';
        const geocoder = new google.maps.Geocoder();
        geocodeLatLng(geocoder);

        function geocodeLatLng(geocoder) {
            let latlng = {
                lat: latitude,
                lng: longitude,
            };
            geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === "OK") {
                    if (results[0]) {
                        mapLink.textContent = `${results[0].formatted_address}`;
                        //link to be shown on helpers device
                        mapLink.href = `https://www.google.com/maps/search/${results[0].formatted_address}/`;

                    } else {
                        window.alert("No results found");
                    }
                } else {
                    window.alert("Geocoder failed due to: " + status);
                }
            });
        }
    }

    function error() {
        status.textContent = 'Unable to retrieve your location';
    }
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    if (!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser';
    } else {

        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 14,
        });
        status.textContent = 'Locating…';
        infoWindow = new google.maps.InfoWindow();
        const locationButton = document.createElement("button");
        locationButton.textContent = "Pan to Current Location";
        locationButton.classList.add("custom-map-control-button");
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
        locationButton.addEventListener("click", () => {
            // Try HTML5 geolocation.
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    infoWindow.setPosition(pos);
                    infoWindow.setContent("Location found.");
                    infoWindow.open(map);
                    map.setCenter(pos);
                    const marker = new google.maps.Marker({
                        position: pos,
                        map: map,
                    });
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
            );
        });

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(
                browserHasGeolocation ?
                "Error: The Geolocation service failed." :
                "Error: Your browser doesn't support geolocation."
            );
            infoWindow.open(map);
        }
        navigator.geolocation.getCurrentPosition(success, error, options);
    }



}


document.querySelector('#medicalSOS').addEventListener('click', geoFindMe);
document.querySelector('#crimeSOS').addEventListener('click', geoFindMe);