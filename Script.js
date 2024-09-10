
        let map;
        let directionsRenderer;
        let directionsService;
        let activePolyline = null;
        let userLocationMarker;
        let userLocation = null;
        let routeMarkers = [];
        let busMarkers = [];
        let routes = [];
        let activeBusMarker = null;

        function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: 7.8742, lng: 80.6511 },
                zoom: 8,
                fullscreenControl: false,
                mapTypeControl: false,
                streetViewControl: false
            });

            directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
            directionsService = new google.maps.DirectionsService();

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    userLocationMarker = new google.maps.Marker({
                        position: userLocation,
                        map: map,
                        title: 'Your Location',
                        icon: {
                            url: 'https://maps.google.com/mapfiles/kml/shapes/man.png',
                            scaledSize: new google.maps.Size(40, 40)
                        }
                    });
                    map.setCenter(userLocation);
                    map.setZoom(12);
                }, error => {
                    console.error('Error getting user location:', error);
                });
            } else {
                console.error('Geolocation is not supported by this browser.');
            }

            document.getElementById('hamburger').addEventListener('click', function () {
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.toggle('open');
                this.classList.toggle('open');

                // Toggle hamburger icon between ☰ and ✖
                if (this.classList.contains('open')) {
                    this.innerHTML = '✖';
                } else {
                    this.innerHTML = '☰';
                }
            });

            document.getElementById('search-form').addEventListener('submit', function (event) {
                event.preventDefault();
                const destinationAddress = document.getElementById('destination').value;
                if (userLocation) {
                    clearRouteMarkers();
                    searchBusRoutes(userLocation, destinationAddress);
                } else {
                    alert('User location not available.');
                }
            });

            loadShuttleRoutes();
            fetchBusMarkers();
            addDropdownListener();
        }

        function loadShuttleRoutes() {
            routes = [
                {
                    id: 1,
                    name: 'KDU to Horana',
                    waypoints: [
                        { location: { lat: 6.817891958515536, lng: 79.89029657969294 } },
                        { location: { lat: 6.7881315078035165, lng: 79.88514644572157 } },
                        { location: { lat: 6.712413423886176, lng: 79.90755138051695 } },
                        { location: { lat: 6.71429808954886, lng: 79.98896073852697 } },
                        { location: { lat: 6.716465188103684, lng: 80.06430259017748 } }
                    ],
                    stops: ['KDU', 'Moratuwa', 'Panadura', 'Bandargama', 'Horana'],
                    details: 'Operational from 7 AM to 9 PM, every 30 minutes.'
                },
                {
                    id: 2,
                    name: 'KDU to Meepe',
                    waypoints: [
                        { location: { lat: 6.817891958515536, lng: 79.89029657969294 } },
                        { location: { lat: 6.80176567319215, lng: 79.92253343880353 } },
                        { location: { lat: 6.84088308611096, lng: 79.96536295215469 } },
                        { location: { lat: 6.84472361447962, lng: 80.01512235887209 } },
                        { location: { lat: 6.856632814575697, lng: 80.08970922621586 } }
                    ],
                    stops: ['KDU', 'Piliyandala', 'Kottawa', 'Meepe'],
                    details: 'Operational from 8 AM to 10 PM, every 20 minutes.'
                },
                {
                    id: 3,
                    name: 'KDU to Nittambuwa',
                    waypoints: [
                        { location: { lat: 6.817891958515536, lng: 79.89029657969294 } },
                        { location: { lat: 6.861906276971197, lng: 79.91936899617609 } },
                        { location: { lat: 6.909136633304691, lng: 79.93119984916599 } },
                        { location: { lat: 6.929199398402235, lng: 79.9828475043213 } },
                        { location: { lat: 6.987617456768836, lng: 80.01543898776372 } },
                        { location: { lat: 7.0320729559296735, lng: 80.02806281232476 } },
                        { location: { lat: 7.08664258595529, lng: 80.0336464266108 } },
                        { location: { lat: 7.144850779278179, lng: 80.10407603642076 } }
                    ],
                    stops: ['KDU', 'Maharagama', 'Koswaththa', 'Kaduwela', 'Delgoda', 'Weliweriya', 'Yakkala', 'Nittambuwa'],
                    details: 'Operational from 7 AM to 9 PM, every 30 minutes.'
                },
                {
                    id: 4,
                    name: 'KDU to Pokunuwita',
                    waypoints: [
                        { location: { lat: 6.817891958515536, lng: 79.89029657969294 } },
                        { location: { lat: 6.801954192849703, lng: 79.92272458438697 } },
                        { location: { lat: 6.784454649654796, lng: 79.9782035026369 } },
                        { location: { lat: 6.754710770534585, lng: 80.01510459269464 } },
                        { location: { lat: 6.856632814575697, lng: 80.08970922621586 } }
                    ],
                    stops: ['KDU', 'Piliyandala', 'Kottawa', 'Meepe'],
                    details: 'Operational from 8 AM to 10 PM, every 20 minutes.'
                },
                {
                    id: 5,
                    name: 'KDU to Negombo',
                    waypoints: [
                        { location: { lat: 6.817891958515536, lng: 79.89029657969294 } },
                        { location: { lat: 6.828523345071361, lng: 79.91199827339778 } },
                        { location: { lat: 6.864991429394037, lng: 79.90149523792302 } },
                        { location: { lat: 6.968573676390797, lng: 79.88976142940119 } },
                        { location: { lat: 6.988878193982376, lng: 79.89161935498335 } },
                        { location: { lat: 7.064790089658427, lng: 79.89328367530977 } },
                        { location: { lat: 7.205683905053959, lng: 79.84130741042763 } }
                    ],
                    stops: ['KDU', 'Pepiliyana', 'Nugegoda', 'Peliyagoda', 'Ja-Ela', 'Negombo'],
                    details: 'Operational from 8 AM to 10 PM, every 20 minutes.'
                }
            ];

            const dropdown = document.getElementById('shuttle-dropdown');
            dropdown.innerHTML = '<option value="" disabled selected>Select a shuttle route</option>';

            routes.forEach(route => {
                const option = document.createElement('option');
                option.value = route.id;
                option.textContent = route.name;
                dropdown.appendChild(option);
            });
        }

        function addDropdownListener() {
            const dropdown = document.getElementById('shuttle-dropdown');
            dropdown.addEventListener('change', function () {
                const selectedRouteId = parseInt(this.value);
                const selectedRoute = routes.find(route => route.id === selectedRouteId);
                if (selectedRoute) {
                    clearRouteMarkers();
                    showShuttleInfo(selectedRoute);
                }
            });
        }

        function showShuttleInfo(route) {
            const shuttleInfo = document.getElementById('shuttle-info');
            shuttleInfo.innerHTML = `
                <p><strong>Stops:</strong> ${route.stops.join(', ')}</p>
                <p><strong>Details:</strong> ${route.details}</p>
            `;
            shuttleInfo.style.display = 'block';

            if (activePolyline) {
                activePolyline.setMap(null);
            }

            const request = {
                origin: route.waypoints[0].location,
                destination: route.waypoints[route.waypoints.length - 1].location,
                waypoints: route.waypoints.slice(1, -1),
                travelMode: google.maps.TravelMode.DRIVING
            };

            directionsService.route(request, function (response, status) {
                if (status === 'OK') {
                    directionsRenderer.setDirections(response);

                    const startMarker = new google.maps.Marker({
                        position: route.waypoints[0].location,
                        map: map,
                        title: 'Start'
                    });
                    routeMarkers.push(startMarker);

                    const endMarker = new google.maps.Marker({
                        position: route.waypoints[route.waypoints.length - 1].location,
                        map: map,
                        title: 'End'
                    });
                    routeMarkers.push(endMarker);
                } else {
                    console.error('Directions request failed due to ' + status);
                }
            });
        }

        function fetchBusMarkers() {
            fetch('fetch_data.php')
                .then(response => response.json())
                .then(data => {
                    data.forEach(coordinate => {
                        const lat = parseFloat(coordinate.Latitude);
                        const lng = parseFloat(coordinate.Longitude);
                        if (!isNaN(lat) && !isNaN(lng)) {
                            const customIcon = {
                                url: 'https://www.pngfind.com/pngs/m/82-822378_icono-bus-png-bus-png-icon-transparent-png.png',
                                scaledSize: new google.maps.Size(32, 32)
                            };
                            const highlightedIcon = {
                                url: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
                                scaledSize: new google.maps.Size(40, 40)
                            };
                            const marker = new google.maps.Marker({
                                position: { lat: lat, lng: lng },
                                map: map,
                                icon: customIcon,
                                title: coordinate.Name
                            });
                            busMarkers.push(marker);

                            marker.addListener('click', () => {
                                if (activeBusMarker && activeBusMarker !== marker) {
                                    activeBusMarker.setIcon(customIcon);
                                }
                                marker.setIcon(highlightedIcon);
                                activeBusMarker = marker;
                                if (userLocation) {
                                    calculateDistanceAndTime(userLocation, { lat: lat, lng: lng }, marker);
                                } else {
                                    alert('User location not available.');
                                }
                            });
                        } else {
                            console.error('Invalid coordinate:', coordinate);
                        }
                    });
                })
                .catch(error => console.error('Error fetching data:', error));
        }

        function calculateDistanceAndTime(origin, destination, marker) {
            const service = new google.maps.DistanceMatrixService();

            service.getDistanceMatrix({
                origins: [new google.maps.LatLng(origin.lat, origin.lng)],
                destinations: [new google.maps.LatLng(destination.lat, destination.lng)],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC
            }, (response, status) => {
                if (status === 'OK') {
                    const result = response.rows[0].elements[0];
                    const distanceText = result.distance.text;
                    const durationText = result.duration.text;
                    displayBusInfo(distanceText, durationText, destination.lat, destination.lng, marker);
                } else {
                    console.error('Error with Distance Matrix API:', status);
                }
            });
        }

        function displayBusInfo(distance, duration, lat, lng, marker) {
            const contentString = `
                <div id="bus-info-window">
                    <p><strong>Distance:</strong> ${distance}</p>
                    <p><strong>Duration:</strong> ${duration}</p>
                    <p><strong>Location:</strong> Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}</p>
                </div>
            `;
            const infoWindow = new google.maps.InfoWindow({
                content: contentString
            });
            infoWindow.open(map, marker);
        }

        function clearRouteMarkers() {
            routeMarkers.forEach(marker => marker.setMap(null));
            routeMarkers = [];
        }

        function searchBusRoutes(origin, destination) {
            const request = {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.TRANSIT,
                transitOptions: {
                    modes: ['BUS']
                },
                provideRouteAlternatives: true
            };

            directionsService.route(request, (response, status) => {
                if (status === 'OK') {
                    directionsRenderer.setMap(map);
                    directionsRenderer.setDirections(response);
                } else {
                    console.error('Error searching for bus routes:', status);
                }
            });
        }
    