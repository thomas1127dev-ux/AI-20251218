import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      uni(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {  // 想在开发环境看效果就打开（会导致开发环境缓存，看不到效果）
          enabled: false
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
           maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
        },
        includeAssets: ['favicon.ico', 'logo.png'],
        manifest: {
          name: env.VITE_API_NAME,
          short_name: env.VITE_API_SHORT_NAME,
          description: env.VITE_API_DESCRIPTION,
          theme_color: '#ffffff',
          icons: [{
            src: '/static/icon/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/static/icon/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
          ]
        }
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // 取消sass废弃API的报警
          silenceDeprecations: ['legacy-js-api', 'color-functions', 'import'],
        },
      },
    },
    server: {
      // 开发服务器配置
      host: '0.0.0.0', // 允许外部访问
      port: 3000, // 开发服务器端口
      // 代理配置解决跨域问题
      proxy: {
        // 代理所有以 /api 开头的请求
        '/api': {
          target: 'https://collide.mnvjdhsl.com', // 后端服务器域名
          changeOrigin: true, // 是否更换源
          secure: false, // 如果目标服务器使用自签名证书，需关闭安全验证
          rewrite: (path) => path, // 保持路径不变，直接转发 /api/xxx
          // 配置请求头
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // 添加跨域相关头部
              proxyReq.setHeader('Access-Control-Allow-Origin', '*');
              proxyReq.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
              proxyReq.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, token, is-dev');
            });
          }
        },
        // AI聊天接口代理 - 解决CORS跨域问题
        '/ai-chat': {
          target: 'https://rozanne-unbiddable-doria.ngrok-free.dev',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/ai-chat/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // 确保传递所有必要的请求头
              // 1. ngrok 相关头部
              proxyReq.setHeader('ngrok-skip-browser-warning', 'true');

              // 2. User-Agent
              if (!proxyReq.getHeader('user-agent')) {
                proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
              }

              // 3. 确保传递 Authorization 和其他自定义头部
              const authHeader = req.headers['authorization'];
              if (authHeader) {
                proxyReq.setHeader('Authorization', authHeader);
              }

              // 4. 传递 Content-Type
              const contentType = req.headers['content-type'];
              if (contentType) {
                proxyReq.setHeader('Content-Type', contentType);
              }

              console.log('[Proxy] Method:', req.method, 'Path:', req.url);
              console.log('[Proxy] Headers:', {
                'Authorization': proxyReq.getHeader('authorization'),
                'User-Agent': proxyReq.getHeader('user-agent'),
                'ngrok-skip-browser-warning': proxyReq.getHeader('ngrok-skip-browser-warning'),
                'Content-Type': proxyReq.getHeader('content-type')
              });
            });

            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('[Proxy] Response Status:', proxyRes.statusCode, 'URL:', req.url);
            });
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    esbuild: {
      drop: ['console', 'debugger'],
    },
  }
})
