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
      click_on 'Revisions'
    end

    it 'has one revision' do
      within 'tbody' do
        expect(page).to have_css('tr', count: 1)
      end
    end

    context 'when editing the collection' do
      before do
        within '.eui-breadcrumbs' do
          click_on 'AE_5DSno_1'
        end

        click_on 'Edit Record'
      end

      it 'displays a draft created confirmation message' do
        expect(page).to have_content('Draft was successfully created')
      end

      it 'creates a new draft' do
        page.document.synchronize do
          expect(Draft.count).to eq(1)
        end
      end

      context 'when the revision is ready to be published' do
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
        end

        it 'is has all required fields filled and no errors' do
          expect(page).to have_no_css('.eui-icon.eui-required-o.icon-green')
          expect(page).to have_no_css('.eui-fa-minus-circle.icon-red')
        end

        context 'when publishing the revision' do
          before do
            click_on 'Publish'
          end

          it 'displays a confirmation message' do
            expect(page).to have_content('Draft was successfully published')
          end

          it 'displays the published record page' do
            expect(page).to have_content 'PUBLISHED RECORD'
          end

          it 'deletes the draft from the database' do
            page.document.synchronize do
              expect(Draft.count).to eq(0)
            end
          end

          context 'when visiting the revisions page' do
            before do
              click_on 'Revisions'
            end

            it 'has more than one revision' do
              within 'tbody' do
                page.assert_selector('tr', :minimum => 2)
              end
            end
          end
        end
      end
    end
  end
end
