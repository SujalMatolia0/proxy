import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { serializeDT } from '../miscellaneous/serialize.js'
import { cache } from '#config/cache'

export default class Entry extends BaseModel {
  static serialize(row: Entry) {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      isProxy: Boolean(row.isProxy),
      url: row.url,
      createdAt: serializeDT(row.createdAt),
      updatedAt: serializeDT(row.updatedAt),
    }
  }

  $serialize() {
    return Entry.serialize(this)
  }

  static async cached(id: number) {
    return cache
      .namespace(this.table)
      .namespace(String(id))
      .getOrSet(
        'self',
        async () => {
          const entry = await this.find(id)

          if (!entry) {
            return null
          }

          return entry.$serialize()
        },
        {
          ttl: '1m',
        }
      )
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare isProxy: boolean

  @column()
  declare url: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
