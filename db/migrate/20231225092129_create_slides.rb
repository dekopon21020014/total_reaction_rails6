class CreateSlides < ActiveRecord::Migration[6.1]
  def change
    create_table :slides do |t|
      t.integer :script_id
      t.timestamps
    end
  end
end
