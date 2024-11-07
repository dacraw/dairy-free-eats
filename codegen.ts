import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "app/javascript/graphql/schema.graphql",
  documents: "app/javascript/**/*.tsx",
  generates: {
    "app/javascript/graphql/types.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
  },
};

export default config;
