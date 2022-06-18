import { makeSchema } from 'nexus'
import { join } from 'path'
import { validatePlugin } from 'nexus-validate';
import * as types from "./graphql";

export const schema = makeSchema({
  types, 
  // plugin validation
  plugins: [
    validatePlugin(),
  ],
  outputs: {
    schema: join(process.cwd(), "schema.graphql"), 
    typegen: join(process.cwd(), "nexus-typegen.ts"), 
  },
  contextType: {  
    module: join(process.cwd(), "./src/context.ts"),  
    export: "Context",  
},
})