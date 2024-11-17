// import type { HttpContext } from '@adonisjs/core/http'

import Entry from '#models/entry'
import { safeRoute } from '../../miscellaneous/safe_route.js'

export default class Controller {
  handle = safeRoute({
    handle: async () => {
      const list = await Entry.query().limit(10)

      return list.map((entry) => entry.$serialize())
    },
  })
}
