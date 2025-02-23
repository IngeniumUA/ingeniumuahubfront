export const ssr = false;
export const prerender = false;

export const load = ({ url }) => {
  return {
    paymentStatus: url.searchParams.get('redirect_status'),
  }
}