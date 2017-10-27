class CreateDeposits < ActiveRecord::Migration[5.1]
  def change
    create_table :deposits do |t|
      t.string :bank_name, default: ""
      t.string :account_number, default: ""
      t.decimal :initial_amount, default: 0.0
      t.date :start_date
      t.date :end_date
      t.decimal :interest_percentage, default: 0.0
      t.decimal :taxes_percentage, default: 0.0
      t.integer :user_id

      t.timestamps
    end
    add_index :deposits, :user_id
  end
end
