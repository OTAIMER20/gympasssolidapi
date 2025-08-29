import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import type { Environment } from 'vitest/environments'
import { PrismaClient } from '@prisma/client'


function generateDataBaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

const prismaEnv: Environment = {
  name: 'prisma',
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDataBaseURL(schema)

    console.log(generateDataBaseURL(schema))

    process.env.DATABASE_URL = databaseURL

    execSync('npx prisma db push')


    const prisma = new PrismaClient()

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)

        await prisma.$disconnect()
      },
    }
  },
  transformMode: 'web'
}

export default prismaEnv


// postgresql://docker:docker@localhost:5433/apisolid?schema=public"
