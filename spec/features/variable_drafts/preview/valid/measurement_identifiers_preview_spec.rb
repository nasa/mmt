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
        expect(page).to have_css('.umm-preview-field-container', count: 10)

        within '#variable_draft_draft_measurement_identifiers_preview' do

          expect(page).to have_css('h6', text: 'Measurement Identifier 1')

          within '#variable_draft_draft_measurement_identifiers_0_measurement_name_measurement_object_preview' do
            expect(page).to have_css('h5', text: 'Measurement Object')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_0_measurement_name_measurement_object'))
            expect(page).to have_css('p', text: 'Standard Pressure')
          end

          within '#variable_draft_draft_measurement_identifiers_0_measurement_name_measurement_quantity_preview' do
            expect(page).to have_css('h5', text: 'Measurement Quantity')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_0_measurement_name_measurement_quantity'))
            expect(page).to have_css('p', text:'At Top Of Atmosphere')
          end

          within '#variable_draft_draft_measurement_identifiers_0_measurement_source_preview' do
            expect(page).to have_css('h5', text: 'Measurement Source')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_0_measurement_source'))
            expect(page).to have_css('p', text: 'BODC')
          end

          expect(page).to have_css('h6', text: 'Measurement Identifier 2')

          within '#variable_draft_draft_measurement_identifiers_1_measurement_name_measurement_object_preview' do
            expect(page).to have_css('h5', text: 'Measurement Object')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_1_measurement_name_measurement_object'))
            expect(page).to have_css('p', text: 'Entropy')
          end

          within '#variable_draft_draft_measurement_identifiers_1_measurement_name_measurement_quantity_preview' do
            expect(page).to have_css('h5', text: 'Measurement Quantity')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_1_measurement_name_measurement_quantity'))
            expect(page).to have_css('p', text: 'At Top Of Atmosphere')
          end

          within '#variable_draft_draft_measurement_identifiers_1_measurement_source_preview' do
            expect(page).to have_css('h5', text: 'Measurement Source')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_1_measurement_source'))
            expect(page).to have_css('p', text: 'CF')
          end

          expect(page).to have_css('h6', text: 'Measurement Identifier 3')

          within '#variable_draft_draft_measurement_identifiers_2_measurement_name_measurement_object_preview' do
            expect(page).to have_css('h5', text: 'Measurement Object')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_2_measurement_name_measurement_object'))
            expect(page).to have_css('p', text: 'Standard Temperature')
          end

          within '#variable_draft_draft_measurement_identifiers_2_measurement_name_measurement_quantity_preview' do
            expect(page).to have_css('h5', text: 'Measurement Quantity')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_2_measurement_name_measurement_quantity'))
            expect(page).to have_css('p', text: 'At Top Of Atmosphere')
          end

          within '#variable_draft_draft_measurement_identifiers_2_measurement_source_preview' do
            expect(page).to have_css('h5', text: 'Measurement Source')
            expect(page).to have_link(nil, href: edit_variable_draft_path(@draft, 'measurement_identifiers', anchor: 'variable_draft_draft_measurement_identifiers_2_measurement_source'))
            expect(page).to have_css('p', text: 'CSDMS')
          end

        end
      end
    end
  end
end