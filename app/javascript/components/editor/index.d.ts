/* eslint-disable @typescript-eslint/no-explicit-any */
type FormError = {
  name: string;
  property: string;
  stack: string;
  params?: {
    limit: number
  }
};

interface HTMLTextAreaElement extends HTMLElement {focus(): boolean | undefined; }
interface HTMLInputElement extends HTMLElement {focus(): boolean | undefined}
interface HTMLSelectElement extends HTMLElement { focus(): boolean | undefined }
interface HTMLDivElement extends HTMLElement {scrollIntoView({ behavior: string }) }

type FormSection = {
  displayName: string;
  properties: string[];
};

type RouterNavigateProps = {
  replace: boolean
}
type RouterType = {
  location?: {
    hash? : string
  },
  navigate?: (path: string, { replace: boolean }: RouterNavigateProps) => void
  params?: {
    id: string,
    sectionName: string,
    fieldName: string,
    offset: string
  }
}

type KeywordObjectType = {
  headers: string[];
  keywords: string[][]
};

declare module 'react-uuid';
type EmptyObject = Record<string, never>

interface DictionaryType {
  [Key: string]: DictionaryType | EmptyObject | string
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'react-jsonschema-form/lib/components/fields/ObjectField' {
  import React from 'react'
  import FieldProps from 'react-jsonschema-form'
  import MetadataEditor from './MetadataEditor'

  export interface CustomFieldProps<T = object> extends FieldProps<T> {
    registry: {
      fields: {
        [name: string]:
        | any
        | [React.FunctionComponent<{ [name: string]: any }>];
      };
      widgets: { [name: string]: object };
      definitions: { [name: string]: object };
      formContext: object;
    };
    schema: any;
    uiSchema: any;
    idSchema: any;
    formData: any;
    errorSchema: any;
    formContext: object;
    required: object;
    disabled: object;
    readonly: object;
    layoutGridSchema: any;
    key: string;
    router?: RouterType;
    options: MetadataEditor;
    description: string;
  }

  export type ObjectFieldProps<T = object> = Pick<
    CustomFieldProps<T>,
    | 'schema'
    | 'uiSchema'
    | 'idSchema'
    | 'formData'
    | 'errorSchema'
    | 'formContext'
    | 'required'
    | 'disabled'
    | 'readonly'
    | 'onBlur'
    | 'registry'
    | 'layoutGridSchema'
    | 'key'
    | 'onFocus'
    | 'onChange'
    | 'router'
    | 'options'
    | 'description'
  >;

  export default class ObjectField<P, Q> extends React.Component<P & ObjectFieldProps, Q> {
    // eslint-disable-next-line react/no-unused-class-component-methods, no-unused-vars
    onPropertyChange(
      name: string,
      addedByAdditionalProperties?: boolean
    ): any;

    // eslint-disable-next-line react/no-unused-class-component-methods, no-unused-vars
    onKeyChange(name: string): any;
    // eslint-disable-next-line react/no-unused-class-component-methods, no-unused-vars
    isRequired(name: string): any;
  }
}
