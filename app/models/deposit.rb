class Deposit < ApplicationRecord

	validates :bank_name, :account_number, :user_id, presence: true

  validates :initial_amount, numericality: { greater_than_or_equal_to: 0 }, presence: true
  validates :interest_percentage, numericality: { greater_than: -100, less_than: 100 }, presence: true
  validates :taxes_percentage, numericality: { greater_than_or_equal_to: 0, less_than: 100 }, presence: true
  validates :start_date, presence: true

  validates_date :start_date, on_or_after: '1900-01-01', on_or_before: '2099-12-31'
  validates_date :end_date, after: :start_date, on_or_before: '2099-12-31', allow_blank: true

  belongs_to :user

end
