import React, { useState, useEffect, useRef } from "react";
import { Box, Modal, Typography, Button, TextField } from "@mui/material";
import { styled } from "@mui/system";
import * as d3 from "d3";
import { Feature, Geometry } from "geojson";
import { PageComponent } from "../../components/common/Page";

const MapContainer = styled(Box)({
  width: "100%",
  maxWidth: 800,
  margin: "0 auto",
});

const ImageContainer = styled(Box)({
  width: "100%",
  height: 200,
  backgroundSize: "cover",
  backgroundPosition: "center",
  marginBottom: 10,
  animation: "changeImage 9s infinite",
});

interface PrefectureData {
  [key: string]: {
    nameJa: string;
    content: string;
    image: string;
  };
}

interface MapFeature extends Feature<Geometry> {
  properties: {
    nam: string;
    nam_ja: string;
  };
}

const MapPage: PageComponent = () => {
  const [mapData, setMapData] = useState<MapFeature[] | null>(null);
  const [prefectureData, setPrefectureData] = useState<PrefectureData>({});
  const [currentPrefecture, setCurrentPrefecture] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const mapRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson"
      );
      const data = await response.json();
      setMapData(data.features);
      initializePrefectureData(data.features);
    } catch (error) {
      console.error("Error fetching map data:", error);
    }
  };

  const initializePrefectureData = (features: MapFeature[]) => {
    const data: PrefectureData = {};
    features.forEach((feature) => {
      const name = feature.properties.nam;
      const nameJa = feature.properties.nam_ja;
      data[name] = {
        nameJa: nameJa,
        content: `${nameJa}の気象概況がここに表示されます。（200文字以内）`,
        image: `https://picsum.photos/800?random=${Math.random()}`,
      };
    });
    setPrefectureData(data);
  };

  const showPrefectureInfo = (
    prefectureNameJa: string,
    prefectureNameEn: string
  ) => {
    setCurrentPrefecture(prefectureNameEn);
    setImageUrls([
      "https://picsum.photos/800?random=1",
      "https://picsum.photos/800?random=2",
      "https://picsum.photos/800?random=3",
    ]);
    setModalOpen(true);
  };

  const handleEdit = () => {
    setEditContent(prefectureData[currentPrefecture]?.content || "");
    setEditModalOpen(true);
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
    setEditModalOpen(false);
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
          setImageUrls([result]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (mapData && mapRef.current) {
      const width = 800;
      const height = 600;
      const svg = d3
        .select(mapRef.current)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      const projection = d3
        .geoMercator()
        .center([137, 35])
        .scale(1000)
        .translate([width / 2, height / 2]);

      const path = d3.geoPath().projection(projection);

      svg
        .selectAll("path")
        .data(mapData)
        .enter()
        .append("path")
        .attr("d", path as any)
        .attr("fill", (d) =>
          d.properties.nam === "Hokkai Do" ? "#ff0000" : "#ccc"
        )
        .attr("class", (d) =>
          d.properties.nam === "Hokkai Do" ? "hokkaido" : ""
        )
        .attr("stroke", "#fff")
        .on("click", (event, d: MapFeature) => {
          showPrefectureInfo(d.properties.nam_ja, d.properties.nam);
        });
    }
  }, [mapData]);

  return (
    <MapContainer>
      <svg ref={mapRef} width="100%" height="auto" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
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
          <Typography variant="h6" component="h2">
            {prefectureData[currentPrefecture]?.nameJa}
          </Typography>
          <ImageContainer style={{ backgroundImage: `url(${imageUrls[0]})` }} />
          <Typography sx={{ mt: 2 }}>
            {prefectureData[currentPrefecture]?.content}
          </Typography>
          <Button onClick={handleEdit}>編集</Button>
          <Button href={`./${currentPrefecture}/index.html`} target="_blank">
            詳細ページへ
          </Button>
        </Box>
      </Modal>

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
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
          <Typography variant="h6" component="h2">
            編集
          </Typography>
          <form onSubmit={handleEditSubmit}>
            <TextField
              multiline
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              type="file"
              onChange={handleImageUpload}
              inputProps={{ accept: "image/*" }}
              fullWidth
              margin="normal"
            />
            <Button type="submit">更新</Button>
          </form>
        </Box>
      </Modal>
    </MapContainer>
  );
};
MapPage.path = "/map";
export default MapPage;
