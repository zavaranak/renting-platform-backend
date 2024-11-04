import { GraphQLResolveInfo } from 'graphql';

export function getRelations(info: GraphQLResolveInfo) {
  const fields = getRequestFields(info);
  const relations = [];
  fields.includes('tenant') && relations.push('tenant');
  fields.includes('booking') && relations.push('booking');
  fields.includes('bookings') && relations.push('bookings');
  fields.includes('landlord') && relations.push('landlord');
  fields.includes('places') && relations.push('places');
  fields.includes('place') && relations.push('place');
  fields.includes('attributes') && relations.push('attributes');
  console.log('relations from info:', relations);
  return relations;
}
function getRequestFields(info: GraphQLResolveInfo) {
  return info.fieldNodes[0].selectionSet.selections.map(
    (selection: any) => selection.name.value,
  );
}
