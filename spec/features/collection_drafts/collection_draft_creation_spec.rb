require 'rails_helper'

describe 'Collection Draft creation', js: true do
  before do
    login
  end

  context 'when creating a new collection draft from scratch' do
    before do
      visit manage_collections_path
      click_on 'Create New Record'
    end

    it 'creates a new blank draft record' do
      expect(page).to have_content('New')
    end

    context 'when saving data into the draft' do
      before do
        fill_in 'Short Name', with: '123'

        within '.nav-top' do
          click_on 'Done'
        end
        # Accept
        click_on 'Yes'
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Collection Draft Created Successfully!')
      end

      context 'when viewing the manage collections page' do
        before do
          visit manage_collections_path
        end

        it 'displays the new draft' do
          within('.open-drafts') do
            expect(page).to have_content("#{today_string} | 123")
            expect(page).to have_content('<Untitled Collection Record>')
          end
        end

        context 'when clicking on the collection draft title' do
          before do
            within('.open-drafts') do
              click_on '123'
            end
          end

          it 'displays the collection drafts preview page' do
            expect(page).to have_content('Drafts')
            expect(page).to have_content('123')
          end

          it 'renders the Download JSON link' do
            expect(page).to have_link('Download JSON')
          end
          context 'when downloading the JSON' do
            let(:id)  {current_url.gsub(/.*\//, '')}
            before do
              @file = "#{Rails.root}/123-#{id}.json"
              click_on 'Download JSON'

              # Seems to need a brief (>0.1) pause to actually find the file.
              sleep(1)
            end
            after do
              FileUtils.rm @file if File.exist?(@file)
            end
      
            it 'downloads the file' do
              expect(File.exist?(@file)).to eq(true)
            end
          end
        end

        context 'when accessing a collection draft\'s json' do
          before do
            visit collection_draft_path(CollectionDraft.first, format: 'json')
          end

          it 'returns the json content' do
            expect(page).to have_content("\"ShortName\": \"123\"\n}")
          end
        end
      end
    end

    context 'when viewing the manage collections page' do
      before do
        visit manage_collections_path
      end

      it 'does not show any open collection drafts' do
        expect(page).to have_no_content('<Untitled Collection Record>')
      end
    end
  end
end
