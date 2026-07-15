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
/**
 * A reusable Leaflet map: pins for whatever markers the caller passes, with
 * pan/zoom/scroll. Purely presentational — geocoding, GPS extraction, and any
 * other data work happen in the consuming app; this only draws.
 */
export declare function MapView({ markers, center, zoom, fitToMarkers, tileUrl, attribution, className, }: MapViewProps): import("react").JSX.Element;
