require 'rails_helper'

describe 'Service Draft creation' do
  before do
    login
  end

  context 'when creating a new service draft from scratch' do
    before do
      visit new_service_draft_path
    end

    it 'creates a new blank service draft' do
      within '.eui-breadcrumbs' do
        expect(page).to have_content('Service Drafts')
        expect(page).to have_content('New')
      end
    end

    it 'renders the "Service Information" form' do
      within '.umm-form fieldset h3' do
        expect(page).to have_content('Service Information')
      end
    end

    context 'when saving data into the service draft', js: true do
      before do
        fill_in 'service_draft_draft_name', with: 'test service draft'

        within '.nav-top' do
          click_on 'Done'
        end

        click_on 'Yes'
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Service Draft Created Successfully!')
      end

      context 'when accessing a service draft\'s json' do
        before do
          visit service_draft_path(ServiceDraft.first, :format => 'json')
        end

        it 'displays json' do
          expect(page).to have_content('test service draft')
        end
      end

      context 'when filling in hidden fields' do
        before do
          visit service_draft_path(ServiceDraft.first)
          click_on 'Service Contacts'

          page.execute_script("$('service_draft_draft_contact_persons_0_contact_information_related_urls_0_get_service_full_name').val('Hidden Full Name')")

          within '.nav-top' do
            click_on 'Done'
          end

          visit service_draft_path(ServiceDraft.first, :format => 'json')
        end

        it 'does not save the hidden fields' do
          expect(page).not_to have_content('Hidden Full Name')
        end
      end
    end
  end
end
