describe 'Conditionally required fields', js: true do
  before do
    login
  end

  context 'when viewing an empty form' do
    let(:draft) { create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first) }

    context 'when viewing a form with always required fields' do
      before do
        visit edit_variable_draft_path(draft)
      end

      it 'displays the required icons' do
        # Name, Long Name, Definition
        expect(page).to have_css('label.eui-required-o', count: 3)
      end
    end

    context 'when viewing a form with conditionally required fields' do
      before do
        visit edit_variable_draft_path(draft, 'fill_values')
      end

      it 'does not display required icons' do
        expect(page).to have_no_css('label.eui-required-o')
      end

      context 'when filling in a form field that causes fields to become required' do
        before do
          fill_in 'Description', with: 'testing'
          find('body').click
        end

        it 'displays the required icons' do
          expect(page).to have_css('label.eui-required-o', count: 2)
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

    context 'when checking the accordion headers for required icons' do
      it 'displays required icons on the Variable Information accordion' do
        visit edit_variable_draft_path(draft, form: 'variable_information')
        expect(page).to have_css('h3.eui-required-o.always-required', count: 1)
        expect(page).to have_css('h3.eui-required-o.always-required', text: 'Variable Information')
      end

      it 'does not display required icons for accordions in Fill Values section' do
        visit edit_variable_draft_path(draft, form: 'fill_values')
        expect(page).to have_no_css('h3.eui-required-o.always-required')
      end

      it 'does not display required icons for accordions in Dimensions section' do
        visit edit_variable_draft_path(draft, form: 'dimensions')
        expect(page).to have_no_css('h3.eui-required-o.always-required')
      end

      it 'does not display required icons for accordions in Measurement Identifiers section' do
        visit edit_variable_draft_path(draft, form: 'measurement_identifiers')
        expect(page).to have_no_css('h3.eui-required-o.always-required')
      end

      it 'does not display required icons for accordions in Sampling Identifiers section' do
        visit edit_variable_draft_path(draft, form: 'sampling_identifiers')
        expect(page).to have_no_css('h3.eui-required-o.always-required')
      end

      it 'does not display required icons for accordions in Science Keywords section' do
        visit edit_variable_draft_path(draft, form: 'science_keywords')
        expect(page).to have_no_css('h3.eui-required-o.always-required')
      end

      it 'does not display required icons for accordions in Sets section' do
        visit edit_variable_draft_path(draft, form: 'sets')
        expect(page).to have_no_css('h3.eui-required-o.always-required')
      end
    end
  end

  context 'when viewing a form with data' do
    let(:draft) { create(:full_variable_draft, user: User.where(urs_uid: 'testuser').first) }

    context 'when viewing a form with always required fields' do
      before do
        visit edit_variable_draft_path(draft)
      end

      it 'displays the required icons' do
        # Name, Long Name, Definition, AdditionalIdentifiers::Identifier x2,
        # IndexRanges::LatRange, IndexRanges::LonRange
        expect(page).to have_css('label.eui-required-o', count: 7)
      end
    end

    context 'when viewing a form with conditionally required fields' do
      before do
        visit edit_variable_draft_path(draft, 'fill_values')
      end

      it 'displays the required icons' do
        # 4 because 2 sets of fill_values
        expect(page).to have_css('label.eui-required-o', count: 4)
      end
    end
  end
end
