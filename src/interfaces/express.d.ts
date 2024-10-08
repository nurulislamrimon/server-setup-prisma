declare module Express {
  interface Request {
    user: { email: string; role: string };
  }
}
