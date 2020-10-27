describe 'Conditionally required fields for Service forms', js: true do
  before do
    login
  end

  context 'when viewing an empty form' do
    let(:draft) { create(:empty_service_draft, user: User.where(urs_uid: 'testuser').first) }

    context 'when viewing a form with always required fields' do
      before do
        visit edit_service_draft_path(draft)
      end

      it 'displays the required icons' do
        expect(page).to have_css('label.eui-required-o', count: 6)
      end
    end

    context 'when viewing a form with conditionally required fields' do
      before do
        visit edit_service_draft_path(draft, 'service_identification')
        open_accordions
      end

      it 'does not display required icons' do
        expect(page).to have_no_css('label.eui-required-o')
      end

      context 'when filling in a form field that causes fields to become required' do
        before do
          fill_in 'Traceability', with: 'testing'

          find('body').click
        end

        it 'displays the required icons' do
          expect(page).to have_css('label.eui-required-o', count: 1)
        end

        context 'when clearing a field that causes fields to become required' do
          before do
            fill_in 'Traceability', with: ''
          end

          it 'removes the required icons' do
            expect(page).to have_no_css('label.eui-required-o')
          end
        end
      end
    end

    context 'when checking the accordion headers for required icons' do
      it 'displays required icons on the Service Information and URL accordions' do
        visit edit_service_draft_path(draft, form: 'service_information')
        expect(page).to have_css('h3.eui-required-o.always-required', count: 2)
        expect(page).to have_css('h3.eui-required-o.always-required', text: 'Service Information')
        expect(page).to have_css('h3.eui-required-o.always-required', text: 'URL')
      end

      it 'does not display required icons for accordions in Service Identification section' do
        visit edit_service_draft_path(draft, form: 'service_identification')
        expect(page).to have_no_css('h3.eui-required-o.always-required')
      end

      it 'displays required icon on the Service Keyword accordion' do
        visit edit_service_draft_path(draft, form: 'descriptive_keywords')
        expect(page).to have_css('h3.eui-required-o.always-required', count: 1)
        expect(page).to have_css('h3.eui-required-o.always-required', text: 'Service Keyword')
      end

      it 'displays required icon on the Service Organizations accordion' do
        visit edit_service_draft_path(draft, form: 'service_organizations')
        expect(page).to have_css('h3.eui-required-o.always-required', count: 1)
        expect(page).to have_css('h3.eui-required-o.always-required', text: 'Service Organizations')
      end

      it 'does not display required icons for accordions in Service Contacts section' do
        visit edit_service_draft_path(draft, form: 'service_contacts')
        expect(page).to have_no_css('h3.eui-required-o.always-required')
      end

      it 'does not display required icons for accordions in Options section' do
        visit edit_service_draft_path(draft, form: 'options')
        expect(page).to have_no_css('h3.eui-required-o.always-required')
      end

      it 'does not display required icons for accordions in Operation Metadata section' do
        visit edit_service_draft_path(draft, form: 'operation_metadata')
        expect(page).to have_no_css('h3.eui-required-o.always-required')
      end
    end
  end

  context 'when viewing a form with data' do
    let(:draft) { create(:full_service_draft, user: User.where(urs_uid: 'testuser').first) }

    context 'when viewing a form with always required fields' do
      before do
        visit edit_service_draft_path(draft)
      end

      it 'displays the required icons' do
        expect(page).to have_css('label.eui-required-o', count: 6)
      end
    end

    context 'when viewing a form with conditionally required fields' do
      before do
        visit edit_service_draft_path(draft, 'service_identification')
        open_accordions
      end

      it 'displays the required icons' do
        expect(page).to have_css('label.eui-required-o', count: 1)
      end
    end
  end
end
