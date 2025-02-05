export async function GET() {
  return new Response("OK", {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
      "X-Robots-Tag": "noindex",
    },
  });
}