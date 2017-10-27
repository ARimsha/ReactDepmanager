require 'rails_helper'

RSpec.describe User, type: :model do
  before { @user = FactoryGirl.build(:user) }

  subject { @user }

  it { should respond_to(:email) }
  it { should respond_to(:password) }
  it { should respond_to(:password_confirmation) }
  it { should respond_to(:auth_token) }

  it { should be_valid }

  it { should validate_presence_of(:email) }
	it { should validate_uniqueness_of(:email) }
	# it { should validate_confirmation_of(:password) }
  
  it { should validate_uniqueness_of(:auth_token)}

  it { should have_many(:deposits) }

  it { should allow_value('example@domain.com').for(:email) }
  
  describe "#generate_authentication_token!" do
    it "generates a unique token" do
      Devise.stub(:friendly_token).and_return("auniquetoken123")
      @user.generate_authentication_token!
      expect(@user.auth_token).to eql "auniquetoken123"
    end

    it "generates another token when one already has been taken" do
      existing_user = FactoryGirl.create(:user, auth_token: "auniquetoken123")
      @user.generate_authentication_token!
      expect(@user.auth_token).not_to eql existing_user.auth_token
    end
  end	

  describe "#deposits association" do

    before do
      @user.save
      3.times { 
        FactoryGirl.create :deposit, user: @user 
      }
    end

    it "destroys the associated deposits on self destruct" do
      deposits = @user.deposits
      @user.destroy
      deposits.each do |deposit|
        expect(Deposit.find(deposit)).to raise_error ActiveRecord::RecordNotFound
      end
    end
  end

  describe "#validate_role" do
    before do
      @user_invalid_role = FactoryGirl.build :user, :role => "random"
    end

    it "role should be regular, manager, admin" do
      @user_invalid_role.valid?
      expect(@user_invalid_role.errors.full_messages.first).to include "is not a valid role"
    end
  end

end

