class HttpError extends Error {
  constructor(text, errorCode) {
    super(text); 
    this.code = errorCode;
  }
}

module.exports = HttpError;