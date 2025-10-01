<script lang="ts" setup>
import type { Primitive } from '@nzyme/types';
import { computed } from 'vue';

import { useEditorProps } from '@superadmin/client';
import * as s from '@superadmin/schema';
import type { ObjectUnionSchema } from '@superadmin/schema';
import { concatKeys } from '@superadmin/validation';

import Editor from '../Editor.vue';
import EnumEditor from './EnumEditor.vue';

const props = defineProps({
  ...useEditorProps<ObjectUnionSchema>(),
});

const model = defineModel<Record<string, unknown> | null | undefined>();

const discriminatorOptions = computed(() => {
  return props.schema.of.map(schema => {
    const discriminator = schema.props[props.schema.discriminator];
    if (!discriminator || !s.isSchema(discriminator, s.const)) {
      throw new Error(`Invalid discriminator field in union schema`);
    }

    return {
      discriminator,
      schema,
    };
  });
});

const discriminatorSchema = computed(() => {
  const defaultDiscriminator = discriminatorOptions.value.find(
    option => option.discriminator.value,
  );

  return s.enum({
    values: discriminatorOptions.value.map(option => option.discriminator.value),
    default: defaultDiscriminator?.discriminator.value,
    label: defaultDiscriminator?.discriminator.label,
    help: defaultDiscriminator?.discriminator.help,
  });
});

const currentDiscriminatorValue = computed(() => {
  return model.value?.[props.schema.discriminator] as Primitive | null | undefined;
});

const currentSchema = computed(() => {
  const current = currentDiscriminatorValue.value;
  return discriminatorOptions.value.find(option => option.discriminator.value === current)?.schema;
});

const fieldsToRender = computed(() => {
  if (!currentSchema.value) {
    return [];
  }

  return Object.entries(currentSchema.value.props).filter(([key, schema]) => {
    return key !== props.schema.discriminator && !schema.hidden;
  });
});

function updateDiscriminator(newValue: Primitive | null | undefined) {
  const targetOption =
    discriminatorOptions.value.find(option => option.discriminator.value === newValue) ||
    // Fallback to the first discriminator option
    discriminatorOptions.value[0];

  if (!targetOption) {
    return;
  }

  // Coerce the current model to the new schema type, preserving compatible fields
  const currentModel = model.value || {};
  const newModel = s.coerceNonNull(targetOption.schema, {
    ...currentModel,
    [props.schema.discriminator]: newValue,
  });

  model.value = newModel;
}

function setProp(prop: string, value: unknown) {
  if (!model.value) {
    // Initialize with the first available discriminator value if none exists
    const schema = currentSchema.value || discriminatorOptions.value[0]?.schema;
    if (schema) {
      model.value = s.coerceNonNull(schema, {});
    } else {
      throw new Error('No schema found');
    }
  }

  model.value[prop] = value;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Discriminator Field -->
    <EnumEditor
      :path="concatKeys(props.path, props.schema.discriminator)"
      :schema="discriminatorSchema"
      :errors="props.errors"
      :model-value="currentDiscriminatorValue"
      @update:model-value="updateDiscriminator"
    />

    <!-- Fields for Current Schema -->
    <Editor
      v-for="[prop, schema] in fieldsToRender"
      :key="prop"
      :model-value="model?.[prop]"
      :schema="schema"
      :path="concatKeys(props.path, prop)"
      :errors="props.errors"
      @update:model-value="setProp(prop, $event)"
    />
  </div>
</template>
