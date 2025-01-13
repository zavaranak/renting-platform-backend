import { GraphQLResolveInfo } from 'graphql';
import { MAIN_TABLE } from './query_function';

export const RELATIONS = [
  'tenant',
  'booking',
  'bookings',
  'landlord',
  'places',
  'place',
  'attributes',
];

export function getRelations(info: GraphQLResolveInfo) {
  // const fields = [];
  const { mainFields } = getRequestFields(info);
  const relations = [];
  const entity_field = [];

  mainFields.forEach((field) => {
    if (RELATIONS.includes(field)) {
      RELATIONS.push(field);
    } else {
      if (field != '__typename') {
        entity_field.push(MAIN_TABLE + '.' + field);
      }
    }
  });

  mainFields.includes('tenant') && relations.push('tenant');
  mainFields.includes('booking') && relations.push('booking');
  mainFields.includes('bookings') && relations.push('bookings');
  mainFields.includes('landlord') && relations.push('landlord');
  mainFields.includes('places') && relations.push('places');
  mainFields.includes('place') && relations.push('place');
  mainFields.includes('attributes') && relations.push('attributes');
  return {
    relations: relations,
    fields: entity_field,
    // relationFields: relationFields,
    // subRelationFields: subRelationFields,
  };
}
function getRequestFields(info: GraphQLResolveInfo) {
  // fields of entity
  const mainFields = [];
  // fields of relations
  const relationFields = new Map<string, string[]>();
  // fleld of ralations of relations
  const subRelationFields = new Map<string, string[]>();

  //handles fields main layer
  info.fieldNodes[0].selectionSet.selections.map((selection: any) => {
    const mainFieldValue = selection.name.value;
    mainFields.push(mainFieldValue);

    //handle fields relation layer
    if (selection.selectionSet) {
      selection.selectionSet.selections.map((selection2: any) => {
        const relationFieldValue = selection2.name.value;
        // if (!relationFields.has(mainFieldValue)) {
        //   relationFields.set(mainFieldValue, [selection2.name.value]);
        // } else {
        //   const relationFieldArray = relationFields.get(mainFieldValue);
        //   relationFieldArray.push(relationFieldValue);
        //   relationFields.set(mainFieldValue, relationFieldArray);
        // }
        // handle field subrelation layer
        // if (selection2.selectionSet) {
        //   selection2.selectionSet.selections.map((selection3: any) => {
        //     const subRelationFieldValue = selection3.name.value;
        //     if (!relationFields.has(subRelationFieldValue)) {
        //       subRelationFields.set(relationFieldValue, [
        //         selection3.name.value,
        //       ]);
        //     } else {
        //       const subRelationFieldArray =
        //         subRelationFields.get(relationFieldValue);
        //       subRelationFieldArray.push(subRelationFieldValue);
        //       subRelationFields.set(relationFieldValue, subRelationFieldArray);
        //     }
        //   });
        // }
      });
    }
  });
  return { mainFields };
}
