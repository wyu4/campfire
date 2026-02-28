const earthRadius = 6371e6;
const degreesToRadians = Math.PI / 180.0;

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
