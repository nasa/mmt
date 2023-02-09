import { MetadataService } from '../services/MetadataService'
import Draft from './Draft'
/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface FormModel {
  documentType: string;
  documentTypeForDisplay:string;
  currentSection: FormSection;
  fullData: any;
  draft: Draft;
  fullSchema: any;
  fullErrors: FormError[];
  formData: { [key: string]: object };
  formSchema: object;
  formErrors: FormError[];
  uiSchema: object;
  formSections: FormSection[];
  service: MetadataService;

  migratedSectionName(sectionName: string): string;
}
