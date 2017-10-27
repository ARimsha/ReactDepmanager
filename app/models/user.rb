class User < ApplicationRecord
  
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates :auth_token, uniqueness: true

  before_create :generate_authentication_token!

  has_many :deposits, dependent: :destroy

  enum role: ["regular", "manager", "admin"]

  validate :role_should_be_valid

  def generate_authentication_token!
    begin
      self.auth_token = Devise.friendly_token
    end while self.class.exists?(auth_token: auth_token)
  end

  def role=(value)
    super value
    @role_backup = nil
  rescue ArgumentError => exception
    error_message = 'is not a valid role'
    if exception.message.include? error_message
      @role_backup = value
      self[:role] = nil
    else
      raise
    end
  end

  private

  def role_should_be_valid
    if @role_backup
      self.role ||= @role_backup
      error_message = 'is not a valid role'
      errors.add(:role, error_message)
    end
  end
end
