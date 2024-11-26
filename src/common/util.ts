type Point = {
  latitude: number;
  longitude: number;
};

type DbscanReturn = {
  clusters: Point[][] | [];
  noise: Point[];
};

class Util {
  constructor() {}

  /**
   * @since 2024-11-26 13:06:56
   * @author GW00270177
   * @description 聚类函数
   * @param {Point[]} points 坐标数组
   * @param {number}  eps    半径
   * @param {number}  minPts 最小点数
   * @return {DbscanReturn}
   */
  dbscan(points: Point[], eps: number, minPts: number): DbscanReturn {
    const clusters: Point[][] = [];
    const visited = new Set();
    const noise: any[] = [];

    const getNeighbors = (point: any) => {
      const neighbors: any[] = [];
      points.forEach((p: any, index: number) => {
        const distance = Math.sqrt(
          Math.pow(p.latitude - point.latitude, 2) +
            Math.pow(p.longitude - point.longitude, 2)
        );
        if (distance <= eps) {
          neighbors.push(index);
        }
      });
      return neighbors;
    };

    points.forEach((point: any, index: number) => {
      if (visited.has(index)) return;

      visited.add(index);
      const neighbors = getNeighbors(point);

      if (neighbors.length < minPts) {
        noise.push(point); // 标记为噪声
        return;
      }

      const cluster: Point[] = [];
      clusters.push(cluster);
      cluster.push(point);

      neighbors.forEach((neighborIndex) => {
        if (!visited.has(neighborIndex)) {
          visited.add(neighborIndex);
          const neighborPoint = points[neighborIndex];
          const neighborNeighbors = getNeighbors(neighborPoint);

          if (neighborNeighbors.length >= minPts) {
            neighbors.push(...neighborNeighbors); // 扩展邻域
          }
        }

        if (!cluster.includes(points[neighborIndex])) {
          cluster.push(points[neighborIndex]);
        }
      });
    });

    return { clusters, noise };
  }

  /**
   * @since 2024-11-26 13:25:30
   * @author GW00270177
   * @description 两坐标间距
   * @param {Point} coord1 坐标1
   * @param {Point} coord2 坐标2
   * @return {number}
   */
  haversineDistance(coord1: Point, coord2: Point): number {
    const toRad = (value: any) => (value * Math.PI) / 180;

    const lat1 = toRad(coord1.latitude);
    const lon1 = toRad(coord1.longitude);
    const lat2 = toRad(coord2.latitude);
    const lon2 = toRad(coord2.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(a));

    const R = 6371; // 地球半径，单位为公里
    return R * c; // 返回距离，单位为公里
  }

  //
  /**
   * @since 2024-11-26 13:26:46
   * @author GW00270177
   * @description 多个坐标中心点
   * @param {Point[]} coordinates 坐标数组
   * @return {}
   */
  calculateCentroid(coordinates: Point[]): Point | null {
    if (coordinates.length === 0) {
      return null; // 如果没有坐标，返回 null
    }

    let totalLat = 0;
    let totalLon = 0;

    coordinates.forEach((coord) => {
      totalLat += coord.latitude;
      totalLon += coord.longitude;
    });

    const centroid = {
      latitude: totalLat / coordinates.length,
      longitude: totalLon / coordinates.length,
    };

    return centroid;
  }
}

export default new Util();
