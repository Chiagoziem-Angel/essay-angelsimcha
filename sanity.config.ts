import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { essay } from './sanity/schemas/essay'

export default defineConfig({
  name: 'default',
  title: 'Angel Simcha Essays',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool()],
  schema: {
    types: [essay],
  },
})