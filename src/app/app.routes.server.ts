// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';
export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: 'events',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'info',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'info/clublied',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'info/relations',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**', // All other routes will be rendered on the client
    renderMode: RenderMode.Client,
  },
];
