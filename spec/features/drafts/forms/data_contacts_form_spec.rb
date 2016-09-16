require 'rails_helper'

describe 'Data Contacts form', js: true do
  before do
    login
  end

  context 'when creating Non Data Center Contacts' do
    before do
      # need to make sure this is appropriate place
      draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
    end

    context 'when choosing Non Data Center Contact Group' do
      before do
        # may need this if doesn't work right in context level above
        # draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
        # visit draft_path(draft)

        click_on 'Data Contacts', match: :first

        page.document.synchronize do
          choose 'draft_data_contacts_0_data_contact_type_NonDataCenterContactGroup'
        end
      end

      it 'displays the Non Data Center Affiliation field' do
        expect(page).to have_field 'Non Data Center Affiliation'
      end

      context 'when submitting the form' do
        before do
          # fill out contact

          # save

          # use expect to wait for load
          # open_accordions
        end

        it 'displays a confirmation message'

        it 'populates the form with the values'

        it 'saves the data in the right structure in the schema'

        # should make it click done and test on preview page?
      end


    end

    context 'when choosing Non Data Center Contact Person' do
      before do
        # may need this if doesn't work right in context level above
        # draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
        # visit draft_path(draft)

        click_on 'Data Contacts', match: :first

        # add an expect or within or synchronize for wait?
        choose 'draft_data_contacts_0_data_contact_type_NonDataCenterContactPerson'
      end

      it 'displays the Non Data Center Affiliation field' do
        expect(page).to have_field 'Non Data Center Affiliation'
      end

      context 'when submitting the form' do
        before do
          # fill out contact

          # save

          # use expect to wait for load
          # open_accordions
        end

        it 'displays a confirmation message'

        it 'populates the form with the values'

        it 'saves the data in the right structure in the schema'
      end
    end
  end

  context 'when creating Data Center Contacts' do
    context 'when the Data Center has already been added to the draft' do
      data_center_short_name = 'AARHUS-HYDRO'
      data_center_long_name = 'Hydrogeophysics Group, Aarhus University'
      
      before do
        # try to make this work here
        # draft with a Data Center
        draft = create(:draft_all_required_fields, user: User.where(urs_uid: 'testuser').first)


        visit draft_path(draft)
      end

      it 'displays the Data Center on the preview page' do
        within '.data-centers-cards' do
          # TODO worth having more specificity?? (.card-header .card-body)
          expect(page).to have_content(data_center_short_name)
          expect(page).to have_content(data_center_long_name)
        end
      end

      it 'has the Data Center in the draft schema' do
        d = Draft.first
        expect(d.draft['DataCenters'].blank?).to be false
        expect(d.draft['DataCenters'].first['ShortName']).to eq(data_center_short_name)
        expect(d.draft['DataCenters'].first['LongName']).to eq(data_center_long_name)
      end

      context 'when choosing Data Center Contact Person' do
        before do
          # click_on 'Data Contacts', match: :first

          # add an expect or within or synchronize for wait?
          # choose 'draft_data_contacts_0_data_contact_type_DataCenterContactPerson'
        end

        it 'does not display the Non Data Center Affiliation field' do
          expect(page).to have_no_field 'Non Data Center Affiliation'
        end

        context 'when filling out the form' do
          before do
            # fill out contact
          end

          context 'when clicking Save to submit the form' do
            before do
              # save

              # use expect to wait for load
              # open_accordions
            end

            it 'displays a confirmation message'

            it 'populates the form with the values'

            it 'saves the data in the right structure in the schema'
          end

          context 'when clicking Done to submit the form' do
            before do
              within '.nav-top' do
                click_on 'Done'
              end
            end

            it 'displays a confirmation message'

            it 'displays the Contact Group on the preview'

            it 'displays the Data Center with previously entered data on the preview'
          end
        end
      end

      context 'when choosing Data Center Contact Group' do
        before do
          # click_on 'Data Contacts', match: :first

          # add expect, within, or synchronize for wait?
          # choose 'draft_data_contacts_0_data_contact_type_DataCenterContactGroup'
        end

        it 'does not display the Non Data Center Afiiliation field' do
          expect(page).to have_no_field 'Non Data Center Affiliation'
        end

        context 'when filling out the form' do
          before do
            # fill out contact
          end

          context 'when clicking Save to submit the form' do
            before do
              # save

              # use expect to wait for load
              # open_accordions
            end

            it 'displays a confirmation message'

            it 'populates the form with the values'

            it 'saves the data in the right structure in the schema'
          end

          context 'when clicking Done to submit the form' do
            before do
              within '.nav-top' do
                click_on 'Done'
              end
            end

            it 'displays a confirmation message'

            it 'displays the Contact Group on the preview'

            it 'displays the Data Center with previously entered data on the preview'
          end

        end
      end

    end

    context 'when a Data Center has not yet been added to the draft' do
      before do
        # need to make sure this is appropriate place
        draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
        visit draft_path(draft)
      end

      it 'has no Data Centers on the preview page' do
        expect(page).to have_content('There are no listed data centers for this collection.')
      end

      it 'has no Data Centers in the schema' do
        d = Draft.first
        expect(d.draft['DataCenters'].blank?).to be true
      end

      context 'when choosing Data Center Contact Person' do
        before do
          # click_on 'Data Contacts', match: :first

          # add an expect or within or synchronize for wait?
          # choose 'draft_data_contacts_0_data_contact_type_DataCenterContactPerson'
        end

        # is this required for every single time we are creating a data contact?
        it 'does not display the Non Data Center Affiliation field' do
          expect(page).to have_no_field 'Non Data Center Affiliation'
        end

        context 'when filling out the form' do
          before do
            # fill out contact
          end

          context 'when clicking Save to submit the form' do
            before do
              # save

              # use expect to wait for load
              # open_accordions
            end

            it 'displays a confirmation message'

            it 'populates the form with the values'

            it 'saves the contact under a new data center in the schema'
          end

          context 'when clicking Done to submit the form' do
            before do
              # within '.nav-top' do
              #   click_on 'Done'
              # end
            end

            it 'displays a confirmation message'

            it 'displays the Contact Group on the preview'

            it 'displays the Data Center on the preview'
          end
        end
      end

      context 'when choosing Data Center Contact Group' do
        before do
          # click_on 'Data Contacts', match: :first

          # add expect, within, or synchronize for wait?
          # choose 'draft_data_contacts_0_data_contact_type_DataCenterContactGroup'
        end

        it 'does not display the Non Data Center Afiiliation field' do
          expect(page).to have_no_field 'Non Data Center Affiliation'
        end

        context 'when filling out the form' do
          before do
            # fill out contact
          end

          context 'when clicking Save to submit the form' do
            before do
              # save

              # use expect to wait for load
              # open_accordions
            end

            it 'displays a confirmation message'

            it 'populates the form with the values'

            it 'saves the contact under a new data center in the schema'
          end

          context 'when clicking Done to submit the form' do
            before do
              within '.nav-top' do
                click_on 'Done'
              end
            end

            it 'displays a confirmation message'

            it 'displays the Contact Group on the preview'

            it 'displays the Data Center on the preview'
          end

        end
      end

    end
  end
end
