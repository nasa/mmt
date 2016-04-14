require 'rails_helper'

describe 'Publishing revision of collection with non url encoded native id', js: true do
  context 'when finding a published collection with a non url encoded native id' do
    before do
      login
      user = User.first
      user.provider_id = 'LARC'
      user.available_providers << 'LARC'
      user.save

      click_on 'Find'
      click_on 'AE_5DSno'
    end

    context 'when visiting the revisions page' do
      before do
        click_on 'Revisions'
      end

      it 'has one revision' do
        within 'tbody' do
          expect(page).to have_css('tr', count: 1)
        end
      end
    end

    context 'when editing the collection' do
      before do
        click_on 'Edit Record'
      end

      it 'creates a draft that has a url encoded native id' do
        draft = Draft.first
        page.document.synchronize do
          expect(draft.native_id).to eq('AMSR-E/Aqua%20&%205-Day,%20L3%20Global%20Snow%20Water%20Equivalent%20EASE-Grids%20V001')
        end
      end

      context 'when publishing the revision then visiting the revisions page' do
        before do
          # add required data to publish
          within '.metadata' do
            click_on 'Organizations', match: :first
          end
          within '#organizations' do
            add_organization('AARHUS-HYDRO')
            select 'Resource Provider', from: 'Role'
          end
          within '.nav-top' do
            click_on 'Save & Done'
          end

          click_on 'Publish'

          click_on 'Revisions'
        end

        it 'has two revisions' do
          within 'tbody' do
            expect(page).to have_css('tr', count: 2)
          end
        end
      end
    end
  end
end
