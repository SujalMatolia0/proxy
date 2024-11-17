import Entry from '#models/entry'
import httpProxy from 'http-proxy'
import vine from '@vinejs/vine'
import { safeRoute } from '../../miscellaneous/safe_route.js'
import ProcessingException from '../../miscellaneous/processing_exception.js'

export default class Controller {
  proxy = httpProxy.createProxyServer({})

  input = vine.compile(
    vine.object({
      cookies: vine.object({
        entryId: vine.string(),
      }),
    })
  )

  handle = safeRoute({
    options: {
      input: this.input,
    },
    handle: async ({ payload, ctx }) => {
      const entry = await Entry.cached(Number(payload.cookies.entryId))

      if (!entry) {
        throw new ProcessingException('Entry not found')
      }

      if (!entry.isProxy) {
        ctx.response.clearCookie('entryId')

        throw new ProcessingException('Entry is not a proxy')
      }

      this.proxy.on('proxyRes', function (proxyRes) {
        let body: any[] = []
        proxyRes.on('data', function (chunk) {
          body.push(chunk)
        })
        proxyRes.on('end', function () {
          const tempBody = Buffer.concat(body).toString()
          resolve(tempBody)
        })
      })

      this.proxy.web(
        ctx.request.request,
        ctx.response.response,
        {
          target: new URL(entry.url).origin,
          changeOrigin: true,
          followRedirects: true,
          selfHandleResponse: true,
        },
        (e) => {
          ctx.logger.error({ error: e }, 'Proxy error')

          reject(e)
        }
      )

      ctx.response.send(result)

      return ctx.response
    },
  })
}
