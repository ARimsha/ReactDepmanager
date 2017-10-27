require 'rails_helper'

RSpec.describe Api::V1::UsersController, type: :controller do

  describe "GET #show" do

    context "when is not authenticated" do 
      before(:each) do
        @user = FactoryGirl.create :user
        get :show, params: { id: @user.id }
      end

      it "returns the information about a reporter on a hash" do
        user_response = json_response
        expect(user_response[:errors]).to include "Not authenticated"
      end

      it { should respond_with 401 }
    end

    context "when not have a permission to show a user" do 
      before(:each) do
        creator = FactoryGirl.create :user, :role => "regular"
        api_authorization_header creator.auth_token

        @user = FactoryGirl.create :user
        get :show, params: { id: @user.id }
      end

      it "returns the information about a reporter on a hash" do
        user_response = json_response
        expect(user_response[:errors]).to include "don't have a permission"
      end

      it { should respond_with 403 }
    end

    context "when show user details successfully" do
      before(:each) do
        creator = FactoryGirl.create :user, :role => "admin"
        api_authorization_header creator.auth_token

        @user = FactoryGirl.create :user
        get :show, params: { id: @user.id }
      end

      it "returns the information about a reporter on a hash" do
        user_response = json_response
        expect(user_response[:email]).to eql @user.email
      end

      it { should respond_with 200 }
    end

  end

  describe "POST #create" do

    context "when the creator don't have a permission" do
      before(:each) do
        creator = FactoryGirl.create :user, :role => "regular"
        api_authorization_header creator.auth_token

        @user_attributes = FactoryGirl.attributes_for :user
        post :create, params: { user: @user_attributes }
      end

      it "renders the json representation for the creator don't have a permission" do
        user_response = json_response
        expect(user_response[:errors]).to include "don't have a permission"
      end

      it { should respond_with 403 }
    end

    context "when is successfully created" do
      before(:each) do
        @user_attributes = FactoryGirl.attributes_for :user
        post :create, params: { user: @user_attributes }
      end

      it "renders the json representation for the user record just created" do
        user_response = json_response
        expect(user_response[:email]).to eql @user_attributes[:email]
      end

      it { should respond_with 201 }
    end

    context "when is not created" do
      before(:each) do
        @invalid_user_attributes = { password: "12345678",
                                     password_confirmation: "12345678" }
        post :create, params: { user: @invalid_user_attributes }
      end

      it "renders an errors json" do
        user_response = json_response
        expect(user_response).to have_key(:errors)
      end

      it "renders the json errors on why the user could not be created" do
        user_response = json_response
        expect(user_response[:errors][:email]).to include "can't be blank"
      end

      it { should respond_with 422 }
    end
  end

  describe "PUT/PATCH #update" do

    context "when the creator don't have a permission" do
      before(:each) do
        creator = FactoryGirl.create :user, :role => "regular"
        api_authorization_header creator.auth_token

        @user = FactoryGirl.create :user
        patch :update, params: { id: @user.id, user: { email: "newmail@example.com" } }
      end

      it "renders the json representation for the creator don't have a permission" do
        user_response = json_response
        expect(user_response[:errors]).to include "don't have a permission"
      end

      it { should respond_with 403 }
    end

    context "when is successfully updated" do
      before(:each) do
        creator = FactoryGirl.create :user, :role => "admin"
        api_authorization_header creator.auth_token

        @user = FactoryGirl.create :user
        patch :update, params: { id: @user.id, user: { email: "newmail@example.com" } }
      end

      it "renders the json representation for the updated user" do
        user_response = json_response
        expect(user_response[:email]).to eql "newmail@example.com"
      end

      it { should respond_with 200 }
    end

    context "when is not created" do
      before(:each) do
        creator = FactoryGirl.create :user, :role => "admin"
        api_authorization_header creator.auth_token

        @user = FactoryGirl.create :user
        patch :update, params: { id: @user.id,
                         user: { email: "bademail.com" } }
      end

      it "renders an errors json" do
        user_response = json_response
        expect(user_response).to have_key(:errors)
      end

      it "renders the json errors on why the user could not be created" do
        user_response = json_response
        expect(user_response[:errors][:email]).to include "is invalid"
      end

      it { should respond_with 422 }
    end
  end

  describe "DELETE #destroy" do

    context "when the creator don't have a permission" do
      before(:each) do
        creator = FactoryGirl.create :user, :role => "regular"
        api_authorization_header creator.auth_token

        @user = FactoryGirl.create :user
        delete :destroy, params: { id: @user.id }
      end

      it "renders the json representation for the creator don't have a permission" do
        user_response = json_response
        expect(user_response[:errors]).to include "don't have a permission"
      end

      it { should respond_with 403 }
    end

    context "when is deleted successfully" do 
  	  before(:each) do
        creator = FactoryGirl.create :user, :role => "admin"
        api_authorization_header creator.auth_token

  	    @user = FactoryGirl.create :user
  	    delete :destroy, params: { id: @user.id }
  	  end

  	  it { should respond_with 204 }
    end

	end

end
