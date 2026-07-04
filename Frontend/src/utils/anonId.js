// Generate or retrieve a unique anonymous ID stored in localStorage
export const getAnonId = () => {
  let anonId = localStorage.getItem("nagarseva_anon_id");

  if (!anonId) {
    anonId = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("nagarseva_anon_id", anonId);
  }

  return anonId;
};