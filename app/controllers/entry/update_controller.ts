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
      name: vine.string().optional(),
      description: vine.string().maxLength(150).optional(),
      isProxy: vine.boolean().optional(),
      url: vine
        .string()
        .url({
          require_protocol: true,
          protocols: ['http', 'https'],
          validate_length: true,
        })
        .optional(),
    })
  )

  handle = safeRoute({
    options: {
      input: this.input,
    },
    handle: async ({ payload }) => {
      const entry = await Entry.find(payload.params.entryId)

      if (!entry) {
        throw new ProcessingException('Entry not found')
      }

      if (payload.name && payload.name !== entry.name) {
        entry.name = payload.name
      }

      if (payload.description && payload.description !== entry.description) {
        entry.description = payload.description
      }

      if (payload.isProxy !== undefined) {
        entry.isProxy = payload.isProxy
      }

      if (payload.url && payload.url !== entry.url) {
        entry.url = payload.url
      }

      if (entry.$isDirty) {
        await entry.save()
      }

      return entry.$serialize()
    },
  })
}
