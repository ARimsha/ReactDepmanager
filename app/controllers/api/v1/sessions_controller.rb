class Api::V1::SessionsController < ApplicationController

	def create
    user_password = params[:session][:password]
    user_email = params[:session][:email]
    user = user_email.present? && User.find_by(email: user_email)

    if user.present? and user.valid_password? user_password
      sign_in user, store: false
      user.generate_authentication_token!
      user.save
      render json: user, status: 200, location: [:api, :v1, user]
    else
      render json: { errors: "Invalid email or password" }, status: 422
    end
  end

  def destroy
    user = User.find_by(auth_token: params[:id])
    if user.present?
      user.generate_authentication_token!
      user.save
      render json: { success: "Signed out successfully" }, status: 204
    else
      render json: { errors: "Can't find the session" }, status: 404
    end
    
  end
  
end
