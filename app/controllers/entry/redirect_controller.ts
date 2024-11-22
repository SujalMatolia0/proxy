import Entry from '#models/entry'
import vine from '@vinejs/vine'
import { safeRoute } from '../../miscellaneous/safe_route.js'
import ProcessingException from '../../miscellaneous/processing_exception.js'

export default class Controller {
  input = vine.compile(
    vine.object({
      params: vine.object({
        slug: vine.string(),
      }),
    })
  )

  handle = safeRoute({
    options: {
      input: this.input,
    },
    handle: async ({ payload, ctx }) => {
      const entry = await Entry.cached(payload.params.slug)

      if (!entry) {
        throw new ProcessingException('Entry not found')
      }

      return ctx.response.redirect(entry.url)
    },
  })
}
