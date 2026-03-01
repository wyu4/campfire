import type { LatLngBoundsExpression } from "leaflet";

const earthRadius = 6371; // In KILOMETERS
const degreesToRadians = Math.PI / 180.0;

export const midpoint = (latlng1: number[], latlng2: number[]) => {
    const lat1 = latlng1[0];
    const lon1 = latlng1[1];
    const lat2 = latlng2[0];
    const lon2 = latlng2[1];

    return [(lat1 + lat2) / 2, (lon1 + lon2) / 2];
};

export function haversineDistance(point1: number[], point2: number[]) {
    const asin = Math.asin;
    const cos = Math.cos;
    const sin2 = (n: number) => Math.pow(Math.sin(n), 2);

    const lat1 = point1[0] * degreesToRadians;
    const lng1 = point1[1] * degreesToRadians;
    const lat2 = point2[0] * degreesToRadians;
    const lng2 = point2[1] * degreesToRadians;
    const theta =
        sin2((lat2 - lat1) / 2) +
        cos(lat1) * cos(lat2) * sin2((lng2 - lng1) / 2);
    return 2 * earthRadius * asin(Math.sqrt(theta));
}

export const WorldBounds: LatLngBoundsExpression = [
    [-90, -180],
    [90, 180],
];

export const OttawaBounds: LatLngBoundsExpression = [
    [45, -76.6],
    [45.5, -75.3],
];
