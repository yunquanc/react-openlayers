/**
 * @since 2024-08-06 11:12:19
 * @author GW00270177
 * @description 模块管理
 * Copyright (c) 2024 GWM.Co.Ltd. All rights reserved.
 */
import { useRecoilState } from "recoil";
import useStyles from "./index.styles";
import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import { fromLonLat } from "ol/proj";
import XYZ from "ol/source/XYZ";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Icon } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import HeatmapLayer from "ol/layer/Heatmap";
import Overlay from "ol/Overlay";

const MapPage = (props: any, ref: any) => {
  const mapRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  useEffect(() => {
    // ==================== 标记资源 =====================
    const vectorSource = new VectorSource();

    // ==================== 热力图资源 =====================
    const HeatmapLayerSource = new VectorSource();

    // 创建热力图图层
    const heatmapLayer = new HeatmapLayer({
      source: HeatmapLayerSource,
      // 设置热力图的样式
      blur: 15,
      radius: 10,
      gradient: [
        "rgba(0, 255, 255, 0)", // 透明
        "rgba(0, 255, 255, 1)", // 蓝色
        "rgba(0, 0, 255, 1)", // 深蓝
        "rgba(0, 0, 128, 1)", // 深蓝色
        "rgba(255, 0, 0, 1)", // 红色
        "rgba(255, 255, 0, 1)", // 黄色
      ],
    });

    const map = new Map({
      target: mapRef.current!,
      layers: [
        // new TileLayer({
        //   source: new OSM(),
        // }),
        new TileLayer({
          source: new XYZ({
            // url为地图瓦片
            // url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
            url: "https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
            maxZoom: 18,
          }),
        }),
        // 创建向量图层并关联向量源
        new VectorLayer({
          source: vectorSource, // 将向量源添加到图层
        }),
        heatmapLayer,
      ],
      view: new View({
        center: fromLonLat([116.4074, 39.9042]), // 更改为适当的坐标
        zoom: 10,
      }),
    });

    const popupElement = document.createElement("div");
    popupElement.className = "ol-popup";
    const popupOverlay = new Overlay({
      element: popupElement,
      autoPan: true,
    });
    map.addOverlay(popupOverlay);

    // ==================== 添加标记 =====================
    const addMarker = (longitude: any, latitude: any, name: any) => {
      const marker: any = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
        name: name,
      });
      marker.setStyle(
        new Style({
          image: new Icon({
            src: "https://openlayers.org/en/latest/examples/data/icon.png", // 图标路径
            scale: 0.8,
          }),
        })
      );

      vectorSource.addFeature(marker);
    };

    addMarker(115.4074, 39.9042, "北京"); // 北京

    // 监听地图点击事件，关闭信息窗体
    map.on("singleclick", (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => {
        return feature;
      });

      if (feature) {
        // 如果点击的是标记，显示信息窗体
        popupElement.innerHTML = `<div style="background: red;width: 100px;height: 50px;display: flex;justify-content: center;align-items: center;">${feature.get(
          "name"
        )}</div>`;
        popupOverlay.setPosition(event.coordinate);
        popupElement.style.display = "block";
      } else {
        // 点击其他地方，关闭信息窗体
        popupOverlay.setPosition(undefined);
        popupElement.style.display = "none";
      }
    });

    // ==================== 添加坐标 =====================
    const addDataPoint = (longitude: any, latitude: any, weight: any) => {
      const point = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
        weight: weight, // 权重用于热力图
      });
      HeatmapLayerSource.addFeature(point);
    };

    // 添加数据点
    addDataPoint(116.4074, 40.0042, 1); // 北京
    addDataPoint(116.5174, 39.9142, 2); // 北京
    addDataPoint(116.6274, 39.9242, 3); // 北京
    addDataPoint(116.7374, 39.9342, 4); // 北京
    addDataPoint(116.8474, 39.9442, 5); // 北京
    addDataPoint(116.9574, 39.9542, 6); // 北京
    addDataPoint(121.4737, 31.2304, 2); // 上海
    addDataPoint(113.2644, 23.1291, 3); // 广州
    addDataPoint(104.0665, 30.6595, 4); // 成都
    addDataPoint(102.5528, 24.1139, 5); // 昆明

    return () => map.setTarget(undefined); // 组件卸载时清理
  }, []);

  return (
    <>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h4>图例</h4>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="https://openlayers.org/en/latest/examples/data/icon.png"
            alt="Marker"
            style={{ width: "20px", height: "20px", marginRight: "5px" }}
          />
          <span>标记</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="https://openlayers.org/en/latest/examples/data/icon.png"
            alt="Marker"
            style={{ width: "20px", height: "20px", marginRight: "5px" }}
          />
          <span>北京</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="https://openlayers.org/en/latest/examples/data/icon.png"
            alt="Marker"
            style={{ width: "20px", height: "20px", marginRight: "5px" }}
          />
          <span>上海</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="https://openlayers.org/en/latest/examples/data/icon.png"
            alt="Marker"
            style={{ width: "20px", height: "20px", marginRight: "5px" }}
          />
          <span>广州</span>
        </div>
      </div>
    </>
  );
};

export default MapPage;
