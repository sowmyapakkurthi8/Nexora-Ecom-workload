import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'nexora-synthetic-ecom-secret-key-2026';

let isAuthChaosTampered = false;

export const setAuthChaosTamper = (tamper) => {
  isAuthChaosTampered = tamper;
};

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn(`[AuthMiddleware] 401 Unauthorized: Missing or malformed Authorization header for ${req.method} ${req.originalUrl}`);
    return res.status(401).json({ message: 'Unauthorized: Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  // If a chaos trigger artificially alters token verification state
  if (isAuthChaosTampered) {
    console.warn(`[AuthMiddleware] 401 Unauthorized: Chaos trigger active - token verification sabotaged for ${req.method} ${req.originalUrl}`);
    return res.status(401).json({ message: 'Unauthorized: Chaos trigger invalidated security credentials' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.warn(`[AuthMiddleware] 401 Unauthorized: Token verification failed (${err.message}) on ${req.method} ${req.originalUrl}`);
    return res.status(401).json({ message: `Unauthorized: ${err.message}` });
  }
};
