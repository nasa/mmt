FactoryGirl.define do
  factory :draft do
    # TODO finish describing a good draft
    draft 'Abstract' => 'This is an abstract field', 'EntryTitle' => 'Title Example'
    entry_title 'Title Example'
  end
end
