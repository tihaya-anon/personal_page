import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import fs from 'node:fs';

// https://vite.dev/config/
export default defineConfig({
  // Add a plugin to handle SPA routing
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'generate-spa-redirects',
      closeBundle() {
        // Create _redirects file for Netlify
        const redirectsContent = '/* /index.html 200';
        fs.writeFileSync('../prod/_redirects', redirectsContent);
        
        // Create a web.config file for IIS
        const webConfigContent = `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="SPA Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>`;
        fs.writeFileSync('../prod/web.config', webConfigContent);
        
        // Create .htaccess file for Apache
        const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>`;
        fs.writeFileSync('../prod/.htaccess', htaccessContent);
        
        // Create 404.html for GitHub Pages SPA routing
        const notFoundHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script>
    // Store the URL the user was trying to access
    sessionStorage.setItem('redirectUrl', window.location.pathname + window.location.search);
    // Redirect to the root
    window.location.href = '/';
  </script>
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>`;
        fs.writeFileSync('../prod/404.html', notFoundHtml);
        
        // Modify index.html to handle GitHub Pages routing
        const indexPath = '../prod/index.html';
        if (fs.existsSync(indexPath)) {
          let indexContent = fs.readFileSync(indexPath, 'utf8');
          // Add the GitHub Pages SPA routing script right after the <head> tag
          const scriptToAdd = `
  <!-- GitHub Pages SPA routing -->
  <script>
    (function() {
      // Check if we need to redirect
      const redirectUrl = sessionStorage.getItem('redirectUrl');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectUrl');
        // Small delay to ensure the app has time to initialize
        setTimeout(() => {
          history.replaceState(null, null, redirectUrl);
          // Force a re-render if needed
          window.dispatchEvent(new Event('popstate'));
        }, 300);
      }
    })();
  </script>`;
          
          indexContent = indexContent.replace('<head>', '<head>' + scriptToAdd);
          fs.writeFileSync(indexPath, indexContent);
        }
        
        console.log('✅ Generated SPA redirect files for various hosting environments (including GitHub Pages)');
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "#": path.resolve(__dirname, "./src/components"),
    },
  },
  build: {
    sourcemap: true,
    outDir: '../prod',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const p = id.split('node_modules/')[1].split(path.sep);
            const name = p[0].startsWith('@') ? `${p[0]}_${p[1]}` : p[0];
            return `vendor_${name.replace(/[@/]/g, '_')}`;
          }
        },
      },
    },
  },
});
