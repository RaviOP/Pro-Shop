import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, "uploads/");
	},
	filename(req, file, cb) {
		cb(
			null,
			`${file.originalname.split(".")[0]}-${Date.now()}${path.extname(file.originalname)}`
		);
	},
});

let checkFileType = (file, cb) => {
	const fileTypes = /jpg|jpeg|png/;
	const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
	const mimeType = fileTypes.test(file.mimetype);

	if (extName && mimeType) {
		return cb(null, true);
	} else {
		cb("Images Only");
	}
};

export const upload = multer({
	storage,
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	},
});
