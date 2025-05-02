import { getAuthorizationHeaders, getLoginUrlWithRedirect, hasValidToken } from '$lib/auth/auth';
import { redirect } from "@sveltejs/kit";
import { PUBLIC_API_URL } from '$env/static/public';
import { handleRequest } from '$lib/utilities/httpUtilities';
import { browser } from '$app/environment';

export const load = async ({ params, url }) => {
  let url_path_param = url.searchParams.get("path")
  if (url_path_param === null) {url_path_param = ""}
  const total_url = url.pathname + "?path=" + encodeURI(url_path_param)
  if (!hasValidToken(params)) {
    redirect(307, getLoginUrlWithRedirect(total_url));
  }
  const cloud_sas: string = await fetch(
    `${PUBLIC_API_URL}/file/sas_cloud_token`,
    {
      method: 'GET',
      headers: getAuthorizationHeaders(params),
    }
  ).then(handleRequest);

  async function get_file_list() {
    if (!browser) return;
    try {
      const filelist = await fetch(
        `https://ingeniumuacloud.blob.core.windows.net/cloud?${cloud_sas}&restype=container&comp=list`,
        { method: 'GET' }
      )

      const xmlText = await filelist.text();

      if (!filelist.ok) {
        console.error("Azure error:", xmlText);
        return;
      }

      return parseBlobListXml(xmlText);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  const parseBlobListXml = (xmlText: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    const blobNodes = xmlDoc.getElementsByTagName("Blob");

    return Array.from(blobNodes).map((blob) => {
      const name = blob.getElementsByTagName("Name")[0]?.textContent ?? "";

      const props = blob.getElementsByTagName("Properties")[0];
      const lastModified = props?.getElementsByTagName("Last-Modified")[0]?.textContent ?? "";
      const size = props?.getElementsByTagName("Content-Length")[0]?.textContent ?? "";

      return {
        name: name,
        size: size,
        lastModified: lastModified
      };
    });
  };

  const file_list = await get_file_list()
  return {file_list: file_list, cloud_sas: cloud_sas};
}
