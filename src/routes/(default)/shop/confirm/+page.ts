import { handleRequest } from '$lib/utilities/httpUtilities';
import { getAuthorizationHeaders } from '$lib/auth/auth';
import { PUBLIC_API_URL } from '$env/static/public';
import type { PublicOrderTrackerI } from '$lib/models/trackerI';

export const ssr = false;
export const prerender = false;

export const load = async ({ url, params, fetch }) => {
  const paymentStatus = url.searchParams.get('redirect_status');
  if (paymentStatus !== 'succeeded') {
    return {
      paymentStatus,
      checkoutUuid: null,
      tracker: null
    }
  }

  // Only when the payment status is success we will fetch the checkout UUID and tracker id
  const checkoutUuid = url.searchParams.get('checkout_uuid');
  const trackerId = parseInt(url.searchParams.get('tracker_id') || '', 10);

  let tracker: PublicOrderTrackerI = {
    id: trackerId,
    checkout_tracker_status: NaN
  };
  if (checkoutUuid && !trackerId) {
    try {
      tracker = await fetch(`${PUBLIC_API_URL}/order_tracking/${checkoutUuid}`, {
        headers: getAuthorizationHeaders(params),
      }).then(handleRequest) as PublicOrderTrackerI;
    } catch (error) {
      if (error instanceof Response) {
        // If the result is a 406, ignore it as it means there is no tracker id
        if (error.status === 406) {
          return {
            paymentStatus,
            checkoutUuid,
            tracker: null
          }
        }
      }
      console.error(error);
    }
  }

  if (isNaN(tracker.checkout_tracker_status)) {
    try {
      tracker = await fetch(`${PUBLIC_API_URL}/order_tracking/${checkoutUuid}`, {
        headers: getAuthorizationHeaders(params),
      }).then(handleRequest) as PublicOrderTrackerI;
    } catch (error) {
      if (error instanceof Response) {
        // If the result is a 406, ignore it as it means there is no tracker id
        if (error.status === 406) {
          return {
            paymentStatus,
            checkoutUuid,
            tracker: {
              id: trackerId,
              checkout_tracker_status: NaN,
            },
          }
        }
      }
      console.error(error);
    }
  }

  return {
    paymentStatus,
    checkoutUuid,
    tracker,
  }
}