# MMT-351

require 'rails_helper'

describe 'Draft permissions', js: true, reset_provider: true do
  short_name = 'Tropical Forests'
  entry_title = 'Tropical Forest Observation Record'
  provider = 'MMT_2'
  modal_text = 'requires you change your provider context to'

  before do
    login
    draft = create(:draft, entry_title: entry_title, short_name: short_name, provider_id: provider)
    draft.save
  end

  let(:draft) { Draft.find_by(entry_title: entry_title) }

  context 'when the draft provider is in the users available providers' do
    before do
      user = User.first
      user.provider_id = 'MMT_1'
      user.available_providers = %w(MMT_1 MMT_2)
      user.save
    end

    context 'when trying to visit the draft page directly' do
      before do
        visit draft_path(draft)
      end

      it 'displays warning message link for change provider modal' do
        expect(page).to have_css('.banner-warn')
        expect(page).to have_content("You need to change your current provider to view #{entry_title}")
      end

      context 'when clicking on warning link' do
        before do
          click_link("You need to change your current provider to view #{entry_title}")
          sleep 1
        end

        it 'displays a modal informing user they need to switch providers' do
          expect(page).to have_content("Viewing this draft #{modal_text}")
        end

        context 'when clicking Yes' do
          before do
            within '#not-current-provider-modal' do
              first('a.not-current-provider-link').click
            end
            wait_for_ajax
          end

          it 'switches the provider context' do
            expect(User.first.provider_id).to eq('MMT_2')
          end

          it 'goes to the draft preview page' do
            expect(page).to have_content("#{entry_title} DRAFT RECORD")
            expect(page).to have_content('Publish Draft')
            expect(page).to have_content('Delete Draft')
          end
        end
      end
    end

    context 'when trying to visit the edit draft collection information page directly' do
      before do
        visit "/drafts/#{draft.id}/edit/collection_information"
      end

      it 'displays warning message link for change provider modal' do
        expect(page).to have_css('.banner-warn')
        expect(page).to have_content("You need to change your current provider to edit #{entry_title}")
      end

      context 'when clicking on warning link' do
        before do
          click_link("You need to change your current provider to edit #{entry_title}")
          sleep 1
        end

        it 'displays a modal informing user they need to switch providers' do
          expect(page).to have_content("Editing this draft #{modal_text}")
        end

        context 'when clicking Yes' do
          before do
            within '#not-current-provider-modal' do
              first('a.not-current-provider-link').click
            end
            wait_for_ajax
          end

          it 'switches the provider context' do
            expect(User.first.provider_id).to eq('MMT_2')
          end

          it 'goes to the edit draft collection information page' do
            within '.breadcrumb' do
              expect(page).to have_content('Collection Information')
            end
            within '.content-header h2' do
              expect(page).to have_content('Collection Information')
            end
            expect(page).to have_field('Short Name')
            expect(page).to have_field('Entry Title')
          end
        end
      end
    end
  end

  context 'when the draft provider is not in the user available providers' do
    before do
      user = User.first
      user.provider_id = 'LARC'
      user.available_providers = ['LARC']
      user.save
    end

    context 'when trying to visit the draft page directly' do
      before do
        visit draft_path(draft)
      end

      it 'displays no permissions warning message' do
        expect(page).to have_css('.banner-warn')
        expect(page).to have_content("You don't have the appropriate permissions to view #{entry_title}")
      end
    end

    context 'when trying to visit the edit draft page directly' do
      before do
        visit edit_draft_path(draft)
      end

      it 'displays no permisssions warning message' do
        expect(page).to have_css('.banner-warn')
        expect(page).to have_content("You don't have the appropriate permissions to edit #{entry_title}")
      end
    end
  end
end
