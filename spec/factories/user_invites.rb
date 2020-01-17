FactoryGirl.define do
  factory :user_invite do
    manager_name { 'Manager Name' }
    manager_email { 'manager@example.com' }
    user_first_name { 'Execktamwrwcqs' }
    user_last_name { '02Wvhznnzjtrunff' }
    user_email { 'pvblvweo@hqdybllrn.sghjz' }
    group_id { '' }
    group_name { '' }
    provider { 'MMT_2' }
    token { 'IlWcqDWjC-0lmXHNkkyNBw' }
    active { true }
  end

  factory :user_invite_with_group, class: UserInvite do
    manager_name { 'Manager Name' }
    manager_email { 'manager@example.com' }
    user_first_name { 'Execktamwrwcqs' }
    user_last_name { '02Wvhznnzjtrunff' }
    user_email { 'pvblvweo@hqdybllrn.sghjz' }
    group_id { 'group1-MMT_2' }
    group_name { 'Test Group' }
    provider { 'MMT_2' }
    token { 'IlWcqDWjC-0lmXHNkkyNBw' }
    active { true }
  end
end
