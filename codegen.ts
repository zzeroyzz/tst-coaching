// Updated codegen.ts to include all GraphQL files
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:3000/api/graphql',
  documents: [
    'lib/graphql/queries/**/*.ts',
    'lib/graphql/mutations/**/*.ts',
    'lib/graphql/fragments/**/*.ts'
  ],
  generates: {
    'lib/graphql/generated/': {
      preset: 'client',
      plugins: [],
      config: {
        useTypeImports: true,
        strictScalars: true,
        scalars: {
          DateTime: 'Date'
        }
      }
    },
    'lib/graphql/generated/schema.json': {
      plugins: ['introspection']
    }
  }
}

export default config
