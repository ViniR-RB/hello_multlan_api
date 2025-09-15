export default interface NotificationInterface {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}
