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
        # MMT-1894: fixed bug that was hiding the Get Service form. This was causing some conditionally required fields
        # in the Get Service form to not show and thus its required icons were not visible as well, hence the 24 -> 29 count
        expect(page).to have_css('label.eui-required-o', count: 29)
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
