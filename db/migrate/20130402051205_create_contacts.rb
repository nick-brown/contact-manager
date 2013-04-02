class CreateContacts < ActiveRecord::Migration
  def change
    create_table :contacts do |t|
      t.string :first_name
      t.string :last_name
      t.integer :phone
      t.string :address1
      t.string :address2
      t.integer :zip

      t.timestamps
    end
  end
end
