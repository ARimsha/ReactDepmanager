require 'rails_helper'

RSpec.describe Deposit, type: :model do
  
  let(:deposit) { FactoryGirl.build :deposit, :start_date => "2010-09-10", :end_date => "2012-01-02" }
  subject { deposit }

  it { should respond_to(:bank_name) }
  it { should respond_to(:account_number) }
  it { should respond_to(:initial_amount) }
  it { should respond_to(:start_date) }
  it { should respond_to(:end_date) }
  it { should respond_to(:interest_percentage) }
  it { should respond_to(:taxes_percentage) }
  it { should respond_to(:user_id) }

  it { should be_valid }

  it { should validate_presence_of :bank_name }
  it { should validate_presence_of :account_number }
  it { should validate_presence_of :initial_amount }
  it { should validate_numericality_of(:initial_amount).is_greater_than_or_equal_to(0) }
  it { should validate_presence_of :interest_percentage }
  it { should validate_numericality_of(:interest_percentage).is_greater_than(-100) }
  it { should validate_numericality_of(:interest_percentage).is_less_than(100) }
  it { should validate_presence_of :taxes_percentage }
  it { should validate_numericality_of(:taxes_percentage).is_greater_than_or_equal_to(0) }
  it { should validate_numericality_of(:taxes_percentage).is_less_than(100) }

  it { should belong_to :user }
  

end
