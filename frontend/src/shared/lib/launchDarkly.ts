export const decodeJWT = (token: string) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT format");
      return null;
    }
    return JSON.parse(atob(parts[1]));
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

export const getContextAttributes = () => {
  return {
    locale: new Intl.DateTimeFormat().resolvedOptions().locale,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};

export const extractLDContext = (token: string) => {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  return {
    kind: "user",
    key: decoded.sub, // immutable user ID
    username: decoded.unique_name,
    ...getContextAttributes(),
    privateAttributes: ["username"],
  };
};
