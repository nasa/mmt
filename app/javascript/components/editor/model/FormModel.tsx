import { MetadataService } from '../services/MetadataService'
import Draft from './Draft'
/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface FormModel {
  documentType: string;
  documentTypeForDisplay: string;
  currentSection: FormSection;
  visitedFields: string[],
  addToVisitedFields(displayName: string),
  fullData: any;
  draft: Draft;
  fullSchema: any;
  fullErrors: FormError[];
  publishErrors: string[];
  formErrors: FormError[];
  uiSchema: object;
  formSections: FormSection[];
  service: MetadataService;
  getFormSchema();
  getFormData();
  getMetadataSpecification();
  setFormData(value: { [key: string]: object })
  migratedSectionName(sectionName: string): string;
  shouldRedirectAfterPublish: boolean;
}
