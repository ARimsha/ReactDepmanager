class Api::V1::DepositsController < ApplicationController
	respond_to :json

	before_action :authenticate_with_token!, only: [:show, :index, :create, :update, :destroy]

  before_action :check_permission_and_select_user, only: [:create, :update, :destroy]

  before_action :set_deposit, only: [:update, :destroy]

  def show
    respond_with Deposit.find(params[:id])
  end

  def index
    if current_user.role == "admin"
      @deposits = Deposit.all.order(created_at: :desc)
    else
      @deposits = current_user.deposits.order(created_at: :desc)
    end

    bank_name = filter_params[:bank_name]
    min_amount = filter_params[:min_amount]
    max_amount = filter_params[:max_amount]
    from_date = filter_params[:from_date]
    to_date = filter_params[:to_date]

    if bank_name.present?
      @deposits = @deposits.where("bank_name ILIKE ?", "%#{bank_name}%")
    end

    if min_amount.present? && is_number?(min_amount)
      @deposits = @deposits.where("initial_amount >= ?", min_amount)
    end

    if max_amount.present? && is_number?(max_amount)
      @deposits = @deposits.where("initial_amount <= ?", max_amount)
    end

    if from_date.present? && is_date?(from_date)
      @deposits = @deposits.where("start_date >= ?", from_date)
    end

    if to_date.present? && is_date?(to_date)
      @deposits = @deposits.where("end_date <= ?", to_date)
    end

    respond_with @deposits
  end

  def create
    deposit = @selected_user.deposits.build(deposit_params)
    if deposit.save
      render json: deposit, status: 201, location: [:api, :v1, deposit]
    else
      render json: { errors: deposit.errors }, status: 422
    end
  end

  def update
    if @deposit.update(deposit_params)
      render json: @deposit, status: 200, location: [:api, :v1, @deposit]
    else
      render json: { errors: @deposit.errors }, status: 422
    end
  end

  def destroy
    @deposit.destroy
    head 204
  end

  private
    
    def check_permission_and_select_user
      if current_user.role == 'admin'

        @selected_user = User.find_by(id: params[:user_id])
        if !@selected_user.present?
          render json: { errors: "Can't find a user with the id" }, status: 404
          return
        end

      else
        @selected_user = current_user
      end
    end

    def set_deposit
      @deposit = @selected_user.deposits.find_by(id: params[:id])
      if !@deposit.present?
        render json: { errors: "Can't find a deposit with the id" }, status: 404
        return
      end
    end

    def is_number? string
      true if Float(string) rescue false
    end

    def is_date? string
      true if Date.parse(string) rescue false
    end

    def deposit_params
      params.require(:deposit).permit(:bank_name, :account_number, :initial_amount, :start_date, :end_date, :interest_percentage, :taxes_percentage )
    end

    def filter_params
      params.permit(:min_amount, :max_amount, :bank_name, :from_date, :to_date)
    end
end