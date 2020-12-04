import React from 'react';
import mapboxgl from 'mapbox-gl';
import './MapDrawService.css';
import logo from '../assets/car.jpg';
import {locationsList} from '../utility/constants';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
let map, directions, draw;
let markers = [];

mapboxgl.accessToken =
  'pk.eyJ1IjoiZ2lmZnBvbmciLCJhIjoiY2tndncxMG1tMDRmaTJ1cnJ4ZXowdnZidSJ9.NnXDLMCFzXlzCm_wOdk-0w';

export class MapDrawService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 100.5604,
      lat: 13.7329,
      zoom: 14.5,
      car: this.props.car,
    };
  }

  componentDidMount() {
    map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
    });

    draw = new MapboxDraw({
      // Instead of showing all the draw tools, show only the line string and delete tools
      displayControlsDefault: false,
      controls: {
        line_string: true,
        trash: true,
      },
      styles: [
        // Set the line style for the user-input coordinates
        {
          id: 'gl-draw-line',
          type: 'line',
          filter: [
            'all',
            ['==', '$type', 'LineString'],
            ['!=', 'mode', 'static'],
          ],
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': '#438EE4',
            'line-dasharray': [0.2, 2],
            'line-width': 4,
            'line-opacity': 0.7,
          },
        },
        // Style the vertex point halos
        {
          id: 'gl-draw-polygon-and-line-vertex-halo-active',
          type: 'circle',
          filter: [
            'all',
            ['==', 'meta', 'vertex'],
            ['==', '$type', 'Point'],
            ['!=', 'mode', 'static'],
          ],
          paint: {
            'circle-radius': 12,
            'circle-color': '#FFF',
          },
        },
        // Style the vertex points
        {
          id: 'gl-draw-polygon-and-line-vertex-active',
          type: 'circle',
          filter: [
            'all',
            ['==', 'meta', 'vertex'],
            ['==', '$type', 'Point'],
            ['!=', 'mode', 'static'],
          ],
          paint: {
            'circle-radius': 8,
            'circle-color': '#438EE4',
          },
        },
      ],
    });

    // Add the draw tool to the map
    map.addControl(draw);
  }

  async shouldComponentUpdate(nextProps) {
    if (this.props.car !== nextProps.car) {
      this.removeRoute();
      await this.updateRoute(this.props.car);
      return true;
    }
    return false;
  }

  async updateRoute(car) {
    // Set the profile
    var profile = 'driving';
    // Get the coordinates that were drawn on the map
    // var data = draw.getAll();
    // var lastFeature = data.features.length - 1;
    // var coords = data.features[lastFeature].geometry.coordinates;
    var coords = locationsList[car];
    // Format the coordinates
    var newCoords = coords.join(';');
    // Set the radius for each coordinate pair to 25 meters
    var radius = [];
    coords.forEach((element) => {
      radius.push(25);
    });
    this.getMatch(newCoords, radius, profile);
  }

  // Make a Map Matching request
  getMatch(coordinates, radius, profile) {
    // Separate the radiuses with semicolons
    var radiuses = radius.join(';');
    // Create the query
    var query =
      'https://api.mapbox.com/matching/v5/mapbox/' +
      profile +
      '/' +
      coordinates +
      '?geometries=geojson&radiuses=' +
      radiuses +
      '&steps=true&access_token=' +
      mapboxgl.accessToken;
    const fetchData = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(query, fetchData)
      .then((res) => res.text())
      .then((data) => {
        console.log('🚀 ~ MapDrawService ~ getMatch ~ data', data);
        data = JSON.parse(data);
        // Get the coordinates from the response
        var coords = data.matchings[0].geometry;
        // Draw the route on the map
        this.addRoute(coords);
        this.getInstructions(data.matchings[0]);
      })
      .catch((error) => {
        console.log('🚀 ~ MapDrawService ~ error', error);
      });
  }

  // Draw the Map Matching route as a new layer on the map
  addRoute(coords) {
    // If a route is already loaded, remove it
    if (map.getSource('route')) {
      map.removeLayer('route');
      map.removeSource('route');
    } else {
      map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: coords,
          },
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#03AA46',
          'line-width': 8,
          'line-opacity': 0.8,
        },
      });
    }
  }

  getInstructions(data) {
    // Target the sidebar to add the instructions
    var directions = document.getElementById('directions');

    var legs = data.legs;
    var tripDirections = [];
    // Output the instructions for each step of each leg in the response object
    for (var i = 0; i < legs.length; i++) {
      var steps = legs[i].steps;
      for (var j = 0; j < steps.length; j++) {
        tripDirections.push('<br><li>' + steps[j].maneuver.instruction) +
          '</li>';
      }
    }
    directions.innerHTML =
      '<br><h2>Trip duration: ' +
      Math.floor(data.duration / 60) +
      ' min.</h2>' +
      tripDirections;
  }

  // If the user clicks the delete draw button, remove the layer if it exists
  removeRoute() {
    if (map.getSource('route')) {
      map.removeLayer('route');
      map.removeSource('route');
    } else {
      return;
    }
  }

  render() {
    return (
      <div>
        <div className="sidebarStyle">
          {/* <div>
            Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom: {this.state.zoom}
          </div> */}
        </div>
        <div ref={(el) => (this.mapContainer = el)} className="mapContainer" />
        <div className="info-box">
          <div id="info">
            <p>
              Draw your route using the draw tools on the right. To get the most
              accurate route match, draw points at regular intervals.
            </p>
          </div>
          <div id="directions"></div>
        </div>
      </div>
    );
  }
}

export default MapDrawService;
