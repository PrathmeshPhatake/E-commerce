import { UploadFile } from "./UploadFile";
import { TextField, Button, CircularProgress } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { useState } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
  imageUrl,
  setImageUrl,
}) => {
  const [uploading, setUploading] = useState(false);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await UploadFile(file);
      toast.success("Image uploaded successfully", {
        className: "bg-[#3A3632] text-[#F3EEEA]",
        progressClassName: "bg-[#8C7D6D]"
      });
      setImageUrl(res.url);
    } catch (error) {
      toast.error(error?.data?.message || error.error, {
        className: "bg-[#F3EEEA] text-[#5D534A]",
        progressClassName: "bg-[#B0A695]"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-[#3A3632] mb-4">
        {buttonText === "Submit" ? "Create Category" : "Update Category"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          fullWidth
          variant="outlined"
          label="Category Name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={{ 
            mb: 3,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#EBE3D5",
              },
              "&:hover fieldset": {
                borderColor: "#B0A695",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#776B5D",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#5D534A",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#776B5D",
            },
          }}
        />

        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUpload />}
          fullWidth
          disabled={uploading}
          sx={{
            py: 1.5,
            borderColor: "#EBE3D5",
            color: "#5D534A",
            "&:hover": {
              borderColor: "#B0A695",
              backgroundColor: "rgba(176, 166, 149, 0.04)",
            },
          }}
        >
          {uploading ? (
            <CircularProgress size={24} sx={{ color: "#5D534A" }} />
          ) : (
            "Upload Category Image"
          )}
          <VisuallyHiddenInput 
            type="file" 
            onChange={uploadFileHandler}
            accept="image/*"
          />
        </Button>

        {imageUrl && (
          <div className="mt-3 flex justify-center">
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="h-32 w-32 object-cover rounded-lg border border-[#EBE3D5]"
            />
          </div>
        )}

        <div className="flex gap-4 pt-2">
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={uploading}
            sx={{
              py: 1.5,
              backgroundColor: "#776B5D",
              "&:hover": {
                backgroundColor: "#5D534A",
              },
            }}
          >
            {buttonText}
          </Button>

          {handleDelete && (
            <Button
              onClick={handleDelete}
              variant="contained"
              fullWidth
              disabled={uploading}
              sx={{
                py: 1.5,
                backgroundColor: "#D9CDC1",
                color: "#5D534A",
                "&:hover": {
                  backgroundColor: "#B0A695",
                },
              }}
            >
              Delete
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;