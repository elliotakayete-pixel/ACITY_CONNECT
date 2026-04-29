export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (error, req, res, next) => {
  const status = error.status || 500;

  if (process.env.NODE_ENV !== "test") {
    console.error(error);
  }

  res.status(status).json({
    message: error.message || "Something went wrong.",
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {})
  });
};
