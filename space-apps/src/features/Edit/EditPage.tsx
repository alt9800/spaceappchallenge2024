import { Box, Button, Card, CardMedia, TextField, Typography } from "@mui/material";
import { PageComponent } from "../../components/common/Page";
import { ChangeEvent, useRef, useState } from "react";
import { Add } from "@mui/icons-material";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from "../../config/firebase";
import { addDoc, collection } from "firebase/firestore";


const EditPage: PageComponent = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [explanation, setExplanation] = useState('');
  const [nickname, setNickname] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);
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

  const handleSubmit = async () => {
    if (!imageFile) {
      alert('画像を選択してください');
      return;
    }

    try {
      // 画像をStorageにアップロード
      const storageRef = ref(storage, `images/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      // Firestoreにデータを保存
      await addDoc(collection(db, 'timeline'), {
        image_path: imageUrl,
        explanatory: explanation,
        writer_name: nickname,
        create_at: new Date(),
        update_at: new Date(),
      });

      alert('データが正常に登録されました');
      // フォームをリセット
      setImagePreview(null);
      setImageFile(null);
      setExplanation('');
      setNickname('');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('エラーが発生しました。もう一度お試しください。');
    }
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
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="body1">
              ニックネーム
            </Typography>
            <TextField
              sx={{ width: "150px" }}
              inputProps={{ style: { height: "30px", padding: "0px" } }}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </Box>
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={handleSubmit}
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