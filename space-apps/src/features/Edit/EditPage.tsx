import { Box, Button, Card, CardMedia, TextField, Typography } from "@mui/material";
import { PageComponent } from "../../components/common/Page";
import { ChangeEvent, useRef, useState } from "react";
import { Add } from "@mui/icons-material";

const EditPage: PageComponent = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box
      height={"100vh"}
      width={"100vw"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Card
        sx={{
          width: "400px",
          padding: 2,
          margin: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 1,
        }}
      >
        <Typography variant="h6">編集</Typography>

        <Box
          sx={{
            width: "100%",
            height: 200,
            position: "relative",
            backgroundColor: "grey.200",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={handleBoxClick}
        >
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
          />
          {imagePreview ? (
            <CardMedia
              component="img"
              height="200"
              image={imagePreview}
              alt="uploaded image"
              sx={{ width: "100%" }}
            />
          ) : (

            <Add sx={{ fontSize: 60, color: 'grey.400' }} />
          )}
        </Box>
        <Typography variant="body1">
          説明文を入れてください
        </Typography>
        <TextField
          multiline
          rows={6}
          inputProps={{ maxLength: 200 }}
          fullWidth
          placeholder="説明文を入力してください（200文字以内）"
        />
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="contained"
            component="label"
            color="inherit"
            size="small"
          >
            CSVアップロード
            <input type="file" hidden accept=".csv" onChange={handleFileChange} />
          </Button>
          <Typography variant="body2" sx={{ ml: 2 }}>
            {selectedFile ? selectedFile.name : '選択されていません'}
          </Typography>

          <Button
            sx={{ ml: 2 }}
            variant="contained"
            color="inherit"
            size="small"
            onClick={() => { }}
          >
            データ登録
          </Button>
        </Box>
      </Card>
    </Box>
  );
}

EditPage.path = "/edit";
export default EditPage;