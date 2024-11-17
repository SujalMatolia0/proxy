/// <reference types="@adonisjs/core/providers/vinejs_provider" />

import { HttpContext } from '@adonisjs/core/http'
import { VineValidator } from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

type LocalHttpContext = HttpContext

function safeRoute<
  RouteOutput extends any,
  RouteInputObject extends VineValidator<any, any>,
>(params: {
  handle: (params: {
    ctx: LocalHttpContext
    payload: Infer<RouteInputObject>
  }) => Promise<RouteOutput>
  options?: {
    input?: RouteInputObject
  }
}) {
  return async (ctx: LocalHttpContext) => {
    const payload = params.options?.input
      ? await ctx.request.validateUsing(params.options?.input)
      : undefined

    return params.handle({ payload, ctx })
  }
}

export { safeRoute }
