import React from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import './MapService.css';
import logo from '../assets/car.jpg';
import {locationsList} from '../utility/constants';
let map, directions, draw;
let markers = [];

mapboxgl.accessToken =
  'pk.eyJ1IjoiZ2lmZnBvbmciLCJhIjoiY2tndncxMG1tMDRmaTJ1cnJ4ZXowdnZidSJ9.NnXDLMCFzXlzCm_wOdk-0w';

export class MapService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 100.5604,
      lat: 13.7329,
      zoom: 14.5,
      car: this.props.car,
    };
  }

  setPosition = (carPosition) => {
    console.log('MapComponent -> carPosition', carPosition);
    const positions = locationsList[carPosition];
    console.log('MapComponent -> positions', positions);
    for (let index = 0; index < positions.length; index++) {
      const position = positions[index];
      let el = document.createElement('div');
      el.className = 'marker';
      el.source = logo;
      if (index == 0) {
        directions.setOrigin(position);
        el.style.backgroundImage = 'url(/static/media/car.09252cdf.jpg)';
      } else if (index == positions.length - 1) {
        directions.setDestination(position);
        el.style.backgroundImage = 'url(/static/media/car.09252cdf.jpg)';
      } else {
        directions.setWaypoint(index, position);
        el.style.backgroundImage =
          'url(/static/media/marker-editor.deb8f639.svg)';
      }
      el.style.width = '50px';
      el.style.height = '50px';
      const marker = new mapboxgl.Marker(el).setLngLat(position);
      console.log('🚀 ~ MapService ~ marker', marker);
      markers.push(marker);
      marker.addTo(map);
    }
  };

  removeMarker = () => {
    markers.forEach((element) => {
      element.remove();
    });
    for (let index = 0; index < markers.length; index++) {
      const marker = markers[index];
      marker.remove();
    }
    markers = [];
  };

  componentDidMount() {
    map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
    });

    // map.on('move', () => {
    //   this.setState({
    //     lng: map.getCenter().lng.toFixed(4),
    //     lat: map.getCenter().lat.toFixed(4),
    //     zoom: map.getZoom().toFixed(2),
    //   });
    // });

    // new mapboxgl.Marker({}).setLngLat([100.5604, 13.7329]).addTo(map);
    // new mapboxgl.Marker({}).setLngLat([100.5603, 13.7369]).addTo(map);

    directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      interactive: false,
      profile: 'mapbox/driving',
      controls: {
        inputs: false,
        instructions: false,
      },
    });

    map.on('load', () => {
      console.log('load1');
      this.setPosition(this.props.car);
    });
    map.addControl(directions, 'top-left');
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.car !== nextProps.car) {
      this.removeMarker();
      directions.removeRoutes();
      this.setPosition(nextProps.car);
      return true;
    }
    return false;
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
      </div>
    );
  }
}

export default MapService;
