const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'File belum dipilih. Kirim file dengan nama field "file"'
    });
  }

  const baseUrl = req.protocol + '://' + req.get('host');

  return res.status(201).json({
    success: true,
    message: 'Upload berhasil',
    data: {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: '/uploads/' + req.file.filename,
      url: baseUrl + '/uploads/' + req.file.filename
    }
  });
};

module.exports = { uploadFile };