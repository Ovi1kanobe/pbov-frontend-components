import { useEffect } from "react";
import { divIcon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { cn } from "../../lib/utils";

export interface MapMarker {
  lat: number;
  lng: number;
  /** Short text under the pin, shown in the popup title. */
  label?: string;
  /** Extra popup body under the label. */
  description?: string;
}

export interface MapViewProps {
  markers: MapMarker[];
  /** Fallback center when there are no markers. Default: middle of Florida's Treasure Coast. */
  center?: [number, number];
  /** Initial zoom. Default 13, or 7 when there are no markers. */
  zoom?: number;
  /** Pan/zoom to contain all markers whenever they change. Default true. */
  fitToMarkers?: boolean;
  /**
   * Tile server URL template. Defaults to the public OpenStreetMap raster
   * tiles — swap in a self-hosted tile URL if the deployment can't reach OSM.
   */
  tileUrl?: string;
  /** Attribution line for the tile source. Keep OSM's when using their tiles. */
  attribution?: string;
  className?: string;
}

const DEFAULT_CENTER: [number, number] = [27.35, -80.4];
const DEFAULT_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const DEFAULT_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// A CSS-drawn pin instead of Leaflet's default marker images — bundlers mangle
// the image paths and shipping pngs through the package isn't worth it.
const pinIcon = divIcon({
  className: "",
  html: '<div style="width:18px;height:18px;border-radius:50% 50% 50% 0;background:#dc2626;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);transform:rotate(-45deg);margin:-14px 0 0 -9px"></div>',
  iconSize: [0, 0],
});

// FitBounds lives inside MapContainer so it can grab the map instance and
// re-fit whenever the marker set changes.
function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap();
  useEffect(() => {
    const only = markers.length === 1 ? markers[0] : undefined;
    if (markers.length === 0) return;
    if (only) {
      map.setView([only.lat, only.lng], Math.max(map.getZoom(), 14));
      return;
    }
    map.fitBounds(
      markers.map((m) => [m.lat, m.lng] as [number, number]),
      { padding: [30, 30] },
    );
  }, [map, markers]);
  return null;
}

/**
 * A reusable Leaflet map: pins for whatever markers the caller passes, with
 * pan/zoom/scroll. Purely presentational — geocoding, GPS extraction, and any
 * other data work happen in the consuming app; this only draws.
 */
export function MapView({
  markers,
  center = DEFAULT_CENTER,
  zoom,
  fitToMarkers = true,
  tileUrl = DEFAULT_TILES,
  attribution = DEFAULT_ATTRIBUTION,
  className,
}: MapViewProps) {
  const first = markers[0];
  const initialCenter: [number, number] = first ? [first.lat, first.lng] : center;
  const initialZoom = zoom ?? (markers.length > 0 ? 14 : 7);

  return (
    <MapContainer
      center={initialCenter}
      zoom={initialZoom}
      scrollWheelZoom
      className={cn("h-full min-h-64 w-full rounded-lg border-2", className)}
    >
      <TileLayer url={tileUrl} attribution={attribution} />
      {fitToMarkers && <FitBounds markers={markers} />}
      {markers.map((m, i) => (
        <Marker key={`${m.lat},${m.lng},${i}`} position={[m.lat, m.lng]} icon={pinIcon}>
          {(m.label || m.description) && (
            <Popup>
              {m.label && <span className="font-medium">{m.label}</span>}
              {m.label && m.description && <br />}
              {m.description}
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
}
