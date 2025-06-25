const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const AppError = require("./AppError");

cloudinary.config({
  cloud_name: "dyrcpslwb",
  api_key: 564269647271827,
  api_secret: "Wi73vJpnaEl_a2brUcxADpFd3Sw",
});

class cloudinaryUploader {
  constructor(req, folderName, width, height, fileType) {
    this.req = req;
    this.folderName = folderName;
    this.width = width || 100;
    this.height = height || 100;
    this.fileType = fileType;
  }

  multerFilter(req, file, cb) {
    if (file.mimetype.startsWith(this.fileType)) {
      cb(null, true);
    } else {
      cb(new AppError("Not an image! Please upload only images.", 415), false);
    }
  }

  uploadFile() {
    const upload = multer({
      storage: multer.memoryStorage,
      fileFilter: this.multerFilter,
    });
    return upload;
  }

  async uploadSingleToCloudinary() {
    const b64 = Buffer.from(this.req.file.buffer).toString("base64");
    const dataURI = "data:" + this.req.file.mimetype + ";base64," + b64;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: this.folderName,
      width: this.width,
      height: this.height,
    });
    return result.secure_url;
  }

  async uploadMultiple() {
    const images = [];
    // console.log("filetype: ",this.fileType);
    // console.log("Clou: ", this.req.files[this.fileType]);
    await Promise.all(this.req.files[this.fileType].map(async (image) => {
      const b64 = Buffer.from(image.buffer).toString("base64");
      const dataURI = "data:" + image.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: this.folderName,
        width: this.width,
        height: this.height,
      });
      images.push(result.secure_url);
    }));
    return images;
  }
  deleteImage() {
    console.log("Deleting image.");
  }
}

module.exports = cloudinaryUploader;
