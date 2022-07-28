describe 'Unselecting radio buttons', js: true do
  before do
    login
    @draft = create(:full_collection_draft, user: User.where(urs_uid: 'testuser').first)
  end

  context 'when viewing the Spatial Information form' do
    before do
      visit edit_collection_draft_path(@draft, 'spatial_information')

      open_accordions
    end

    context 'when clearing the Spatial Extent Coordinate System' do
      before do
        within '.geometry' do
          first('.clear-radio-button').click
        end
      end

      it 'clears the correct radio buttons' do
        within '.geometry' do
          expect(page).to have_no_checked_field('Cartesian')
          expect(page).to have_no_checked_field('Geodetic')
          expect(page).to have_no_css('label.required.eui-required-icon')
        end
      end

      it 'does not clear unrelated radio buttons' do
        within '.resolution-and-coordinate-system-type' do
          expect(page).to have_checked_field('Horizontal Data Resolution')
          expect(page).to have_no_checked_field('Local Coordinate System')
        end
      end
    end

    context 'when clearing the Spatial Representation Information Spatial Coverage Type' do
      before do
        within '.spatial-information' do
          click_on 'Clear'
        end
      end

      it 'clears the radio buttons' do
        within '.spatial-information' do
          expect(page).to have_unchecked_field('draft_spatial_information_spatial_coverage_type_VERTICAL')
        end
      end

      it 'hides the form fields' do
        expect(page).to have_css('.spatial-coverage-type.vertical', visible: false)
      end

      it 'clears the form fields' do
        script = "$('.spatial-information .spatial-coverage-type').find('input').val()"
        result = page.evaluate_script(script)

        expect(result).to eq('')
      end
    end
  end

  # data identification form
  context 'when viewing the Data Identification form' do
    before do
      visit edit_collection_draft_path(@draft, 'data_identification')

      open_accordions
    end

    context 'when clearing the Free And Open Data field' do
      before do
        within '.free-and-open-data-field' do
          click_on 'Clear'
        end
      end

      it 'clears the radio buttons' do
        within '.free-and-open-data-field' do
          expect(page).to have_no_checked_field('True')
          expect(page).to have_no_checked_field('False')
        end
      end

      context 'when then selecting a Free and Open Data value' do
        before do
          within '.free-and-open-data-field' do
            choose 'draft_use_constraints_free_and_open_data_true'
          end
        end

        context 'when then clearing the Use Constraints Type' do
          before do
            within '.use-constraint-type-group' do
              click_on 'Clear'
            end
          end

          it 'clears the radio buttons' do
            within '.use-constraint-type-group' do
              expect(page).to have_unchecked_field('use_constraint_type_Description_DescriptionOnly')
              expect(page).to have_unchecked_field('use_constraint_type_Url_LicenseURL')
              expect(page).to have_unchecked_field('use_constraint_type_Text_LicenseText')
            end
          end

          it 'hides the form fields' do
            expect(page).to have_css('.description-only-fields', visible: false)
            expect(page).to have_css('.license-url-fields', visible: false)
            expect(page).to have_css('.license-text-field', visible: false)
          end

          context 'when then choosing a Use Constraint option' do
            before do
              within '.use-constraint-type-group' do
                choose 'use_constraint_type_Url_LicenseURL'
              end
            end

            it 'shows the form fields with no values' do
              within '.use-constraints' do
                within '.description-only-fields' do
                  expect(page).to have_field('Description', with: nil)

                  within '.free-and-open-data-field' do
                    expect(page).to have_no_checked_field('True')
                    expect(page).to have_no_checked_field('False')
                  end
                end
                within '.license-url-fields' do
                  expect(page).to have_field('Linkage', with: '')
                end
              end
            end
          end
        end
      end
    end
  end

  # clear free open

  # clear use constraint type - also clear free and open
end
