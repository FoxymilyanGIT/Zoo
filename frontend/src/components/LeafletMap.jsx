import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemo } from "react";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41]
});

export const LeafletMap = ({ animals }) => {
  const positions = useMemo(
    () =>
      animals.slice(0, 5).map((animal, index) => ({
        ...animal,
        position: [55.75 + index * 0.005, 37.6 + index * 0.008]
      })),
    [animals]
  );

  return (
    <MapContainer
      center={[55.751244, 37.618423]}
      zoom={13}
      scrollWheelZoom={false}
      className="h-80 w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {positions.map((animal) => (
        <Marker key={animal.id} position={animal.position} icon={defaultIcon}>
          <Popup>
            <strong>{animal.name}</strong>
            <p className="text-sm">{animal.zone}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};



