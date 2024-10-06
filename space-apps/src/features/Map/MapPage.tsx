import React, { useState, useEffect, useRef } from "react";
import { Box, Modal, Typography, Button, TextField } from "@mui/material";
import { Feature, Geometry, GeoJsonProperties } from "geojson";
import { styled } from "@mui/system";
import * as d3 from "d3";
import { PageComponent } from "../../components/common/Page";
interface PrefectureData {
  nameJa: string;
  content: string;
  image: string;
}

const MapPage: PageComponent = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [prefectureData, setPrefectureData] = useState<{
    [key: string]: PrefectureData;
  }>({});
  const [currentPrefecture, setCurrentPrefecture] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>("");

  useEffect(() => {
    if (svgRef.current) {
      const width = 800;
      const height = 600;
      const svg = d3
        .select(svgRef.current)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      const projection = d3
        .geoMercator()
        .center([137, 35])
        .scale(1000)
        .translate([width / 2, height / 2]);

      const path = d3.geoPath().projection(projection);

      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 8])
        .on("zoom", (event) => {
          svg.selectAll("path").attr("transform", event.transform.toString());
        });

      svg.call(zoom);

      d3.json<GeoJSON.FeatureCollection>(
        "https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson"
      )
        .then((data) => {
          if (data) {
            svg
              .selectAll("path")
              .data(data.features)
              .enter()
              .append("path")
              .attr("d", path as any)
              .attr("fill", "#ccc")  // すべての都道府県を同じ色で初期化
              .attr("stroke", "#fff")
              .attr("stroke-width", "1")
              .on(
                "click",
                (
                  event: MouseEvent,
                  d: Feature<Geometry, GeoJsonProperties>
                ) => {
                  const prefectureName = d.properties?.nam_ja;
                  const prefectureNameEn = d.properties?.nam;
                  if (prefectureName && prefectureNameEn) {
                    showPrefectureInfo(prefectureName, prefectureNameEn);
                  }
                }
              )
              .on("mouseover", function(event, d) {
                d3.select(this).transition()
                  .duration(200)
                  .attr("fill", "#ff0000");
              })
              .on("mouseout", function(event, d) {
                d3.select(this).transition()
                  .duration(200)
                  .attr("fill", "#ccc");  // すべての都道府県が同じ色に戻る
              });

            // Initialize prefecture data
            const initialPrefectureData: { [key: string]: PrefectureData } = {};
            data.features.forEach(
              (feature: Feature<Geometry, GeoJsonProperties>) => {
                const name = feature.properties?.nam;
                const nameJa = feature.properties?.nam_ja;
                if (name && nameJa) {
                  initialPrefectureData[name] = {
                    nameJa: nameJa,
                    content: `${nameJa}の気象概況がここに表示されます。（200文字以内）`,
                    image: `https://picsum.photos/800?random=${Math.random()}`,
                  };
                }
              }
            );
            setPrefectureData(initialPrefectureData);
          }
        })
        .catch((error) => {
          console.error("データの読み込み中にエラーが発生しました:", error);
        });
    }
  }, []);

  const showPrefectureInfo = (
    _prefectureNameJa: string,
    prefectureNameEn: string
  ) => {
    setCurrentPrefecture(prefectureNameEn);
    setModalVisible(true);
  };

  const handleEditClick = () => {
    setEditContent(prefectureData[currentPrefecture]?.content || "");
    setEditModalVisible(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPrefectureData((prev) => ({
      ...prev,
      [currentPrefecture]: {
        ...prev[currentPrefecture],
        content: editContent,
      },
    }));
    setEditModalVisible(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setPrefectureData((prev) => ({
            ...prev,
            [currentPrefecture]: {
              ...prev[currentPrefecture],
              image: result,
            },
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <svg ref={svgRef} width="100%" height="100vh"></svg>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalVisible(false)}>
              &times;
            </span>
            <h2>{prefectureData[currentPrefecture]?.nameJa}</h2>
            <div
              style={{
                width: "100%",
                height: "200px",
                backgroundImage: `url(${prefectureData[currentPrefecture]?.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                marginBottom: "10px",
              }}
            ></div>
            <p>{prefectureData[currentPrefecture]?.content}</p>
            <button onClick={handleEditClick}>編集</button>
            <a
              href={`./${currentPrefecture}/index.html`}
              target="_blank"
              rel="noopener noreferrer"
            >
              詳細ページへ
            </a>
          </div>
        </div>
      )}

      {editModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setEditModalVisible(false)}>
              &times;
            </span>
            <h2>編集</h2>
            <form onSubmit={handleEditSubmit}>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={{ width: "100%", height: "100px" }}
              ></textarea>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <button type="submit">更新</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
MapPage.path = "/map";
export default MapPage;
