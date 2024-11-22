import Entry from '#models/entry'
import vine from '@vinejs/vine'
import { safeRoute } from '../../miscellaneous/safe_route.js'

export default class Controller {
  input = vine.compile(
    vine.object({
      name: vine.string(),
      description: vine.string().maxLength(150).optional(),
      slug: vine.string(),
      url: vine.string().url({
        require_protocol: true,
        protocols: ['http', 'https'],
        validate_length: true,
      }),
    })
  )

  handle = safeRoute({
    options: {
      input: this.input,
    },
    handle: async ({ payload }) => {
      const entry = await Entry.create({
        name: payload.name,
        description: payload.description,
        slug: payload.slug,
        url: payload.url,
      })

      return entry.$serialize()
    },
  })
}
