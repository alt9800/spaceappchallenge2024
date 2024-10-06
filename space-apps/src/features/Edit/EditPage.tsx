import React, { ChangeEvent, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Add } from "@mui/icons-material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../config/firebase";
import { addDoc, collection } from "firebase/firestore";

interface EditPageProps {
  prefecture: string;
  prefecture_name: string;
  onClose: () => void; // モーダルを閉じる関数
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditPage: React.FC<EditPageProps> = ({
  prefecture,
  prefecture_name,
  onClose,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [explanation, setExplanation] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
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
      setSnackbar({
        open: true,
        message: "画像を選択してください",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const storageRef = ref(storage, `images/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "timeline"), {
        image_path: imageUrl,
        explanatory: explanation,
        writer_name: nickname,
        prefectures: prefecture,
        create_at: new Date(),
        update_at: new Date(),
      });

      setSnackbar({
        open: true,
        message: "データが正常に登録されました",
        severity: "success",
      });
      setTimeout(() => {
        onClose(); // モーダルを閉じる
      }, 1000); // スナックバーが表示されてから1秒後にモーダルを閉じる
    } catch (error) {
      console.error("Error adding document: ", error);
      setSnackbar({
        open: true,
        message: "エラーが発生しました。もう一度お試しください。",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      display="flex"
      flexGrow={1}
      flexDirection="column"
      justifyContent="center"
      alignItems="flex-start"
      gap={1}
      p={3}
    >
      <Typography variant="h6">編集 - {prefecture_name}</Typography>

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
          <Add sx={{ fontSize: 60, color: "grey.400" }} />
        )}
      </Box>
      <Typography variant="body1">説明文を入れてください</Typography>
      <TextField
        multiline
        rows={6}
        inputProps={{ maxLength: 200 }}
        fullWidth
        placeholder="説明文を入力してください（200文字以内）"
        value={explanation}
        onChange={(e) => setExplanation(e.target.value)}
      />
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body1">ニックネーム</Typography>
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
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "データ登録"
          )}
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditPage;
