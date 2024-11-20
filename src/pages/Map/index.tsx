/**
 * @since 2024-08-06 11:12:19
 * @author GW00270177
 * @description 模块管理
 * Copyright (c) 2024 GWM.Co.Ltd. All rights reserved.
 */
import { useRecoilState } from "recoil";
import useStyles from "./index.styles";
import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import { fromLonLat } from "ol/proj";
import XYZ from "ol/source/XYZ";

const MapPage = (props: any, ref: any) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new Map({
      target: mapRef.current!,
      layers: [
        // new TileLayer({
        //   source: new OSM(),
        // }),
        new TileLayer({
          source: new XYZ({
            url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
            maxZoom: 18,
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([116.4074, 39.9042]), // 更改为适当的坐标
        zoom: 10,
      }),
    });

    map.getView().on("change:center", () => {
      const [lon, lat] = fromLonLat(map.getView().getCenter()!).map(
        (coord) => coord
      );

      if (lon >= 73.66 && lon <= 135.05 && lat >= 3.86 && lat <= 53.55) {
        // 如果在中国区域，使用高德地图
        (map.getLayers().item(0) as any).setSource(
          new XYZ({
            url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
            maxZoom: 18,
          })
        );
      } else {
        // 否则使用谷歌地图
        (map.getLayers().item(0) as any).setSource(
          new XYZ({
            url: "http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0",
            maxZoom: 20,
          })
        );
      }
    });

    return () => map.setTarget(undefined); // 组件卸载时清理
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default MapPage;
