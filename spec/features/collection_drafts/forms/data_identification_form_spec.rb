describe 'Data identification form', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first, entry_title: 'Empty Draft for Data Identificaiton form')
    visit edit_collection_draft_path(draft, 'data_identification')
  end

  context 'when checking the accordion headers for required icons' do
    it 'displays required icons on the Processing Level and Collection Progress accordions' do
      expect(page).to have_css('h3.eui-required-o.always-required', count: 2)
      expect(page).to have_css('h3.eui-required-o.always-required', text: 'Processing Level')
      expect(page).to have_css('h3.eui-required-o.always-required', text: 'Collection Progress')
    end
  end

  context 'when submitting the form' do
    before do
      click_on 'Expand All'

      # Data Dates
      add_dates

      # Metadata Association
      add_metadata_association

      # Publication Reference
      add_publication_reference

      # CollectionDataType
      within '#collection-data-type' do
        select 'Other', from: 'Collection Data Type'
      end

      # Processing level
      within '.processing-level-fields' do
        select '1A', from: 'ID'
        fill_in 'Description', with: 'Level 1 Description'
      end

      select 'Active', from: 'Collection Progress'
      fill_in 'Quality', with: 'Metadata quality summary'

      # Use Constraints
      within '.use-constraints' do
        within '.use_constraint_type_group' do
          choose 'use_constraint_type_Url_LicenseURL'
        end

        within '.license-description-field' do
          fill_in 'Description', with: 'These are some use constraints for the data identification form spec'
        end

        within '.license-url-fields' do
          fill_in 'Linkage', with: 'https://data-identification-form-spec-linkage.example.com'
        end
      end

      # Access Constraints
      within '.access-constraints' do
        fill_in 'Value', with: 42.0
        fill_in 'Description', with: 'Access constraint description'
      end
    end

    context 'when clicking "Save" to stay on the form' do
      before do
        within '.nav-top' do
          click_on 'Save'
        end

        # output_schema_validation Draft.first.draft
        click_on 'Expand All'
      end

      it 'displays a confirmation message and populates the form with the values' do
        expect(page).to have_content('Collection Draft Updated Successfully!')

        within '.multiple.dates' do
          within '.multiple-item-0' do
            expect(page).to have_field('Type', with: 'CREATE')
            expect(page).to have_field('Date', with: '2015-07-01T00:00:00Z')
          end
          within '.multiple-item-1' do
            expect(page).to have_field('Type', with: 'REVIEW')
            expect(page).to have_field('Date', with: '2015-07-02T00:00:00Z')
          end
        end

        # CollectionDataType
        expect(page).to have_field('Collection Data Type', with: 'OTHER')

        # Processing Level
        within '.processing-level-fields' do
          expect(page).to have_field('ID', with: '1A')
          expect(page).to have_field('Description', with: 'Level 1 Description')
        end

        expect(page).to have_field('Collection Progress', with: 'ACTIVE')
        expect(page).to have_field('Quality', with: 'Metadata quality summary')

        # Use Constraints
        within '.use-constraints' do
          within '.license-description-field' do
            expect(page).to have_field('Description', with: 'These are some use constraints for the data identification form spec')
          end
          within '.license-url-fields' do
            expect(page).to have_field('Linkage', with: 'https://data-identification-form-spec-linkage.example.com')
          end
        end

        # Access constraints
        within '.row.access-constraints' do
          expect(page).to have_field('Value', with: '42.0')
          expect(page).to have_field('Description', with: 'Access constraint description')
        end

        ##### Metadata Association
        within '.multiple.metadata-associations' do
          within '.multiple-item-0' do
            expect(page).to have_field('Type', with: 'SCIENCE ASSOCIATED')
            expect(page).to have_field('Entry Id', with: '12345')
            expect(page).to have_field('Description', with: 'Metadata association description')
            expect(page).to have_field('Version', with: '23')
          end
          within '.multiple-item-1' do
            expect(page).to have_field('Type', with: 'LARGER CITATION WORKS')
            expect(page).to have_field('Entry Id', with: '123abc')
          end
        end

        #### PublicationReference
        within '.multiple.publication-references' do
          within '.multiple-item-0' do
            expect(page).to have_field('draft_publication_references_0_title', with: 'Publication reference title') # Title
            expect(page).to have_field('Publisher', with: 'Publication reference publisher')
            expect(page).to have_field('DOI', with: 'Publication reference DOI')
            expect(page).to have_field('Authority', with: 'Publication reference authority')
            expect(page).to have_field('Author', with: 'Publication reference author')
            expect(page).to have_field('Publication Date', with: '2015-07-01T00:00:00Z')
            expect(page).to have_field('Series', with: 'Publication reference series')
            expect(page).to have_field('Edition', with: 'Publication reference edition')
            expect(page).to have_field('Volume', with: 'Publication reference volume')
            expect(page).to have_field('Issue', with: 'Publication reference issue')
            expect(page).to have_field('Report Number', with: 'Publication reference report number')
            expect(page).to have_field('Publication Place', with: 'Publication reference publication place')
            expect(page).to have_field('Pages', with: 'Publication reference pages')
            expect(page).to have_field('ISBN', with: '1234567890123')
            expect(page).to have_field('Other Reference Details', with: 'Publication reference details')
            within '.online-resource' do
              expect(page).to have_field('Name', with: 'Online Resource Name')
              expect(page).to have_field('Linkage', with: 'http://www.example.com')
              expect(page).to have_field('Description', with: 'Online Resource Description')
              expect(page).to have_field('Protocol', with: 'http')
              expect(page).to have_field('Application Profile', with: 'website')
              expect(page).to have_field('Function', with: 'information')
            end
          end
          within '.multiple-item-1' do
            expect(page).to have_field('draft_publication_references_1_title', with: 'Publication reference title 1') # Title
            expect(page).to have_field('ISBN', with: '9876543210987')
          end
        end
      end
    end
  end

  context 'when viewing the Use Constraints fields' do
    before do
      click_on 'Expand All'
    end

    context 'when modifying the Use Constraint fields' do
      context 'when a required icon should not be shown' do
        context 'when Description Only is selected' do
          before do
            within '.use_constraint_type_group' do
              choose 'use_constraint_type_Description_DescriptionOnly'
            end
          end

          it 'displays the description field correctly' do
            within '.use-constraints' do
              expect(page).to have_css('.license-description-field')

              expect(page).to have_no_css('.eui-required-o')
            end
          end
        end

        context 'when License URL is selected' do
          before do
            within '.use_constraint_type_group' do
              choose 'use_constraint_type_Url_LicenseURL'
            end
          end

          it 'shows the license url fields correctly' do
            within '.use-constraints' do
              find('#use_constraint_type_Url_LicenseURL').click
              expect(page).to have_css('.license-url-fields')
              expect(page).to have_css('.license-description-field')
              expect(page).to have_no_css('.license-text-field')
              expect(page).to have_no_css('.eui-required-o')
            end
          end
        end

        context 'when License Text is selected' do
          before do
            within '.use_constraint_type_group' do
              choose 'use_constraint_type_Text_LicenseText'
            end
          end

          it 'shows the license text fields correctly' do
            within '.use-constraints' do
              expect(page).to have_css('.license-description-field')
              expect(page).to have_css('.license-text-field')
              expect(page).to have_no_css('.license-url-fields')
              expect(page).to have_no_css('.eui-required-o')
            end
          end
        end
      end

      context 'when a required icon should be shown' do
        context 'when Description Only is selected' do
          before do
            within '.use_constraint_type_group' do
              choose 'use_constraint_type_Description_DescriptionOnly'
            end

            within '.license-description-field' do
              fill_in 'Description', with: 'These are some use constraints for the data identification form spec'
            end

            find('body').click
          end

          it 'displays the description field correctly' do
            within '.use-constraints' do
              within '.license-description-field' do
                expect(page).to have_css('.eui-required-o')
              end

            end
          end
        end

        context 'when License URL is selected' do
          before do
            within '.use_constraint_type_group' do
              choose 'use_constraint_type_Url_LicenseURL'
            end

            within '.license-url-fields' do
              fill_in 'Linkage', with: 'https://data-identification-form-spec-linkage.example.com'
            end

            find('body').click
          end

          it 'shows the License URL fields correctly' do
            within '.use-constraints' do
              within '.license-description-field' do
                expect(page).to have_no_css('.eui-required-o')
              end

              within '.license-url-fields' do
                expect(page).to have_css('.eui-required-o')
              end

              expect(page).to have_no_css('.license-text-field')
            end
          end
        end

        context 'when License Text is selected' do
          before do
            within '.use_constraint_type_group' do
              choose 'use_constraint_type_Text_LicenseText'
            end

            fill_in 'License Text', with: 'This is a License Text'
            find('body').click
          end

          it 'shows the License Text field correctly' do
            within '.use-constraints' do
              within '.license-description-field' do
                expect(page).to have_no_css('.eui-required-o')
              end

              expect(page).to have_no_css('.license-url-fields')

              within '.license-text-field' do
                expect(page).to have_css('.eui-required-o')
              end
            end
          end
        end
      end
    end
  end
end
