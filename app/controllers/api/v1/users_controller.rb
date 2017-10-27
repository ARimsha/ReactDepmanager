class Api::V1::UsersController < ApplicationController
	respond_to :json

	before_action :authenticate_with_token!, only: [:index, :show, :update, :destroy]

	before_action :check_permission, only: [:index, :show, :update, :destroy]
	before_action :set_user, only: [:show, :update, :destroy]

	def index
		respond_with User.all.order(created_at: :desc)
	end

	def show
		respond_with @user
	end

	def create
    if user_signed_in?
    	if current_user.role == 'regular'
    		render json: { errors: "You don't have a permission to create a user" }, status: 403
    		return
    	end
    end

    user = User.new(user_params)
    if user.save
      render json: user, status: 201, location: [:api, :v1, user]
    else
      render json: { errors: user.errors }, status: 422
    end
  end

  def update
	  if @user.update(user_params)
	    render json: @user, status: 200, location: [:api, :v1, @user]
	  else
	    render json: { errors: @user.errors }, status: 422
	  end
	end

	def destroy
	  @user.destroy
	  head 204
	end

  private

  	def set_user
  		@user = User.find_by(id: params[:id])
  		if !@user.present?
  			render json: { errors: "Can't find a user with the id" }, status: 404
  			return
  		end
  	end

  	def check_permission
  		if current_user.role == 'regular'
	      render json: { errors: "You don't have a permission" }, status: 403
	      return
	    end
  	end

    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation, :role)
    end

end
