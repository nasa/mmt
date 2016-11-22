
FactoryGirl.define do
  factory :user, class: User do
    urs_uid 'someuser'
    provider_id 'MMT_2'
    available_providers %w(MMT_2)

    trait :mmt_1 do
      provider_id 'MMT_1'
      available_providers %w(MMT_1)
    end

    trait :mmt_2 do
      provider_id 'MMT_2'
      available_providers %w(MMT_2)
    end

    trait :larc do
      provider_id 'LARC'
      available_providers %w(LARC)
    end

    trait :sedac do
      provider_id 'SEDAC'
      available_providers %w(SEDAC)
    end

    trait :multiple_providers do
      available_providers %w(MMT_1 MMT_2 LARC SEDAC)
    end

    trait :with_echo_id do
      echo_id { Faker::Crypto.md5 }
    end
  end
end
