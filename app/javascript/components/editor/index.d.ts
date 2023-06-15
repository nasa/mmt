/* eslint-disable @typescript-eslint/no-explicit-any */
interface FormError extends RJSFValidationError {
  name?: string;
  property?: string;
  stack?: string;
  params?: {
    limit?: number;
    missingProperty?: string;
  }
  message?: string;
}

interface Window {
  metadataPreview: (id: string, conceptType: string, element: Element) => void;
}

interface HTMLTextAreaElement extends HTMLElement { focus(): boolean | undefined; }
interface HTMLInputElement extends HTMLElement { focus(): boolean | undefined }
interface HTMLSelectElement extends HTMLElement { focus(): boolean | undefined }
interface HTMLDivElement extends HTMLElement { scrollIntoView({ behavior: string }) }

type FormSection = {
  displayName: string;
  properties: string[];
};

type RouterNavigateProps = {
  replace: boolean
}
type RouterType = {
  location?: {
    hash?: string
    search?: string
  },
  navigate?: (path: string, { replace: boolean }: RouterNavigateProps) => void
  params?: {
    id: string,
    sectionName: string,
    fieldName: string,
    offset: string,
    index: number
  }
}

type KeywordObjectType = {
  headers: string[];
  keywords: string[][]
};

declare module 'react-uuid';
type EmptyObject = Record<string, never>

interface DictionaryType {
  [Key: string]: DictionaryType | EmptyObject | string | DictionaryType[]
}
