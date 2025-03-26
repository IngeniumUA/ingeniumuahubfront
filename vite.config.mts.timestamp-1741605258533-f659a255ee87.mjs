// vite.config.mts
import { defineConfig } from "file:///C:/Users/woutd/WebstormProjects/ingeniumuahubfront/node_modules/vite/dist/node/index.js";
import { sveltekit } from "file:///C:/Users/woutd/WebstormProjects/ingeniumuahubfront/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { sentrySvelteKit } from "file:///C:/Users/woutd/WebstormProjects/ingeniumuahubfront/node_modules/@sentry/sveltekit/build/cjs/index.server.js";
import { enhancedImages } from "file:///C:/Users/woutd/WebstormProjects/ingeniumuahubfront/node_modules/@sveltejs/enhanced-img/src/index.js";
var vite_config_default = defineConfig({
  plugins: [
    sentrySvelteKit(),
    enhancedImages(),
    sveltekit()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  },
  server: {
    port: 4200,
    proxy: {
      "/api": {
        target: "https://hub.dev.ingeniumua.be",
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 4200
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcd291dGRcXFxcV2Vic3Rvcm1Qcm9qZWN0c1xcXFxpbmdlbml1bXVhaHViZnJvbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHdvdXRkXFxcXFdlYnN0b3JtUHJvamVjdHNcXFxcaW5nZW5pdW11YWh1YmZyb250XFxcXHZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvd291dGQvV2Vic3Rvcm1Qcm9qZWN0cy9pbmdlbml1bXVhaHViZnJvbnQvdml0ZS5jb25maWcubXRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB7IHN2ZWx0ZWtpdCB9IGZyb20gJ0BzdmVsdGVqcy9raXQvdml0ZSc7XHJcbmltcG9ydCB7IHNlbnRyeVN2ZWx0ZUtpdCB9IGZyb20gJ0BzZW50cnkvc3ZlbHRla2l0JztcclxuaW1wb3J0IHsgZW5oYW5jZWRJbWFnZXMgfSBmcm9tIFwiQHN2ZWx0ZWpzL2VuaGFuY2VkLWltZ1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuXHRwbHVnaW5zOiBbXHJcblx0XHRzZW50cnlTdmVsdGVLaXQoKSxcclxuXHRcdGVuaGFuY2VkSW1hZ2VzKCksXHJcblx0XHRzdmVsdGVraXQoKSxcclxuXHRdLFxyXG5cdGNzczoge1xyXG5cdFx0cHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG5cdFx0XHRzY3NzOiB7XHJcblx0XHRcdFx0YXBpOiAnbW9kZXJuLWNvbXBpbGVyJ1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRzZXJ2ZXI6IHtcclxuXHRcdHBvcnQ6IDQyMDAsXHJcblx0XHRwcm94eToge1xyXG5cdFx0XHQnL2FwaSc6IHtcclxuXHRcdFx0XHR0YXJnZXQ6ICdodHRwczovL2h1Yi5kZXYuaW5nZW5pdW11YS5iZScsXHJcblx0XHRcdFx0Y2hhbmdlT3JpZ2luOiB0cnVlLFxyXG5cdFx0XHRcdHNlY3VyZTogZmFsc2UsXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdHByZXZpZXc6IHtcclxuXHRcdHBvcnQ6IDQyMDAsXHJcblx0fVxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvVixTQUFTLG9CQUFvQjtBQUNqWCxTQUFTLGlCQUFpQjtBQUMxQixTQUFTLHVCQUF1QjtBQUNoQyxTQUFTLHNCQUFzQjtBQUUvQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTO0FBQUEsSUFDUixnQkFBZ0I7QUFBQSxJQUNoQixlQUFlO0FBQUEsSUFDZixVQUFVO0FBQUEsRUFDWDtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0oscUJBQXFCO0FBQUEsTUFDcEIsTUFBTTtBQUFBLFFBQ0wsS0FBSztBQUFBLE1BQ047QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ04sUUFBUTtBQUFBLFFBQ1AsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLE1BQ1Q7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1IsTUFBTTtBQUFBLEVBQ1A7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
