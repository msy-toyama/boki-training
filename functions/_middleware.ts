export const onRequest = async (context: any) => {
  const url = new URL(context.request.url);
  
  // Check if the request is for the pages.dev domain
  if (url.hostname.endsWith('.pages.dev')) {
    // Update the hostname to the custom domain
    url.hostname = 'boki-training.com';
    // Return a 301 Moved Permanently redirect
    return Response.redirect(url.toString(), 301);
  }

  // Continue to the next middleware or the asset
  return context.next();
};
