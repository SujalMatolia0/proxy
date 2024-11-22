/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router
      .group(() => {
        router
          .group(() => {
            router.get('', [() => import('#controllers/entry/list_controller')])
            router.post('', [() => import('#controllers/entry/create_controller')])
            router.get(':entryId', [() => import('#controllers/entry/show_controller')])
            router.put(':entryId', [() => import('#controllers/entry/update_controller')])
            router.delete(':entryId', [() => import('#controllers/entry/delete_controller')])
            router.get('redirect/:slug', [() => import('#controllers/entry/redirect_controller')])
          })
          .prefix('entry')
      })
      .prefix('v1')
  })
  .prefix('api')
