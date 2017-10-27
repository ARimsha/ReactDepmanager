FactoryGirl.define do
  factory :deposit do
    to_create {|instance| instance.save(validate: false) }
    
    bank_name { FFaker::Company.name }
    account_number { FFaker::SSN.ssn }
    initial_amount { rand() * 1000 }
    start_date { FFaker::Time.date }
    end_date { FFaker::Time.date }
    interest_percentage { rand() * 100 }
    taxes_percentage { rand() * 100 }
    user
  end

end
