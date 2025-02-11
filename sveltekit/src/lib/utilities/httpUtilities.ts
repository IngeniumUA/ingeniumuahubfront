export const handleRequest = async (response: Response) => {
  if (!response.ok) throw response;
  return response.json();
}