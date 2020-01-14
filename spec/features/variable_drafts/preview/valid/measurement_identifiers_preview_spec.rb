describe 'Valid Variable Draft Measurement Identifiers Preview' do
  before do
    login
    @draft = create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first)
    visit variable_draft_path(@draft)
  end

  context 'When examining the Measurement Identifiers section' do
    it 'displays the form title as an edit link' do
      within '#measurement_identifiers-progress' do
        expect(page).to have_link('Measurement Identifiers', href: edit_variable_draft_path(@draft, 'measurement_identifiers'))
      end
    end

    it 'displays the current status icon' do
      within '#measurement_identifiers-progress .status' do
        expect(page).to have_content('Measurement Identifiers is valid')
      end
    end

    it 'displays the correct progress indicators for non required fields' do
      within '#measurement_identifiers-progress .progress-indicators' do
        expect(page).to have_css('.eui-icon.eui-fa-circle.icon-grey.measurement-identifiers')
      end
    end

    it 'displays the stored values correctly within the preview' do
      within '.umm-preview.measurement_identifiers' do
        within '#variable_draft_draft_measurement_identifiers_preview' do
          expect(page).to have_css('h6', text: 'Measurement Identifier 1')

          within '#variable_draft_draft_measurement_identifiers_0_measurement_context_medium_preview' do
            expect(page).to have_css('h5', text: 'Measurement Context Medium')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_0_measurement_context_medium'))
            expect(page).to have_css('p', text: 'ocean')
          end

          within '#variable_draft_draft_measurement_identifiers_0_measurement_context_medium_uri_preview' do
            expect(page).to have_css('h5', text: 'Measurement Context Medium Uri')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_0_measurement_context_medium_uri'))
            expect(page).to have_css('p', text: 'fake.website.gov')
          end

          within '#variable_draft_draft_measurement_identifiers_0_measurement_object_preview' do
            expect(page).to have_css('h5', text: 'Measurement Object')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_0_measurement_object'))
            expect(page).to have_css('p', text: 'sea_ice-meltwater')
          end

          within '#variable_draft_draft_measurement_identifiers_0_measurement_object_uri_preview' do
            expect(page).to have_css('h5', text: 'Measurement Object Uri')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_0_measurement_object_uri'))
            expect(page).to have_css('p', text: 'fake.website.gov')
          end

          expect(page).to have_css('h5', text: 'Measurement Quantities')

          within '#variable_draft_draft_measurement_identifiers_0_measurement_quantities_preview' do
            within '#variable_draft_draft_measurement_identifiers_0_measurement_quantities_0_value_preview' do
              expect(page).to have_css('h5', text: 'Value')
              expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_0_measurement_quantities_0_value'))
              expect(page).to have_css('p', text: 'volume')
            end
            within '#variable_draft_draft_measurement_identifiers_0_measurement_quantities_0_measurement_quantity_uri_preview' do
              expect(page).to have_css('h5', text: 'Measurement Quantity Uri')
              expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_0_measurement_quantities_0_measurement_quantity_uri'))
              expect(page).to have_css('p', text: 'fake.website.gov')
            end
            within '#variable_draft_draft_measurement_identifiers_0_measurement_quantities_1_value_preview' do
              expect(page).to have_css('h5', text: 'Value')
              expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_0_measurement_quantities_1_value'))
              expect(page).to have_css('p', text: 'volume')
            end
            within '#variable_draft_draft_measurement_identifiers_0_measurement_quantities_1_measurement_quantity_uri_preview' do
              expect(page).to have_css('h5', text: 'Measurement Quantity Uri')
              expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_0_measurement_quantities_1_measurement_quantity_uri'))
              expect(page).to have_css('p', text: 'No value for Measurement Quantity Uri provided')
            end
          end

          expect(page).to have_css('h6', text: 'Measurement Identifier 2')

          within '#variable_draft_draft_measurement_identifiers_1_measurement_context_medium_preview' do
            expect(page).to have_css('h5', text: 'Measurement Context Medium')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_1_measurement_context_medium'))
            expect(page).to have_css('p', text: 'ocean')
          end

          within '#variable_draft_draft_measurement_identifiers_1_measurement_context_medium_uri_preview' do
            expect(page).to have_css('h5', text: 'Measurement Context Medium Uri')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_1_measurement_context_medium_uri'))
            expect(page).to have_css('p', text: 'No value for Measurement Context Medium Uri provided')
          end

          within '#variable_draft_draft_measurement_identifiers_1_measurement_object_preview' do
            expect(page).to have_css('h5', text: 'Measurement Object')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_1_measurement_object'))
            expect(page).to have_css('p', text: 'sea_ice-meltwater')
          end

          within '#variable_draft_draft_measurement_identifiers_1_measurement_object_uri_preview' do
            expect(page).to have_css('h5', text: 'Measurement Object Uri')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_1_measurement_object_uri'))
            expect(page).to have_css('p', text: 'No value for Measurement Object Uri provided')
          end

          within '#variable_draft_draft_measurement_identifiers_1_measurement_quantities_preview' do
            within '#variable_draft_draft_measurement_identifiers_1_measurement_quantities_0_value_preview' do
              expect(page).to have_css('h5', text: 'Value')
              expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_1_measurement_quantities_0_value'))
              expect(page).to have_css('p', text: 'volume')
            end
            within '#variable_draft_draft_measurement_identifiers_1_measurement_quantities_0_measurement_quantity_uri_preview' do
              expect(page).to have_css('h5', text: 'Measurement Quantity Uri')
              expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_1_measurement_quantities_0_measurement_quantity_uri'))
              expect(page).to have_css('p', text: 'No value for Measurement Quantity Uri provided')
            end
          end
        end
      end
    end
  end
end
