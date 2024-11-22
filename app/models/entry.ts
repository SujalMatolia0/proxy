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
      slug: row.slug,
      url: row.url,
      createdAt: serializeDT(row.createdAt),
      updatedAt: serializeDT(row.updatedAt),
    }
  }

  $serialize() {
    return Entry.serialize(this)
  }

  static async cached(slug: string) {
    return cache
      .namespace(this.table)
      .namespace(slug)
      .getOrSet(
        'self',
        async () => {
          const entry = await this.findBy('slug', slug)

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
  declare slug: string

  @column()
  declare url: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
