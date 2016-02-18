# MMT-389

require 'rails_helper'

describe 'Search results permissions for collections', js: true do
  short_name = '12345'
  version = '1'
  entry_title = 'Draft Title'
  provider = 'MMT_2'
  modal_text = 'requires you change your provider context to MMT_2'

  context 'when searching collections' do
    before do
      login
      publish_draft
    end

    context 'when collections are from current provider' do
      before do
        user = User.first
        user.provider_id = 'MMT_2'
        user.save

        full_search(search_term: short_name, record_type: 'Collections')
      end

      it 'search results contain the collection' do
        expect(page).to have_search_query(1, "Keyword: #{short_name}", 'Record State: Published Records')
        expect(page).to have_content(short_name)
        expect(page).to have_content(version)
        expect(page).to have_content(entry_title)
        expect(page).to have_content(provider)
        expect(page).to have_content(today_string)
      end

      context 'when viewing the collection' do
        before do
          within '#collection_search_results' do
            click_on short_name
          end
        end

        it 'displays the editing action links' do
          expect(page).to have_content('EDIT RECORD')
          expect(page).to have_content('Clone this Record')
          expect(page).to have_content('Delete Record')
        end

        context 'when clicking on the edit link' do
          before do
            click_on 'Edit Record'
          end

          it 'creates a draft from the collection and shows the draft preview page' do
            expect(page).to have_content('Draft was successfully created')
            expect(Draft.where(provider_id: 'MMT_2').size).to eq(1)
            expect(page).to have_content("#{entry_title} DRAFT RECORD")
            expect(page).to have_content("Publish Draft")
            expect(page).to have_content("Delete Draft")
          end
        end

      end
    end

    context 'when collections are from available providers' do
      before do
        user = User.first
        user.provider_id = 'MMT_1'
        available_providers = %w(MMT_1 MMT_2)
        user.save

        full_search(search_term: short_name, record_type: 'Collections')
      end

      it 'search results contain the collection' do
        expect(page).to have_search_query(1, "Keyword: #{short_name}", 'Record State: Published Records')
        expect(page).to have_content(short_name)
        expect(page).to have_content(version)
        expect(page).to have_content(entry_title)
        expect(page).to have_content(provider)
        expect(page).to have_content(today_string)
      end

      context 'when viewing the collection' do
        before do
          within '#collection_search_results' do
            click_on short_name
          end
        end

        it 'displays the editing action links' do
          expect(page).to have_content('EDIT RECORD')
          expect(page).to have_content('Clone this Record')
          expect(page).to have_content('Delete Record')
        end

        context 'when clicking on the edit link' do
          before do
            click_on 'Edit Record'
          end

          it 'displays a modal informing the user they need to switch providers' do
            expect(page).to have_content("Editing this collection #{modal_text}")
          end

          context 'when clicking Yes' do
            before do
              find('.not-current-provider-link').click
              wait_for_ajax
            end

            it 'switches the provider context' do
              expect(User.first.provider_id).to eq('MMT_2')
            end

            it 'creates a draft from the collection and shows the draft preview page' do
              expect(page).to have_content('Draft was successfully created')
              expect(Draft.where(provider_id: 'MMT_2').size).to eq(1)
              expect(page).to have_content("#{entry_title} DRAFT RECORD")
              expect(page).to have_content("Publish Draft")
              expect(page).to have_content("Delete Draft")
            end
          end
        end
      end
    end

    context 'when collections are not from available providers' do
      before do
        full_search(search_term: 'CIESIN_SEDAC_ESI_2005', record_type: 'Collections')
      end

      it 'search results contain the collection' do
        expect(page).to have_search_query(1, "Keyword: CIESIN_SEDAC_ESI_2005", 'Record State: Published Records')
        expect(page).to have_content('CIESIN_SEDAC_ESI_2005')
        expect(page).to have_content('2005.00')
        expect(page).to have_content('2005 Environmental Sustainability Index (ESI)')
        expect(page).to have_content('SEDAC')
      end

      context 'when viewing the collection' do
        before do
          within '#collection_search_results' do
            click_on 'CIESIN_SEDAC_ESI_2005'
          end
        end

        it 'does not display the editing action links' do
          expect(page).to have_no_content('EDIT RECORD')
          expect(page).to have_no_content('Clone this Record')
          expect(page).to have_no_content('Delete Record')
        end
      end
    end
  end
end

describe 'Search results permissions for drafts', js: true do
  short_name = 'Climate Change'
  entry_title = 'Climate Observation Record'
  provider = 'MMT_2'
  modal_text = 'requires you change your provider context to MMT_2'

  context 'when searching drafts' do
    before do
      login
      draft = create(:draft, entry_title: entry_title, short_name: short_name, provider_id: provider)
      # draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)
      # visit draft_url(draft)
    end

    context 'when drafts are from current provider' do
      before do
        user = User.first
        user.provider_id = 'MMT_2'
        user.save

        full_search(search_term: entry_title, record_type: 'Drafts')
      end

      it 'search results contain the draft' do
        expect(page).to have_search_query(1, "Drafts Search Term: #{entry_title}", 'Record State: Draft Records')
        within '#collection_search_results' do
          expect(page).to have_content(short_name)
          expect(page).to have_content(entry_title)
          expect(page).to have_content(provider)
          expect(page).to have_content(today_string)
        end
      end

      it 'allows user to view the draft preview page' do
        within '#collection_search_results' do
          click_on short_name
        end

        expect(page).to have_content("#{entry_title} DRAFT RECORD")
        expect(page).to have_content("Publish Draft")
        expect(page).to have_content("Delete Draft")
      end
    end

    context 'when drafts are from available providers' do
      before do
        user = User.first
        user.provider_id = 'MMT_1'
        user.available_providers = %w(MMT_1 MMT_2)
        user.save

        full_search(search_term: short_name, record_type: 'Drafts')
      end

      it 'search results contain the draft' do
        expect(page).to have_search_query(1, "Drafts Search Term: #{short_name}", 'Record State: Draft Records')
        expect(page).to have_content(short_name)
        expect(page).to have_content(entry_title)
        expect(page).to have_content(provider)
        expect(page).to have_content(today_string)
      end

      context 'when trying to view the draft' do
        before do
          within '#collection_search_results' do
            click_on short_name
          end
        end

        it 'displays a modal informing the user they need to switch providers' do
          expect(page).to have_content("Editing this draft #{modal_text}")
        end

        context 'when clicking Yes' do
          before do
            find('.not-current-provider-link').click
            wait_for_ajax
          end

          it 'switches the provider context' do
            expect(User.first.provider_id).to eq('MMT_2')
          end

          it 'shows the draft preview page' do
            expect(page).to have_content("#{entry_title} DRAFT RECORD")
            expect(page).to have_content("Publish Draft")
            expect(page).to have_content("Delete Draft")
          end
        end
      end
    end

    context 'when drafts are not from available providers' do
      before do
        user = User.first
        user.provider_id = 'SEDAC'
        user.available_providers = ['SEDAC']
        user.save

        full_search(search_term: short_name, record_type: 'Drafts')
      end

      it 'does not find the drafts' do
        within '#collection_search_results' do
          expect(page).to have_no_content(short_name)
          expect(page).to have_no_content(entry_title)
          expect(page).to have_no_content(provider)
        end
      end
    end
  end
end
