# frozen_string_literal: true

# always required fields are top level fields required by the schema, so are always required
# conditionally required fields are fields required by a certain type or object,
# but that parent object is not required, so these fields are required
# only when there is data present in any field in the parent object
# optionally required fields are fields required in an anyOf subschema of a type or object,
# so if there is data in the object, the anyOf required fields will be presented
# as optionally required (eui-required-grey-o), but if there is data in an anyOf
# grouping, those fields will be presented as required
# required -> eui-required-o, optionally required -> eui-required-grey-o

describe 'Conditionally required fields', js: true do
  before do
    login
  end

  context 'when viewing an empty form' do
    before do
      @draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    end

    context 'when viewing a form with always required fields' do
      before do
        visit edit_collection_draft_path(@draft, form: 'collection_information')
      end

      it 'displays the required icons' do
        expect(page).to have_css('label.eui-required-o', count: 5)
      end
    end

    context 'when viewing a form with conditionally required fields' do
      before do
        visit edit_collection_draft_path(@draft, form: 'related_urls')
        open_accordions
      end

      it 'does not display required icons' do
        expect(page).to have_no_css('label.eui-required-o')
      end

      context 'when filling in a form field that causes fields to become required' do
        before do
          fill_in 'Description', with: 'Testing'

          find('body').click
        end

        it 'displays the required icons' do
          expect(page).to have_css('label.eui-required-o', count: 3)
        end

        context 'when clearing a field that causes fields to become required' do
          before do
            fill_in 'Description', with: ''
          end

          it 'removes the required icons' do
            expect(page).to have_no_css('label.eui-required-o')
          end
        end
      end
    end

    context 'when initially viewing a form with optionally required fields' do
      before do
        visit edit_collection_draft_path(@draft, form: 'spatial_information')
        open_accordions

        select 'Horizontal', from: 'Spatial Coverage Type'
        within '.resolution-and-coordinate-system' do
          choose 'Horizontal Data Resolution'
          check 'Gridded Range Resolutions'
        end
      end

      it 'does not display required or optionally icons in the fieldset' do
        within '.resolution-and-coordinate-system' do
          expect(page).to have_no_css('label.eui-required-o')
          expect(page).to have_no_css('label.eui-required-grey-o')
        end
      end

      context 'when filling in a field that causes fields to become required and optionally required' do
        before do
          within '.resolution-and-coordinate-system .gridded-range-resolutions .multiple-item-0' do
            select 'Decimal Degrees', from: 'Unit'
          end
        end

        it 'displays the required icons and optionally required icons' do
          within '.resolution-and-coordinate-system' do
            expect(page).to have_css('label.eui-required-o', count: 1)
            expect(page).to have_css('label.eui-required-grey-o', count: 4)
          end
        end

        context 'when filling in another field that turns optionally required fields into required fields' do
          before do
            within '.resolution-and-coordinate-system .gridded-range-resolutions .multiple-item-0' do
              fill_in 'Maximum X Dimension', with: '50'
            end
            find('body').click
          end

          it 'displays the required icons and optionally required icons' do
            within '.resolution-and-coordinate-system' do
              expect(page).to have_css('label.eui-required-o', count: 3)
              expect(page).to have_css('label.eui-required-grey-o', count: 2)
            end
          end

          context 'when clearing the fields that causes fields to be required or optionally required' do
            before do
              within '.resolution-and-coordinate-system .gridded-range-resolutions .multiple-item-0' do
                fill_in 'Maximum X Dimension', with: ''
                select 'Select Unit', from: 'Unit'
              end
            end

            it 'removes the required and optionally icons in the fieldset' do
              within '.resolution-and-coordinate-system' do
                expect(page).to have_no_css('label.eui-required-o')
                expect(page).to have_no_css('label.eui-required-grey-o')
              end
            end
          end
        end
      end
    end

    context 'when checking the accordion headers for required icons' do
      it 'displays required icons on the Collection Information accordion' do
        visit edit_collection_draft_path(@draft, form: 'collection_information')
        expect(page).to have_css('h3.eui-required-o.always-required', count: 1)
        expect(page).to have_css('h3.eui-required-o.always-required', text: 'Collection Information')
      end

      it 'displays required icons on the Processing Level and Collection Progress accordions' do
        visit edit_collection_draft_path(@draft, form: 'data_identification')
        expect(page).to have_css('h3.eui-required-o.always-required', count: 2)
        expect(page).to have_css('h3.eui-required-o.always-required', text: 'Processing Level')
        expect(page).to have_css('h3.eui-required-o.always-required', text: 'Collection Progress')
      end

      it 'does not display required icons for accordions in Related URLs section' do
        visit edit_collection_draft_path(@draft, form: 'related_urls')
        expect(page).to have_no_css('h3.eui-required-o.always-required')
      end

      it 'displays required icons on the Science Keywords accordion' do
        visit edit_collection_draft_path(@draft, form: 'descriptive_keywords')
        expect(page).to have_css('h3.eui-required-o.always-required', count: 1)
        expect(page).to have_css('h3.eui-required-o.always-required', text: 'Science Keywords')
      end

      it 'displays required icons on the Platforms accordion' do
        visit edit_collection_draft_path(@draft, form: 'acquisition_information')
        expect(page).to have_css('h3.eui-required-o.always-required', count: 1)
        expect(page).to have_css('h3.eui-required-o.always-required', text: 'Platforms')
      end

      it 'displays required icons on the Temporal Extents accordion' do
        visit edit_collection_draft_path(@draft, form: 'temporal_information')
        expect(page).to have_css('h3.eui-required-o.always-required', count: 1)
        expect(page).to have_css('h3.eui-required-o.always-required', text: 'Temporal Extents')
      end

      it 'displays required icons on the Spatial Extents accordion' do
        visit edit_collection_draft_path(@draft, form: 'spatial_information')
        expect(page).to have_css('h3.eui-required-o.always-required', count: 1)
        expect(page).to have_css('h3.eui-required-o.always-required', text: 'Spatial Extent')
      end

      it 'displays required icons on the Data Centers accordion' do
        visit edit_collection_draft_path(@draft, form: 'data_centers')
        expect(page).to have_css('h3.eui-required-o.always-required', count: 1)
        expect(page).to have_css('h3.eui-required-o.always-required', text: 'Data Centers')
      end

      it 'does not display required icons for accordions in Data Contacts section' do
        visit edit_collection_draft_path(@draft, form: 'data_contacts')
        expect(page).to have_no_css('h3.eui-required-o.always-required')
      end

      it 'does not display required icons for accordions in Collection Citations section' do
        visit edit_collection_draft_path(@draft, form: 'collection_citations')
        expect(page).to have_no_css('h3.eui-required-o.always-required')
      end

      it 'does not display required icons for accordions in Metadata Information section' do
        visit edit_collection_draft_path(@draft, form: 'metadata_information')
        expect(page).to have_no_css('h3.eui-required-o.always-required')
      end

      it 'does not display required icons for accordions in Archive And Distribution Information section' do
        visit edit_collection_draft_path(@draft, form: 'archive_and_distribution_information')
        expect(page).to have_no_css('h3.eui-required-o.always-required')
      end
    end
  end

  context 'when viewing a form with data' do
    before do
      @draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
    end

    context 'when viewing a form with always required fields' do
      before do
        visit edit_collection_draft_path(@draft, form: 'collection_information')
      end

      it 'displays the required icons' do
        expect(page).to have_css('label.eui-required-o', count: 5)
      end
    end

    context 'when viewing a form with conditionally required fields' do
      before do
        visit edit_collection_draft_path(@draft, form: 'related_urls')
        open_accordions
      end

      it 'displays the required icons' do
        expect(page).to have_css('label.eui-required-o', count: 24)
      end
    end

    context 'when viewing a form with optionally required fields' do
      before do
        visit edit_collection_draft_path(@draft, form: 'spatial_information')
        open_accordions
      end

      it 'displays the required and optionally required icons' do
        expect(page).to have_css('label.eui-required-o', count: 29)
        expect(page).to have_css('label.eui-required-grey-o', count: 5)
      end
    end
  end
end
