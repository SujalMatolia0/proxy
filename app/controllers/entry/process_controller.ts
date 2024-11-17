import Entry from '#models/entry'
import vine from '@vinejs/vine'
import { safeRoute } from '../../miscellaneous/safe_route.js'
import ProcessingException from '../../miscellaneous/processing_exception.js'

export default class Controller {
  input = vine.compile(
    vine.object({
      params: vine.object({
        entryId: vine.number(),
      }),
    })
  )

  handle = safeRoute({
    options: {
      input: this.input,
    },
    handle: async ({ payload, ctx }) => {
      const entry = await Entry.cached(payload.params.entryId)

      if (!entry) {
        throw new ProcessingException('Entry not found')
      }

      if (!entry.isProxy) {
        return ctx.response.redirect(entry.url)
      }

      ctx.response.plainCookie('entryId', entry.id, { encode: false })

      return ctx.response.redirect().toPath('/')
    },
  })
}
