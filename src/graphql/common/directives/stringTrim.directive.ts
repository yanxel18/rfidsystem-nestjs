import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';

export function stringTrimDirective(
  schema: GraphQLSchema,
  directiveName: string,
) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: fieldConfig => {
      const stringDirective = getDirective(
        schema,
        fieldConfig,
        directiveName,
      )?.[0];

      if (stringDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig; 
        fieldConfig.resolve = async function (source, args, context, info) {
          const result = await resolve(source, args, context, info);
          if (typeof result === 'string') {
            return result.trim();
          }
          return result;
        };
        return fieldConfig;
      }
    },
  });
}
