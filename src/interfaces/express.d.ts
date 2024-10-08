declare module Express {
  interface Request {
    user: JwtPayload | null;
  }
}
