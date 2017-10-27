require 'rails_helper'

RSpec.describe Api::V1::DepositsController, type: :controller do
	
	describe "GET #show" do
    
    context "when show a deposit successfully" do
      before(:each) do
        creator = FactoryGirl.create :user, :role => "admin"
        api_authorization_header creator.auth_token

        @deposit = FactoryGirl.create :deposit
        get :show, params: { id: @deposit.id }
      end

      it "returns the information about a deposit on a hash" do
        deposit_response = json_response
        expect(deposit_response[:bank_name]).to eql @deposit.bank_name
        expect(deposit_response[:account_number]).to eql @deposit.account_number
      end

      it { should respond_with 200 }
    end

    context "when is not shown" do
      before(:each) do
        @deposit = FactoryGirl.create :deposit
        get :show, params: { id: @deposit.id }
      end

      it "returns the errors because the user is not authenticated" do
        deposit_response = json_response
        expect(deposit_response[:errors]).to include "Not authenticated"
      end

      it { should respond_with 401 }
    end

  end

  describe "GET #index" do

    context "when failed to get deposits" do 
      before(:each) do
        4.times { FactoryGirl.create :deposit }
        get :index
      end

      it "returns the errors because the user is not authenticated" do
        deposit_response = json_response
        expect(deposit_response[:errors]).to include "Not authenticated"
      end

      it { should respond_with 401 }
    end

    context "when get deposits successfully" do
      before(:each) do
        creator = FactoryGirl.create :user, :role => "admin"
        api_authorization_header creator.auth_token

        4.times { FactoryGirl.create :deposit }
        get :index
      end

      it "returns 4 records from the database" do
        deposits_response = json_response
        expect(deposits_response.length).to eq(4)
      end

      it { should respond_with 200 }
    end

    context "when filter successfully" do 

      context "when filter bank_name" do
        before(:each) do
          @user = FactoryGirl.create :user, :role => "regular"
          api_authorization_header @user.auth_token

          4.times { FactoryGirl.create :deposit, user_id: @user.id, bank_name: "future bank" }
          5.times { FactoryGirl.create :deposit, user_id: @user.id, bank_name: "past bank" }
          get :index, params: { :bank_name => "future" }
        end

        it "returns 4 records from the database" do
          deposits_response = json_response
          expect(deposits_response.length).to eq(4)
        end

        it { should respond_with 200 }  
      end

      context "when filter amount" do
        before(:each) do
          @user = FactoryGirl.create :user, :role => "regular"
          api_authorization_header @user.auth_token

          4.times { FactoryGirl.create :deposit, user_id: @user.id, initial_amount: rand() * 100 }
          5.times { FactoryGirl.create :deposit, user_id: @user.id, initial_amount: 1000 }
          get :index, params: { :min_amount => 0, :max_amount => 100 }
        end

        it "returns 4 records from the database" do
          deposits_response = json_response
          expect(deposits_response.length).to eq(4)
        end

        it { should respond_with 200 }  
      end

      context "when filter date" do
        before(:each) do
          @user = FactoryGirl.create :user, :role => "regular"
          api_authorization_header @user.auth_token

          4.times { FactoryGirl.create :deposit, user_id: @user.id, start_date: "2010-05-02", end_date: "2016-04-02" }
          5.times { FactoryGirl.create :deposit, user_id: @user.id, start_date: "1990-10-20", end_date: "1999-08-28" }
          get :index, params: { :from_date => "2010-01-01", :to_date => "2017-01-01" }
        end

        it "returns 4 records from the database" do
          deposits_response = json_response
          expect(deposits_response.length).to eq(4)
        end

        it { should respond_with 200 }  
      end
      
    end
    
  end

  describe "POST #create" do
    context "when is successfully created" do
      before(:each) do
        user = FactoryGirl.create :user
        @deposit_attributes = FactoryGirl.attributes_for :deposit, start_date: "1999-09-08", end_date: "2000-09-08"
        api_authorization_header user.auth_token
        post :create, params: { user_id: user.id, deposit: @deposit_attributes }
      end

      it "renders the json representation for the deposit record just created" do
        deposit_response = json_response
        expect(deposit_response[:bank_name]).to eql @deposit_attributes[:bank_name]
        expect(deposit_response[:account_number]).to eql @deposit_attributes[:account_number]
      end

      it { should respond_with 201 }
    end

    context "when is not created" do
      context "invalid attributes for the deposit" do
        before(:each) do
          user = FactoryGirl.create :user
          @invalid_deposit_attributes = { bank_name: "ICM", account_number: "DE4024-5234-2343", initial_amount: 100, interest_percentage: -1.1, taxes_percentage: "ttttt", start_date: "2017-00-22 14:20", end_date: "2017-00-22 18:20" }
          api_authorization_header user.auth_token
          post :create, params: { user_id: user.id, deposit: @invalid_deposit_attributes }
        end

        it "renders an errors json" do
          deposit_response = json_response
          expect(deposit_response).to have_key(:errors)
        end

        it "renders the json errors on why the deposit could not be created" do
          deposit_response = json_response
          expect(deposit_response[:errors][:taxes_percentage]).to include "is not a number"
        end

        it { should respond_with 422 }  
      end
    end

  end

  describe "PUT/PATCH #update" do
    before(:each) do
      @user = FactoryGirl.create :user
      @deposit = FactoryGirl.create :deposit, user: @user, start_date: "1999-09-08", end_date: "2000-09-08"
      api_authorization_header @user.auth_token
    end

    context "when is successfully updated" do
      before(:each) do
        patch :update, params: { user_id: @user.id, id: @deposit.id, deposit: { bank_name: "New Bank" } }
      end

      it "renders the json representation for the updated deposit" do
        deposit_response = json_response
        expect(deposit_response[:bank_name]).to eql "New Bank"
      end

      it { should respond_with 200 }
    end

    context "when is not updated" do
      before(:each) do
        patch :update, params: { user_id: @user.id, id: @deposit.id, deposit: { initial_amount: "one hundred" } }
      end

      it "renders an errors json" do
        deposit_response = json_response
        expect(deposit_response).to have_key(:errors)
      end

      it "renders the json errors on why the deposit could not be created" do
        deposit_response = json_response
        expect(deposit_response[:errors][:initial_amount]).to include "is not a number"
      end

      it { should respond_with 422 }
    end
  end

  describe "DELETE #destroy" do
    before(:each) do
      @user = FactoryGirl.create :user
      @deposit = FactoryGirl.create :deposit, user: @user
      api_authorization_header @user.auth_token
      delete :destroy, params: { user_id: @user.id, id: @deposit.id }
    end

    it { should respond_with 204 }
  end

end
