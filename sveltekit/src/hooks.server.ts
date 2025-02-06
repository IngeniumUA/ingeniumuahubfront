export const handle = ({ event, resolve }) => {
  event.params.__ACCESS_TOKEN__ = event.cookies.get('access_token'); // USE __X__ to prevent it interfering with other params

  return resolve(event);
}