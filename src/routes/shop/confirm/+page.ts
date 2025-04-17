import { handleRequest } from '$lib/utilities/httpUtilities';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import { PUBLIC_API_URL } from '$env/static/public';

export const ssr = false;
export const prerender = false;

export const load = async ({ url, params, fetch }) => {
  const paymentStatus = url.searchParams.get('redirect_status');
  if (paymentStatus !== 'succeeded') {
    return {
      paymentStatus,
      checkoutUuid: null,
      trackerId: NaN,
    }
  }

  // Only when the payment status is success we will fetch the checkout UUID and tracker id
  const checkoutUuid = url.searchParams.get('checkout_uuid');
  let trackerId = parseInt(url.searchParams.get('tracker_id') || '', 10);

  if (checkoutUuid && !trackerId) {
    try {
      trackerId = await fetch(`${PUBLIC_API_URL}/order_tracking/${checkoutUuid}`, {
        headers: getAuthorizationHeaders(params),
      }).then(handleRequest) as number;
    } catch (error) {
      if (error instanceof Response) {
        // If the result is a 406, ignore it as it means there is no tracker id
        if (error.status === 406) {
          return {
            paymentStatus,
            checkoutUuid,
            trackerId: NaN,
          }
        }
      }

      console.error(error);
    }
  }

  return {
    paymentStatus,
    checkoutUuid,
    trackerId,
  }
}