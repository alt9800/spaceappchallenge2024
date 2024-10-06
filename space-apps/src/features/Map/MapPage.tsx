import React, { useState, useEffect, useRef } from "react";
import { Box, Drawer, Typography, Button, TextField } from "@mui/material";
import { Feature, Geometry, GeoJsonProperties } from "geojson";
import { styled } from "@mui/system";
import * as d3 from "d3";
import { PageComponent } from "../../components/common/Page";

interface PrefectureData {
  nameJa: string;
  content: string;
  image: string;
}

const MapContainer = styled(Box)({
  width: "100%",
  height: "100vh",
  position: "relative",
});

const MapPage: PageComponent = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [prefectureData, setPrefectureData] = useState<{
    [key: string]: PrefectureData;
  }>({});
  const [currentPrefecture, setCurrentPrefecture] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
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

      // Clear any existing content
      svg.selectAll("*").remove();

      const g = svg.append("g");

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
          g.attr("transform", event.transform.toString());
        });

      svg.call(zoom);

      d3.json<GeoJSON.FeatureCollection>(
        "https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson"
      )
        .then((data) => {
          if (data) {
            g.selectAll("path")
              .data(data.features)
              .enter()
              .append("path")
              .attr("d", path as any)
              .attr("fill", "#ccc")
              .attr("stroke", "#fff")
              .attr("stroke-width", "1")
              .on(
                "click",
                (
                  event: MouseEvent,
                  d: Feature<Geometry, GeoJsonProperties>
                ) => {
                  event.stopPropagation();
                  const prefectureName = d.properties?.nam_ja;
                  const prefectureNameEn = d.properties?.nam;
                  if (prefectureName && prefectureNameEn) {
                    focusOnPrefecture(d, path, svg, zoom);
                    showPrefectureInfo(prefectureName, prefectureNameEn);
                  }
                }
              )
              .on("mouseover", function (event, d) {
                d3.select(this)
                  .transition()
                  .duration(200)
                  .attr("fill", "#ff0000");
              })
              .on("mouseout", function (event, d) {
                d3.select(this).transition().duration(200).attr("fill", "#ccc");
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

  const focusOnPrefecture = (
    d: Feature<Geometry, GeoJsonProperties>,
    path: d3.GeoPath<any, d3.GeoPermissibleObjects>,
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    zoom: d3.ZoomBehavior<SVGSVGElement, unknown>
  ) => {
    const bounds = path.bounds(d);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / 800, dy / 600)));
    const translate = [400 - scale * x, 300 - scale * y];

    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
      );
  };

  const showPrefectureInfo = (
    _prefectureNameJa: string,
    prefectureNameEn: string
  ) => {
    setCurrentPrefecture(prefectureNameEn);
    setDrawerOpen(true);
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
    <MapContainer>
      <svg ref={svgRef} width="100%" height="100%"></svg>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6">
            {prefectureData[currentPrefecture]?.nameJa}
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: 200,
              backgroundImage: `url(${prefectureData[currentPrefecture]?.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              my: 2,
            }}
          />
          <Typography>{prefectureData[currentPrefecture]?.content}</Typography>
          <Button onClick={handleEditClick} sx={{ mt: 2 }}>
            編集
          </Button>
          <Button
            href={`./${currentPrefecture}/index.html`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mt: 1 }}
          >
            詳細ページへ
          </Button>
        </Box>
      </Drawer>

      {editModalVisible && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">編集</Typography>
          <form onSubmit={handleEditSubmit}>
            <TextField
              multiline
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button component="span" sx={{ mt: 2 }}>
                画像をアップロード
              </Button>
            </label>
            <Button type="submit" sx={{ mt: 2 }}>
              更新
            </Button>
          </form>
        </Box>
      )}
    </MapContainer>
  );
};

MapPage.path = "/map";
export default MapPage;
