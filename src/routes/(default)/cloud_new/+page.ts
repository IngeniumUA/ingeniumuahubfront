import { getAuthorizationHeaders, getCookie, getLoginUrlWithRedirect, hasValidToken, setCookie } from '$lib/auth/auth';
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

  let cloud_sas: string | undefined = getCookie("sas_cloud_token")
  if (!cloud_sas) {
    cloud_sas = await fetch(
      `${PUBLIC_API_URL}/file/sas_cloud_token`,
      {
        method: 'GET',
        headers: getAuthorizationHeaders(params),
      }
    ).then(handleRequest) as string;
    setCookie("sas_cloud_token", cloud_sas, Date.now() + 86300000 );
  }

  async function get_file_list() {
    if (!browser) return;

    const allFiles: any[] = [];
    let nextMarker = "";

    try {
      do {
        const url = `https://ingeniumuacloud.blob.core.windows.net/cloud?${cloud_sas}&restype=container&comp=list${nextMarker ? `&marker=${encodeURIComponent(nextMarker)}` : ''}`;

        const res = await fetch(url, { method: 'GET' });
        const xmlText = await res.text();

        if (!res.ok) {
          console.error("Azure error:", xmlText);
          break;
        }

        const { blobs, nextMarker: newMarker } = parseBlobListXml(xmlText);
        allFiles.push(...blobs);
        nextMarker = newMarker;

      } while (nextMarker);

      return allFiles;
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  const parseBlobListXml = (xmlText: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    const blobNodes = xmlDoc.getElementsByTagName("Blob");

    const blobs = Array.from(blobNodes).map((blob) => {
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

    const nextMarkerNode = xmlDoc.getElementsByTagName("NextMarker")[0];
    const nextMarker = nextMarkerNode?.textContent ?? "";

    return { blobs, nextMarker };
  };

  const file_list = await get_file_list()
  return {file_list: file_list, cloud_sas: cloud_sas};
}
