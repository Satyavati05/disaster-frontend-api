import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './GlobalRiskMonitor.css';
import { Menu, Bell, User, Search, Navigation2, Layers, Tornado, Droplets, Activity, Mountain, CloudRain, AlertTriangle, Info } from 'lucide-react';
import L from 'leaflet';

// Fix for default leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GlobalRiskMonitor = () => {
  const [layers, setLayers] = useState({
    cyclone: true,
    flood: false,
    seismic: false,
    landslide: false,
    rainfall: false,
  });

  const toggleLayer = (key) => setLayers(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="risk-monitor-container">
      {/* Background Map layer */}
      <div className="map-layer">
        <MapContainer center={[20, 80]} zoom={4} zoomControl={false} style={{ height: '100%', width: '100%' }}>
          {/* A soft themed map tile */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {/* Example hurricane marker */}
          {layers.cyclone && (
            <Marker position={[19.0760, 72.8777]}>
              <Popup>Cyclone Elysian</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Floating UI Container */}
      <div className="ui-overlay">
        
        {/* Top App Bar */}
        <header className="app-bar">
          <button className="icon-btn"><Menu size={24} /></button>
          <h2>Global Risk Monitor</h2>
          <div className="right-actions">
            <button className="icon-btn alert-badge"><Bell size={20} color="#fff"/></button>
            <button className="icon-btn avatar-btn"><User size={20} color="#e59866"/></button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="search-wrap">
          <div className="search-box">
            <Search size={20} className="search-icon-color" />
            <input type="text" placeholder="Search location or zone" />
          </div>
        </div>

        {/* Floating Map Controls on right */}
        <div className="map-controls">
          <div className="control-group">
            <button className="control-btn border-bottom">+</button>
            <button className="control-btn">-</button>
          </div>
          <div className="control-group mt-3">
            <button className="control-btn"><Navigation2 size={20} /></button>
          </div>
          <div className="control-group mt-3">
            <button className="control-btn"><Layers size={20} /></button>
          </div>
        </div>

        {/* Active Risk Layers Card */}
        <div className="risk-layers-card">
          <h4>ACTIVE RISK LAYERS</h4>
          <div className="layer-list">
            <div className={`layer-item ${layers.cyclone ? 'active' : ''}`} onClick={() => toggleLayer('cyclone')}>
              <div className="layer-info">
                <Tornado size={20} className="layer-icon text-orange" />
                <span>Cyclone Path</span>
              </div>
              <div className={`toggle-switch ${layers.cyclone ? 'on' : 'off'}`}>
                <div className="toggle-thumb" />
              </div>
            </div>

            <div className={`layer-item ${layers.flood ? 'active' : ''}`} onClick={() => toggleLayer('flood')}>
              <div className="layer-info">
                <Droplets size={20} className="layer-icon text-blue" />
                <span>Flood Zones</span>
              </div>
              <div className={`toggle-switch ${layers.flood ? 'on' : 'off'}`}>
                <div className="toggle-thumb" />
              </div>
            </div>

            <div className={`layer-item ${layers.seismic ? 'active' : ''}`} onClick={() => toggleLayer('seismic')}>
              <div className="layer-info">
                <Activity size={20} className="layer-icon text-red" />
                <span>Seismic Activity</span>
              </div>
              <div className={`toggle-switch ${layers.seismic ? 'on' : 'off'}`}>
                <div className="toggle-thumb" />
              </div>
            </div>

            <div className={`layer-item ${layers.landslide ? 'active' : ''}`} onClick={() => toggleLayer('landslide')}>
              <div className="layer-info">
                <Mountain size={20} className="layer-icon text-green" />
                <span>Landslide Risk</span>
              </div>
              <div className={`toggle-switch ${layers.landslide ? 'on' : 'off'}`}>
                <div className="toggle-thumb" />
              </div>
            </div>

            <div className={`layer-item ${layers.rainfall ? 'active' : ''}`} onClick={() => toggleLayer('rainfall')}>
              <div className="layer-info">
                <CloudRain size={20} className="layer-icon text-cyan" />
                <span>Rainfall Anomalies</span>
              </div>
              <div className={`toggle-switch ${layers.rainfall ? 'on' : 'off'}`}>
                <div className="toggle-thumb" />
              </div>
            </div>

          </div>
        </div>

        {/* Active Threat Card */}
        <div className="active-threat-card">
          <div className="threat-header">
            <div className="threat-title-wrap">
              <AlertTriangle size={20} color="#fff" />
              <span className="threat-title">Active Threat</span>
            </div>
            <span className="threat-category">CATEGORY 4</span>
          </div>
          <div className="threat-body">
            <h3>Cyclone 'Elysian'</h3>
            <p className="subtitle">Moving North-West at 22km/h</p>
            
            <div className="threat-stats">
              <div className="stat-box">
                <span className="stat-label">WIND SPEED</span>
                <span className="stat-val">185 km/h</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">PRESSURE</span>
                <span className="stat-val">945 hPa</span>
              </div>
            </div>

            <button className="btn-detailed-report">
              <Info size={16} /> View Detailed Report
            </button>
          </div>
        </div>

        {/* Environmental Controls Peek */}
        <div className="bottom-sheet-peek">
          <div className="drag-handle" />
          <h3>Environmental Controls</h3>
          <p>Adjust visibility and transparency of environmental data layers.</p>
        </div>

      </div>
    </div>
  );
};

export default GlobalRiskMonitor;
