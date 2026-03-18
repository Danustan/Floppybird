import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Component to handle map clicks
const MapClickHandler = ({ onLocationSelect }) => {
  const map = useMap();

  React.useEffect(() => {
    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, onLocationSelect]);

  return null;
};

const MapPicker = ({ location, onLocationSelect }) => {
  return (
    <div className="map-container">
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        📌 Click on the map to pin the violation location
      </p>
      <MapContainer 
        center={[location.lat, location.lng]} 
        zoom={13} 
        style={{ height: '350px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={[location.lat, location.lng]}>
          <Popup>
            Violation Location
            <br />
            Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
          </Popup>
        </Marker>
        <MapClickHandler onLocationSelect={onLocationSelect} />
      </MapContainer>
      <p style={{ fontSize: '12px', color: '#27ae60', marginTop: '10px' }}>
        ✅ Selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
      </p>
    </div>
  );
};

export default MapPicker;
