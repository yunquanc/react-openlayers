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
import { Style, Icon, Stroke, Circle, Fill } from "ol/style";
import RCircle from "ol/geom/Circle";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import HeatmapLayer from "ol/layer/Heatmap";
import Overlay from "ol/Overlay";
import { LineString } from "ol/geom";
import { log } from "node_modules/geotiff/dist-module/logging";
import Util from "@/common/util";

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
            // url为地图瓦片
            // url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
            url: "https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
            maxZoom: 18,
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([116.4074, 39.9042]), // 更改为适当的坐标
        zoom: 10,
      }),
    });

    // ==================== 说明 =====================
    /**
     * 1:添加资源类型 new VectorSource()
     * 2:添加图层资源 new VectorLayer()
     *   图层资源source为第一步创建的对象
     * 3:添加new Feature，将创建的Feature push进第一步资源内
     * 4:添加图层 map.addLayer 将第二部的图层资源加载进地图实例
     */

    // ==================== 浮动图层 =====================
    const popupElement = document.createElement("div");
    popupElement.className = "ol-popup";
    const popupOverlay = new Overlay({
      element: popupElement,
      // autoPan: true,
    });
    map.addOverlay(popupOverlay);
    // 监听地图点击事件，关闭信息窗体
    map.on("singleclick", (event: any) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => {
        return feature;
      });
      const tag = feature?.get("opt");
      if (feature && tag?.type === "tag") {
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

    // ==================== 添加标记 =====================
    const vectorSource = new VectorSource();
    const MarkerLayer = new VectorLayer({
      source: vectorSource, // 将向量源添加到图层
    });
    const addMarker = (longitude: any, latitude: any, name: any) => {
      const marker: any = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
        name: name,
        // 标记添加额外参数
        opt: { type: "tag" },
      });
      marker.setStyle(
        new Style({
          // image: new Icon({
          //   src: "https://openlayers.org/en/latest/examples/data/icon.png", // 图标路径
          //   scale: 0.8,
          // }),
          image: new Circle({
            radius: 5, // 圆的半径
            fill: new Fill({ color: "red" }), // 填充颜色
            // stroke: new Stroke({ color: "black", width: 2 }),
          }),
        })
      );
      vectorSource.addFeature(marker);
    };
    addMarker(116.4074, 39.8842, "北京"); // 北京
    map.addLayer(MarkerLayer);

    // ==================== 热力图资源 =====================
    const HeatmapLayerSource = new VectorSource();
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
    // 添加热力点
    const addDataPoint = (longitude: any, latitude: any, weight: any) => {
      const point = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
        weight: weight, // 权重用于热力图
        name: "123123123",
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
    map.addLayer(heatmapLayer);

    // ==================== 添加线段 =====================
    // 创建矢量源并添加线段特征
    const vectorLineSource = new VectorSource();
    // 创建矢量图层并添加到地图
    const vectorLineLayer = new VectorLayer({
      source: vectorLineSource,
    });
    const setLineLayer = (pointA: number[], pointB: number[]) => {
      // 创建线段
      const lineString = new LineString([
        fromLonLat(pointA),
        fromLonLat(pointB),
      ]);
      // 创建线段特征
      const lineFeature = new Feature({
        geometry: lineString,
      });
      // 设置线段样式
      const lineStyle = new Style({
        stroke: new Stroke({
          color: "blue",
          width: 3,
        }),
      });
      lineFeature.setStyle(lineStyle);

      vectorLineSource.addFeature(lineFeature);
    };
    setLineLayer([116.4074, 40.0042], [116.5174, 39.9142]);
    setLineLayer([116.5174, 39.9142], [116.6274, 39.9242]);
    setLineLayer([116.6274, 39.9242], [116.7374, 39.9342]);
    setLineLayer([116.7374, 39.9342], [116.8474, 39.9442]);
    setLineLayer([116.8474, 39.9442], [116.9574, 39.9542]);
    map.addLayer(vectorLineLayer);

    // ==================== 分组 =====================
    const vectorRoundSource = new VectorSource();
    const vectorRoundLayer = new VectorLayer({
      source: vectorRoundSource,
    });
    const points = [
      {
        latitude: 39.9242,
        longitude: 116.8274,
      },
      {
        latitude: 39.9442,
        longitude: 116.8474,
      },
      {
        latitude: 39.9452,
        longitude: 116.8484,
      },
      {
        latitude: 39.9392,
        longitude: 116.8484,
      },
      {
        latitude: 39.9392,
        longitude: 116.8374,
      },
      {
        latitude: 39.9382,
        longitude: 116.8384,
      },
      {
        latitude: 39.9322,
        longitude: 116.8324,
      },
      {
        latitude: 39.9362,
        longitude: 116.8364,
      },
      {
        latitude: 39.9352,
        longitude: 116.8384,
      },
      {
        latitude: 39.9342,
        longitude: 116.7374,
      },
      {
        latitude: 39.9352,
        longitude: 116.7384,
      },
      {
        latitude: 39.6352,
        longitude: 116.5384,
      },
      {
        latitude: 39.6152,
        longitude: 116.5184,
      },
    ];
    for (let i = 0; i < points.length; i++) {
      addMarker(points[i].longitude, points[i].latitude, "北京");
    }
    // 绘制聚类圈
    const setRoundMarker = (x: any, y: any) => {
      const circleFeature = new Feature({
        geometry: new RCircle(fromLonLat([x, y]), 1 * 1000),
      });
      circleFeature.setStyle(
        new Style({
          renderer(coordinates, state) {
            const [[x, y], [x1, y1]]: any = coordinates;
            const ctx = state.context;
            const dx = x1 - x;
            const dy = y1 - y;
            const radius = Math.sqrt(dx * dx + dy * dy);

            const innerRadius = 0;
            const outerRadius = radius * 1.4;

            const gradient = ctx.createRadialGradient(
              x,
              y,
              innerRadius,
              x,
              y,
              outerRadius
            );
            gradient.addColorStop(0, "rgba(255,0,0,0)");
            gradient.addColorStop(0.6, "rgba(255,0,0,0.2)");
            gradient.addColorStop(1, "rgba(255,0,0,0.8)");
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
            ctx.strokeStyle = "rgba(255,0,0,1)";
            ctx.stroke();
          },
        })
      );

      vectorRoundSource.addFeature(circleFeature);
    };
    const dbscanResult = Util.dbscan(points, 0.01, 3);
    dbscanResult.clusters.map((e: any) => {
      const obj: any = Util.calculateCentroid(e);
      setRoundMarker(obj.longitude, obj.latitude);
    });
    map.addLayer(vectorRoundLayer);

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
