export const handle = ({ event, resolve }) => {
  event.params.__ACCESS_TOKEN__ = event.cookies.get('access_token'); // USE __X__ to prevent it interfering with other params
  event.params.__REFRESH_TOKEN__ = event.cookies.get('refresh_token');
  event.params.__ID_TOKEN__ = event.cookies.get('id_token');

  return resolve(event);
}