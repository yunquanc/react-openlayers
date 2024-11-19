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

const MapPage = (props: any, ref: any) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new Map({
      target: mapRef.current!,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0], // 更改为适当的坐标
        zoom: 2,
      }),
    });

    return () => map.setTarget(undefined); // 组件卸载时清理
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default MapPage;
