const unAuthorizedHelper = (e: any) => {
  const status = e?.response?.status;
  if (status === 403) {
    // For payment checkout pages, don't redirect — let the page handle the error
    // Only clear token so subsequent requests don't reuse a revoked token
    localStorage.removeItem("token");
    
    // Throw a user-facing error instead of redirecting
    const message = e?.response?.data?.message || "Session expired or unauthorized. Please use a valid payment link.";
    throw new Error(message);
  }
};

export default unAuthorizedHelper;
