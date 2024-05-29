export default class SupabaseUploadException extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'SupabaseUploadException';
  }
}
