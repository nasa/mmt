# Groups of assertions use in UMM-S form tests

def service_contact_groups_assertions
  within '.multiple.contact-groups > .multiple-item-0' do
    expect(page).to have_select('Roles', selected: ['TECHNICAL CONTACT', 'SCIENCE CONTACT'])
    expect(page).to have_field('Group Name', with: 'Group 1')

    service_contact_information_assertions
  end
  within '.multiple.contact-groups > .multiple-item-1' do
    expect(page).to have_select('Roles', selected: ['SERVICE PROVIDER CONTACT'])
    expect(page).to have_field('Group Name', with: 'Group 2')
  end
end

def service_contact_persons_assertions
  within '.multiple.contact-persons > .multiple-item-0' do
    expect(page).to have_select('Roles', selected: ['SERVICE PROVIDER'])
    expect(page).to have_field('First Name', with: 'First')
    expect(page).to have_field('Middle Name', with: 'Middle')
    expect(page).to have_field('Last Name', with: 'Last')

    service_contact_information_assertions
  end
  within '.multiple.contact-persons > .multiple-item-1' do
    expect(page).to have_select('Roles', selected: ['DEVELOPER'])
    expect(page).to have_field('Last Name', with: 'Last 2')
  end
end

def service_contact_information_assertions
  within all('.contact-information').first do
    expect(page).to have_field('Service Hours', with: '9-6, M-F')
    expect(page).to have_field('Contact Instruction', with: 'Email only')

    within '.multiple.contact-mechanisms' do
      within '.multiple-item-0' do
        expect(page).to have_field('Type', with: 'Email')
        expect(page).to have_field('Value', with: 'example@example.com')
      end
      within '.multiple-item-1' do
        expect(page).to have_field('Type', with: 'Email')
        expect(page).to have_field('Value', with: 'example2@example.com')
      end
    end

    within '.multiple.addresses > .multiple-item-0' do
      within '.multiple.street-addresses' do
        within '.multiple-item-0' do
          expect(page).to have_selector('input[value="300 E Street Southwest"]')
        end
        within '.multiple-item-1' do
          expect(page).to have_selector('input[value="Room 203"]')
        end
        within '.multiple-item-2' do
          expect(page).to have_selector('input[value="Address line 3"]')
        end
      end
      expect(page).to have_field('City', with: 'Washington')
      expect(page).to have_field('State / Province', with: 'DC')
      expect(page).to have_field('Postal Code', with: '20546')
      expect(page).to have_field('Country', with: 'United States')
    end

    within '.multiple.addresses > .multiple-item-1' do
      within '.multiple.street-addresses' do
        within '.multiple-item-0' do
          expect(page).to have_selector('input[value="8800 Greenbelt Road"]')
        end
      end
      expect(page).to have_field('City', with: 'Greenbelt')
      expect(page).to have_field('State / Province', with: 'MD')
      expect(page).to have_field('Postal Code', with: '20771')
      expect(page).to have_field('Country', with: 'United States')
    end


    within '.multiple.online-resources > .multiple-item-0' do
      expect(page).to have_field('Name', with: 'ORN1 Text')
      expect(page).to have_field('Protocol', with: 'ORP1 Text')
      expect(page).to have_field('Linkage', with: 'ORL1 Text')
      expect(page).to have_field('Description', with: 'ORD1 Text')
      expect(page).to have_field('Application Profile', with: 'ORAP1 Text')
      expect(page).to have_field('Function', with: 'ORF1 Text')
    end
    within '.multiple.online-resources > .multiple-item-1' do
      expect(page).to have_field('Name', with: 'ORN2 Text')
      expect(page).to have_field('Protocol', with: 'ORP2 Text')
      expect(page).to have_field('Linkage', with: 'ORL2 Text')
      expect(page).to have_field('Description', with: 'ORD2 Text')
      expect(page).to have_field('Application Profile', with: 'ORAP2 Text')
      expect(page).to have_field('Function', with: 'ORF2 Text')
    end
    within '.multiple.online-resources > .multiple-item-2' do
      expect(page).to have_field('Name', with: 'ORN3 Text')
      expect(page).to have_field('Description', with: 'ORD3 Text')
      expect(page).to have_field('Linkage', with: 'ORL3 Text')
    end
  end
end
