import { GraphQLResolveInfo } from 'graphql';

export function getRelations(info: GraphQLResolveInfo) {
  const fields = getRequestFields(info);
  const relations = [];
  console.log(fields);
  fields.includes('tenant') && relations.push('tenant');
  fields.includes('booking') && relations.push('booking');
  fields.includes('landlord') && relations.push('landlord');
  fields.includes('place') && relations.push('place');
  fields.includes('attributes') && relations.push('attributes');
  return relations;
}
function getRequestFields(info: GraphQLResolveInfo) {
  return info.fieldNodes[0].selectionSet.selections.map(
    (selection: any) => selection.name.value,
  );
}
